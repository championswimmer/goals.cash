import { Asset, ErrorDeficitExceedsAssets, Expense, Income, Liability, Portfolio, SavingsDistribution, SpendPriority } from ".";


export class PortfolioSimulator {
  private _portfolio: Portfolio;

  constructor(portfolio: Portfolio) {
    this._portfolio = portfolio;
  }

  private getActiveAssetsForYear(year: number): Asset[] {
    return this._portfolio.assets.filter(asset => asset.initYear <= year);
  }

  private getActiveLiabilitiesForYear(year: number): Liability[] {
    return this._portfolio.liabilities.filter(liability => liability.initYear <= year);
  }

  private getActiveIncomesForYear(year: number): Income[] {
    return this._portfolio.incomes.filter(income => income.initYear <= year);
  }

  private getActiveExpensesForYear(year: number): Expense[] {
    return this._portfolio.expenses.filter(expense => expense.initYear <= year);
  }

  private getSavingsDistributionForYear(year: number): SavingsDistribution {
    return this._portfolio.getSavingsDistribution(year);
  }

  private getSpendPriorityForYear(year: number): SpendPriority {
    return this._portfolio.getSpendPriority(year);
  }

  simulate() {
    // run from start to end of portfolio
    for (let year = this._portfolio.startYear; year <= this._portfolio.endYear; year++) {
      const activeAssets = this.getActiveAssetsForYear(year);
      const activeLiabilities = this.getActiveLiabilitiesForYear(year);
      const activeIncomes = this.getActiveIncomesForYear(year);
      const activeExpenses = this.getActiveExpensesForYear(year);
      const savingsDistribution = this.getSavingsDistributionForYear(year);
      const spendPriority = this.getSpendPriorityForYear(year);

      // calculate gross income 
      let grossIncome = 0;
      for (const income of activeIncomes) {
        grossIncome += income.getPlotPoint(year).value;
      }

      // calculate gross expenses
      let grossExpenses = 0;
      for (const expense of activeExpenses) {
        grossExpenses += expense.getPlotPoint(year).value;
      }

      // calculate net income
      const netIncome = grossIncome - grossExpenses;
      this._portfolio.netFlow.updatePlotPoint(year, netIncome);

      console.log('year', year, 'netIncome', netIncome, 'grossIncome', grossIncome, 'grossExpenses', grossExpenses);

      // case: net income is positive
      if (netIncome >= 0) {
        // split it by the ratio available in savingsDistribution and update those assets
        savingsDistribution.savingsAssetMap
          .filter(({ asset }) => asset.initYear < year) // inflow only into assets that have started
          .forEach(({ asset, percentage }) => {
            const inflowToAsset = (percentage * netIncome) / 100;
            asset.updatePlotPoint(year, inflowToAsset);
          });
      } else {
        // case: net income is negative
        // go through assets in order of spendPriority and spend from them
        let deficit = netIncome; // NOTE: this is negative

        // first-pass: without violating spendCutoff
        spendPriority.spendPriorityMap
          .filter(({ asset }) => asset.initYear < year) // spend from assets that have started
          .sort((a, b) => a.priority - b.priority) // sort by priority, just for sanity (should already be sorted)
          .forEach(({ asset, priority }) => {
            if (deficit === 0) { // no deficit left to spend
              return;
            }
            if (asset.getPlotPoint(year - 1).value - asset.spendCutoff <= 0) {
              return; // asset below spendCutoff, skip
            }
            // check if we can spend entirely from this asset
            if (asset.getPlotPoint(year - 1).value - asset.spendCutoff > -deficit) {
              // we can spend from this asset
              asset.updatePlotPoint(year, deficit);
              deficit = 0;
            } else {
              // spend what we can and move on
              const amountToSpend = -(asset.getPlotPoint(year - 1).value - asset.spendCutoff);
              asset.updatePlotPoint(year, amountToSpend);
              deficit = deficit - amountToSpend;
            }
          })

        // second-pass: without considering spendCutoff
        if (deficit !== 0) {
          spendPriority.spendPriorityMap
            .filter(({ asset }) => asset.initYear < year) // spend from assets that have started
            .sort((a, b) => a.priority - b.priority) // sort by priority, just for sanity (should already be sorted)
            .forEach(({ asset, priority }) => {
              if (deficit === 0) { // no deficit left to spend
                return;
              }
              // check if we can spend entirely from this asset
              if (asset.getPlotPoint(year - 1).value > -deficit) {
                // we can spend from this asset (ignoring the spendCutoff)
                asset.updatePlotPoint(year, deficit, true);
                deficit = 0;
              } else {
                // spend what we can and move on
                const amountToSpend = -asset.getPlotPoint(year - 1).value;
                asset.updatePlotPoint(year, amountToSpend, true);
                deficit = deficit - amountToSpend
              }
            })
        }

        // if deficit still exists, throw an error
        if (deficit < 0) {
          throw new ErrorDeficitExceedsAssets(`Deficit of ${deficit} after spending from all assets. Portfolio not sustainable.`);
        }
      }

      // update all assets (a dragnet to cover assets that might not be in distribution or priority)
      // this is safe to do because updatePlotPoint() handles repeat calls with 0 inflows gracefully
      for (const asset of activeAssets) {
        console.log('updatePlotPoint',year, asset.name, asset.getPlotPoint(year).value);
        asset.updatePlotPoint(year, 0);
      }
    }
  }

}
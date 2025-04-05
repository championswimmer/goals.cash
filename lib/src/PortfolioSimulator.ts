import { Asset, Expense, Income, Liability, Portfolio, SavingsDistribution, SpendPriority } from ".";


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

      // case: net income is positive
      if (netIncome >= 0) {
        // split it by the ratio available in savingsDistribution and update those assets
        savingsDistribution.savingsAssetMap
          .filter(({ asset }) => asset.initYear < year) // inflow only into assets that have started
          .forEach(({ asset, percentage }) => {
            console.log(year, asset.name, percentage, asset);
            const inflowToAsset = (percentage * netIncome) / 100;
            asset.updatePlotPoint(year, inflowToAsset);
          });
      }
    }
  }

}
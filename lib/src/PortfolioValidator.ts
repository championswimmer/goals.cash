import { Asset, Expense, Income, Liability, SavingsDistribution, SpendPriority } from ".";
import { ErrorOutsidePortfolioBounds, ErrorSavingsDistributionGap, ErrorSavingsDistributionOverlap, ErrorSpendPriorityGap, ErrorSpendPriorityOverlap } from "./commons/errors";
import { Portfolio } from "./Portfolio";

export class PortfolioValidator {
  portfolio: Portfolio;

  constructor(portfolio: Portfolio) {
    this.portfolio = portfolio;
  }

  validate() {
    this.portfolio.assets.forEach(asset => this.validateAsset(asset));
    this.portfolio.liabilities.forEach(liability => this.validateLiability(liability));
    this.portfolio.incomes.forEach(income => this.validateIncome(income));
    this.portfolio.expenses.forEach(expense => this.validateExpense(expense));
    this.validateSavingsDistributionList();
    this.validateSpendPriorityList();
  }

  validateAsset(asset: Asset) {
    if (asset.initYear < this.portfolio.currentYear || asset.initYear > this.portfolio.endYear) {
      throw new ErrorOutsidePortfolioBounds(`Asset ${asset.name} is outside the portfolio bounds`);
    }
  }

  validateLiability(liability: Liability) {
    if (liability.initYear < this.portfolio.currentYear || liability.initYear > this.portfolio.endYear) {
      throw new ErrorOutsidePortfolioBounds(`Liability ${liability.name} is outside the portfolio bounds`);
    }
  }

  validateIncome(income: Income) {
    let valid = income.initYear >= this.portfolio.startYear && income.initYear <= this.portfolio.endYear;
    valid &&= income.endYear >= this.portfolio.startYear && income.endYear <= this.portfolio.endYear;
    if (!valid) {
      throw new ErrorOutsidePortfolioBounds(`Income ${income.name} is outside the portfolio bounds`);
    }
  }

  validateExpense(expense: Expense) {
    let valid = expense.initYear >= this.portfolio.startYear && expense.initYear <= this.portfolio.endYear;
    valid &&= expense.endYear >= this.portfolio.startYear && expense.endYear <= this.portfolio.endYear;
    if (!valid) {
      throw new ErrorOutsidePortfolioBounds(`Expense ${expense.name} is outside the portfolio bounds`);
    }
  }

  /**
   * Validates a single savings distribution to be within the bounds of the portfolio
   * @param savingsDistribution to validate
   */
  validateSavingsDistribution(savingsDistribution: SavingsDistribution) {
    let valid = savingsDistribution.startYear >= this.portfolio.startYear;
    valid &&= savingsDistribution.endYear <= this.portfolio.endYear;
    valid &&= savingsDistribution.endYear >= savingsDistribution.startYear;
    if (!valid) {
      throw new ErrorOutsidePortfolioBounds(`Savings distribution ${savingsDistribution.startYear} - ${savingsDistribution.endYear} is outside the portfolio bounds`);
    }
  }

  /**
   * Validates a single spend priority to be within the bounds of the portfolio
   * @param spendPriority 
   */
  validateSpendPriority(spendPriority: SpendPriority) {
    let valid = spendPriority.startYear >= this.portfolio.startYear;
    valid &&= spendPriority.endYear <= this.portfolio.endYear;
    valid &&= spendPriority.endYear >= spendPriority.startYear;
    if (!valid) {
      throw new ErrorOutsidePortfolioBounds(`Spend priority ${spendPriority.startYear} - ${spendPriority.endYear} is outside the portfolio bounds`);
    }
  }

  /**
   * Validates that the entire savings distribution list is complete and consistent: 
   * - No overlapping savings distributions 
   * - Entire portfolio is covered by savings distributions
   */
  validateSavingsDistributionList() {
    if (this.portfolio.assets.length === 0) {
      // noop, nothing to do
      console.warn("No assets defined, skipping savings distribution validation");
      return;
    }

    const distributions = this.portfolio.savingsDistributions;

    if (distributions.length === 0) {
      throw new ErrorSavingsDistributionGap("No savings distributions defined");
    }

    const minStartYear = Math.max(this.portfolio.assets[0].initYear, this.portfolio.currentYear)

    // Check that first distribution starts at beginning of first asset or current year (whichever is later)
    if (distributions[0].startYear !== minStartYear) {
      throw new ErrorSavingsDistributionGap("First savings distribution must start at beginning of first asset");
    }

    // Check that last distribution ends at portfolio end
    if (distributions[distributions.length - 1].endYear !== this.portfolio.endYear) {
      throw new ErrorSavingsDistributionGap("Last savings distribution must end at portfolio end year");
    }

    // Check for gaps and overlaps between distributions
    for (let i = 0; i < distributions.length - 1; i++) {
      const current = distributions[i];
      const next = distributions[i + 1];

      // Check for gap and overlap
      if (current.endYear + 1 !== next.startYear) {
        // Check for overlap
        if (current.endYear >= next.startYear) {
          throw new ErrorSavingsDistributionOverlap(`Overlapping savings distributions detected at year ${next.startYear}`);
        } else { // gap
          throw new ErrorSavingsDistributionGap(`Gap detected between savings distributions at year ${current.endYear}`);
        }
      }

    }
  }


  /**
   * Validates that the entire spend priority list is complete and consistent: 
   * - No overlapping spend priorities
   * - Entire portfolio is covered by spend priorities
   */
  validateSpendPriorityList() {
    if (this.portfolio.assets.length === 0) {
      // noop, nothing to do
      console.warn("No assets defined, skipping spend priority validation");
      return;
    }

    const spendPriorities = this.portfolio.spendPriorities;

    if (spendPriorities.length === 0) {
      throw new ErrorSpendPriorityGap("No spend priorities defined");
    }

    const minStartYear = Math.max(this.portfolio.assets[0].initYear, this.portfolio.currentYear)

    // Check that first spend priority starts at beginning of first asset or current year (whichever is later)
    if (spendPriorities[0].startYear !== minStartYear) {
      throw new ErrorSpendPriorityGap("First spend priority must start at beginning of first asset");
    }

    // Check that last spend priority ends at portfolio end 
    if (spendPriorities[spendPriorities.length - 1].endYear !== this.portfolio.endYear) {
      throw new ErrorSpendPriorityGap("Last spend priority must end at portfolio end year");
    }

    // Check for gaps and overlaps between spend priorities
    for (let i = 0; i < spendPriorities.length - 1; i++) {
      const current = spendPriorities[i];
      const next = spendPriorities[i + 1];

      // Check for gap and overlap
      if (current.endYear + 1 !== next.startYear) {
        // Check for overlap
        if (current.endYear >= next.startYear) {
          throw new ErrorSpendPriorityOverlap(`Overlapping spend priorities detected at year ${next.startYear}`);
        } else { // gap
          throw new ErrorSpendPriorityGap(`Gap detected between spend priorities at year ${current.endYear}`);
        }
      }
    }


  }

}
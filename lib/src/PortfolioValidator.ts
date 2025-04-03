import { Asset, Expense, Income, Liability, SavingsDistribution } from ".";
import { Portfolio } from "./Portfolio";

class ErrorOutsidePortfolioBounds extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_PORTFOLIO_BOUNDS";
  }
}

class ErrorSavingsDistributionGap extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_SAVINGS_DISTRIBUTION_GAP";
  }
}

class ErrorSavingsDistributionOverlap extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_SAVINGS_DISTRIBUTION_OVERLAP";
  }
}



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
  }

  validateAsset(asset: Asset) {
    if (asset.initYear < this.portfolio.startYear || asset.initYear > this.portfolio.endYear) {
      throw new ErrorOutsidePortfolioBounds(`Asset ${asset.name} is outside the portfolio bounds`);
    }
  }

  validateLiability(liability: Liability) {
    if (liability.initYear < this.portfolio.startYear || liability.initYear > this.portfolio.endYear) {
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
   * Validates that the entire savings distribution list is complete and consistent: 
   * - No overlapping savings distributions 
   * - Entire portfolio is covered by savings distributions
   */
  validateSavingsDistributions() {
    const distributions = this.portfolio.savingsDistributions;
    
    if (distributions.length === 0) {
      throw new ErrorSavingsDistributionGap("No savings distributions defined");
    }

    // Check that first distribution starts at portfolio start
    if (distributions[0].startYear !== this.portfolio.startYear) {
      throw new ErrorSavingsDistributionGap("First savings distribution must start at portfolio start year");
    }

    // Check that last distribution ends at portfolio end
    if (distributions[distributions.length - 1].endYear !== this.portfolio.endYear) {
      throw new ErrorSavingsDistributionGap("Last savings distribution must end at portfolio end year");
    }

    // Check for gaps and overlaps between distributions
    for (let i = 0; i < distributions.length - 1; i++) {
      const current = distributions[i];
      const next = distributions[i + 1];

      // Check for gap
      if (current.endYear + 1 !== next.startYear) {
        throw new ErrorSavingsDistributionGap(`Gap detected between savings distributions at year ${current.endYear}`);
      }

      // Check for overlap
      if (current.endYear >= next.startYear) {
        throw new ErrorSavingsDistributionOverlap(`Overlapping savings distributions detected at year ${next.startYear}`);
      }
    }
  }

}
import { Asset, Expense, Income, Liability } from ".";
import { Portfolio } from "./Portfolio";

class ErrorOutsidePortfolioBounds extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_PORTFOLIO_BOUNDS";
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

  



}
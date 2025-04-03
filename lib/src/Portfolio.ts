import { Asset, Expense, Income, Liability, SavingsDistribution } from ".";
import { PortfolioValidator } from "./PortfolioValidator";

export class Portfolio {
  startYear: number;
  endYear: number; 
  currentYear: number; 
  currentAge: number;

  private validator!: PortfolioValidator;

  assets: Asset[] = [];
  liabilities: Liability[] = [];
  incomes: Income[] = [];
  expenses: Expense[] = [];
  savingsDistributions: SavingsDistribution[] = [];

  constructor(startYear: number, endYear: number, currentYear: number, currentAge: number) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.currentYear = currentYear;
    this.currentAge = currentAge;
    this.validator = new PortfolioValidator(this);
  }

  addAsset(asset: Asset) {
    this.validator.validateAsset(asset);
    this.assets.push(asset);
  }

  addLiability(liability: Liability) {
    this.validator.validateLiability(liability);
    this.liabilities.push(liability);
  }

  addIncome(income: Income) {
    this.validator.validateIncome(income);
    this.incomes.push(income);
  }

  addExpense(expense: Expense) {
    this.validator.validateExpense(expense);
    this.expenses.push(expense);
  }
 
}
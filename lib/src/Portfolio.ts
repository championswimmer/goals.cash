import { Asset, Expense, Income, Liability, SavingsDistribution, SpendPriority } from ".";
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
  spendPriorities: SpendPriority[] = [];
  
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
    // keep sorted by start year
    this.assets.sort((a, b) => a.initYear - b.initYear);
  }

  addLiability(liability: Liability) {
    this.validator.validateLiability(liability);
    this.liabilities.push(liability);
    // keep sorted by start year
    this.liabilities.sort((a, b) => a.initYear - b.initYear);
  }

  addIncome(income: Income) {
    this.validator.validateIncome(income);
    this.incomes.push(income);
    // keep sorted by start year
    this.incomes.sort((a, b) => a.initYear - b.initYear);
  }

  addExpense(expense: Expense) {
    this.validator.validateExpense(expense);
    this.expenses.push(expense);
    // keep sorted by start year
    this.expenses.sort((a, b) => a.initYear - b.initYear);
  }

  addSavingsDistribution(savingsDistribution: SavingsDistribution) {
    this.validator.validateSavingsDistribution(savingsDistribution);
    this.savingsDistributions.push(savingsDistribution);
    // re-sort the savings distributions by start year 
    this.savingsDistributions.sort((a, b) => a.startYear - b.startYear);
  }

  addSpendPriority(spendPriority: SpendPriority) {
    this.validator.validateSpendPriority(spendPriority);
    this.spendPriorities.push(spendPriority);
    // re-sort the spend priorities by start year 
    this.spendPriorities.sort((a, b) => a.startYear - b.startYear);
  }

  getSavingsDistribution(year: number): SavingsDistribution {
    // find the savings distribution that has the year in its range
    const savingsDistribution = this.savingsDistributions.find(savingsDistribution => year >= savingsDistribution.startYear && year <= savingsDistribution.endYear);
    if (!savingsDistribution) {
      throw new Error("No savings distribution found for the year");
    }
    return savingsDistribution;
  }

  getSpendPriority(year: number): SpendPriority {
    // find the spend priority that has the year in its range
    const spendPriority = this.spendPriorities.find(spendPriority => year >= spendPriority.startYear && year <= spendPriority.endYear);
    if (!spendPriority) {
      throw new Error("No spend priority found for the year");
    }
    return spendPriority;
  }
 
}
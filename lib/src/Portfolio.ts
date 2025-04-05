import { Asset, Expense, Income, Liability, SavingsDistribution, SpendPriority } from ".";
import { PortfolioValidator } from "./PortfolioValidator";

export class Portfolio {
  startYear: number;
  endYear: number; 
  currentYear: number; 
  currentAge: number;

  assets: Asset[] = [];
  liabilities: Liability[] = [];
  incomes: Income[] = [];
  expenses: Expense[] = [];
  savingsDistributions: SavingsDistribution[] = [];
  spendPriorities: SpendPriority[] = [];

  private constructor(startYear: number, endYear: number, currentYear: number, currentAge: number) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.currentYear = currentYear;
    this.currentAge = currentAge;
  }

  static Builder = class {
    public validator!: PortfolioValidator;
    public portfolio!: Portfolio;
    
    constructor(startYear: number, endYear: number, currentYear: number, currentAge: number) {
      this.portfolio = new Portfolio(startYear, endYear, currentYear, currentAge);
      this.validator = new PortfolioValidator(this.portfolio);
    }

    from(portfolio: Portfolio): this {
      this.portfolio = portfolio;
      this.validator = new PortfolioValidator(this.portfolio);
      return this;
    }
    
    addAsset(asset: Asset): this {
      this.validator.validateAsset(asset);
      this.portfolio.assets.push(asset);
      // keep sorted by start year
      this.portfolio.assets.sort((a, b) => a.initYear - b.initYear);
      return this;

    }

    addLiability(liability: Liability): this {
      this.validator.validateLiability(liability);
      this.portfolio.liabilities.push(liability);
      // keep sorted by start year
      this.portfolio.liabilities.sort((a, b) => a.initYear - b.initYear);
      return this;
    }
  
    addIncome(income: Income): this {
      this.validator.validateIncome(income);
      this.portfolio.incomes.push(income);
      // keep sorted by start year
      this.portfolio.incomes.sort((a, b) => a.initYear - b.initYear);
      return this;
    }
  
    addExpense(expense: Expense): this {
      this.validator.validateExpense(expense);
      this.portfolio.expenses.push(expense);
      // keep sorted by start year
      this.portfolio.expenses.sort((a, b) => a.initYear - b.initYear);
      return this;
    }
  
    addSavingsDistribution(savingsDistribution: SavingsDistribution): this {
      this.validator.validateSavingsDistribution(savingsDistribution);
      this.portfolio.savingsDistributions.push(savingsDistribution);
      // re-sort the savings distributions by start year 
      this.portfolio.savingsDistributions.sort((a, b) => a.startYear - b.startYear);
      return this;
    }
  
    addSpendPriority(spendPriority: SpendPriority): this {
      this.validator.validateSpendPriority(spendPriority);
      this.portfolio.spendPriorities.push(spendPriority);
      // re-sort the spend priorities by start year 
      this.portfolio.spendPriorities.sort((a, b) => a.startYear - b.startYear);
      return this;
    }

    build(): Portfolio {
      this.validator.validate();
      return this.portfolio;
    }
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
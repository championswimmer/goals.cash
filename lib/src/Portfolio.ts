import { Asset, Expense, Income, Liability } from ".";

export class Portfolio {
  startYear: number;
  endYear: number; 
  currentYear: number; 
  currentAge: number; 

  assets: Asset[] = [];
  liabilities: Liability[] = [];
  incomes: Income[] = [];
  expenses: Expense[] = [];

  constructor(startYear: number, endYear: number, currentYear: number, currentAge: number) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.currentYear = currentYear;
    this.currentAge = currentAge;
  }

  addAsset(asset: Asset) {
    if (asset.initYear < this.startYear) {
      throw new Error("Asset cannot be added before the start year");
    }
    this.assets.push(asset);
  }

  addLiability(liability: Liability) {
    if (liability.initYear < this.startYear) {
      throw new Error("Liability cannot be added before the start year");
    }
    this.liabilities.push(liability);
  }

  addIncome(income: Income) {
    if (income.initYear < this.startYear) {
      throw new Error("Income cannot be added before the start year");
    }
    this.incomes.push(income);
  }

  addExpense(expense: Expense) {
    if (expense.initYear < this.startYear) {
      throw new Error("Expense cannot be added before the start year");
    }
    this.expenses.push(expense);
  }
  
  


 
}
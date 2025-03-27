import IncomeStream from "./IncomeStream";
import ExpenseStream from "./ExpenseStream";
import Asset from "./Asset";
import Liability from "./Liability";
import MajorExpense from "./MajorExpense";
import { PlotType } from "./types";


export default class Portfolio {
  startYear!: number;
  endYear!: number;
  currentYear!: number;
  userAge!: number;
  allowNegative!: boolean;
  incomeStreams: IncomeStream[] = [];
  expenseStreams: ExpenseStream[] = [];
  assets: Asset[] = [];
  liabilities: Liability[] = [];
  majorExpenses: MajorExpense[] = [];

  constructor(startYear: number, endYear: number, currentYear: number, userAge: number, allowNegative: boolean) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.currentYear = currentYear;
    this.userAge = userAge;
    this.allowNegative = allowNegative;
  }

  static create({
    startYear = 2015,
    endYear = 2025,
    userAge = 30,
    currentYear = new Date().getFullYear(),
    allowNegative = false,
  } = {}): Portfolio {
    return new Portfolio(startYear, endYear, currentYear, userAge, allowNegative);
  }

  addIncomeStream(incomeStream: IncomeStream) {
    this.incomeStreams.push(incomeStream);
  }

  addExpenseStream(expenseStream: ExpenseStream) {
    this.expenseStreams.push(expenseStream);
  }

  addAsset(asset: Asset) {
    this.assets.push(asset);
  }

  addLiability(liability: Liability) {
    this.liabilities.push(liability);
  }

  addMajorExpense(majorExpense: MajorExpense) {
    this.majorExpenses.push(majorExpense);
  }
  /**
   * Returns a map of year to amount for all income streams, expense streams, and assets
   * <code>
   * [
   *  { name: 'Income', data: { 2015: 1000, 2016: 2000, ... } },
   *  { name: 'Expenses', data: { 2015: -500, 2016: -1000, ... } },
   * ]
   * </code>
   */
  getYearlyData(): YearlyPlottable[] {
    const yearlyData: YearlyPlottable[] = [];
    const allItems = [
      ...this.incomeStreams, 
      ...this.expenseStreams, 
      ...this.assets, 
      ...this.liabilities, 
      ...this.majorExpenses
    ];
    
    for (const item of allItems) {
      const plottable = item.plot();
      const plottableYearlyData = plottable.generateYearlyData(this.startYear, this.endYear);
      const data: { [year: string]: number } = {};
      
      for (const year of plottableYearlyData.keys()) {
        data[year] = plottableYearlyData.get(year) ?? 0;
      }
      
      yearlyData.push({ 
        name: plottable.name, 
        type: plottable.plotType, 
        data 
      });
    }
    
    return yearlyData;
  }
}
type YearlyPlottable = { 
  // TODO: @championswimmer - need to pass signal here if this plot is negative (eg: expenses)
  name: string,
  type: PlotType
  data: { [year: string]: number } 
}
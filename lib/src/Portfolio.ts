import IncomeStream from "./IncomeStream";
import ExpenseStream from "./ExpenseStream";
import Asset from "./Asset";
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
    const allPlottables = [...this.incomeStreams, ...this.expenseStreams, ...this.assets, ...this.majorExpenses];
    for (const plottable of allPlottables) {
      const plottableYearlyData = plottable.generateYearlyData(this.startYear, this.endYear);
      const data: { [year: string]: number } = {};
      for (const year of plottableYearlyData.keys()) {
        data[year] = plottableYearlyData.get(year) ?? 0;
      }
      yearlyData.push({ name: plottable.name, type: plottable.plotType, data });
    }
    return yearlyData;
  }
}
type YearlyPlottable = { 
  name: string,
  type: PlotType
  data: { [year: string]: number } 
}
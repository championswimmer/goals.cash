import { MoneyStream, Plottable, PlotType } from './types';

export default class IncomeStream implements MoneyStream {
  name: string;
  startYear: number;
  endYear: number;
  amountPerYear: number;
  growthRate: number;

  constructor(name: string, startYear: number, endYear: number, amountPerYear: number, growthRate: number) {
    this.name = name;
    this.startYear = startYear;
    this.endYear = endYear;
    this.amountPerYear = amountPerYear;
    this.growthRate = growthRate;
  }

  generateYearlyData(startYear: number, endYear: number): Map<string, number> {
    let yearlyData = new Map<string, number>();
    for (let year = startYear; year <= endYear; year++) {
      yearlyData.set(year.toString(), this.getAmountForYear(year));
    }
    return yearlyData;
  }

  // TODO: @championswimmer - same code as in ExpenseStream //merge
  getAmountForYear(year: number): number {
    if (year < this.startYear || year > this.endYear) {
      return 0;
    } else {
      return this.amountPerYear * Math.pow(1 + this.growthRate / 100, year - this.startYear);
    }
  }

  plot(): Plottable {
    const plotType: PlotType = "bar";
    return {
      name: this.name,
      plotType,
      startYear: this.startYear,
      endYear: this.endYear,
      generateYearlyData: this.generateYearlyData.bind(this)
    };
  }
}
import { MoneyStream, Plottable } from './types';

export default class IncomeStream implements MoneyStream, Plottable {
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
    let amount = this.amountPerYear;
    for (let year = startYear; year <= endYear; year++) {
      if (year < this.startYear || year > this.endYear) {
        yearlyData.set(year.toString(), 0);
      } else {
        yearlyData.set(year.toString(), amount);
        amount *= (1 + this.growthRate / 100);
      }
    }
    return yearlyData;
  }

}
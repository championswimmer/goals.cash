import Portfolio from "./Portfolio";
import { Plottable } from "./types";


export default class Asset implements Plottable {
  name: string;
  startYear: number;
  endYear: number;
  currentYear: number;
  currentValue: number;
  growthRate: number;

  // TODO: create from Portfolio (taking start and end year from portfolio)
  private constructor(name: string, startYear: number, endYear: number, currentYear: number, currentValue: number, growthRate: number) {
    this.name = name;
    this.startYear = startYear;
    this.endYear = endYear;
    this.currentYear = currentYear;
    this.currentValue = currentValue;
    this.growthRate = growthRate;
  }

  public static create(portfolio: Portfolio, name: string, currentYear: number, currentValue: number, growthRate: number) {
    return new Asset(name, portfolio.startYear, portfolio.endYear, currentYear, currentValue, growthRate);
  }

  generateYearlyData(startYear: number, endYear: number): Map<string, number> {
    let yearlyData = new Map<string, number>();
    let amount = 0;
    for (let year = startYear; year <= endYear; year++) {
      // no values outside of this.startYear to this.endYear
      if (year < this.startYear || year > this.endYear) {
        continue;
      }
      // extrapolate from startYear:0 to currentYear:currentValue
      if (year >= this.startYear && year < this.currentYear) {
        amount = this.currentValue * (year - this.startYear) / (this.currentYear - this.startYear);
      }
      // currentYear:currentValue and grow by growthRate
      if (year >= this.currentYear && year <= this.endYear) {
        amount = this.currentValue * Math.pow(1 + this.growthRate / 100, year - this.currentYear);
      }
      yearlyData.set(year.toString(), amount);
    }
    return yearlyData;
  }
}
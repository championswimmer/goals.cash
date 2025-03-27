import { MoneyPool, PlotType, Plottable } from "./types";
import Portfolio from "./Portfolio";

export default class Liability implements MoneyPool {
  name: string;
  startYear: number;
  endYear: number;
  currentYear: number;
  currentValue: number;
  growthRate: number;

  private constructor(name: string, startYear: number, endYear: number, currentYear: number, currentValue: number, growthRate: number) {
    this.name = name;
    this.startYear = startYear;
    this.endYear = endYear;
    this.currentYear = currentYear;
    this.currentValue = currentValue < 0 ? currentValue : -currentValue; // Ensure liability is negative
    this.growthRate = growthRate;
  }

  public static create(portfolio: Portfolio, name: string, currentYear: number, currentValue: number, growthRate: number) {
    return new Liability(name, portfolio.startYear, portfolio.endYear, currentYear, currentValue, growthRate);
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
      // currentYear:currentValue and "grow" by growthRate (actually shrinking as it's negative)
      if (year >= this.currentYear && year <= this.endYear) {
        amount = this.currentValue * Math.pow(1 + this.growthRate / 100, year - this.currentYear);
      }
      yearlyData.set(year.toString(), amount);
    }
    return yearlyData;
  }

  plot(): Plottable {
    const plotType: PlotType = "line";
    return {
      name: this.name,
      plotType,
      startYear: this.startYear,
      endYear: this.endYear,
      generateYearlyData: this.generateYearlyData.bind(this)
    };
  }
} 
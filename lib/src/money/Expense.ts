import { ErrorUnsupportedExtrapolation } from '../commons/errors';
import { MoneyStream, PlotPoint } from '../commons/types';

class ErrorExpenseBounds extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_EXPENSE_BOUNDS";
  }
}

export class Expense implements MoneyStream {
  type: "stream" = "stream";
  chart: "bar" = "bar";
  streamType: "expense" = "expense";

  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;
  endYear: number;
  // if this expense if for a loan, a down payment can be made
  downPayment?: number;

  constructor(name: string, color: string, initYear: number, endYear: number, initValue: number, growthRate: number, downPayment?: number) {
    if (endYear < initYear) {
      throw new ErrorExpenseBounds("Expense end year must be greater than or equal to init year");
    }
    this.name = name;
    this.color = color;
    this.initYear = initYear;
    this.endYear = endYear;
    this.initValue = initValue;
    this.growthRate = growthRate;
    this.downPayment = downPayment;
  }

  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    const plotPoints: PlotPoint[] = [];

    for (let year = startYear; year <= endYear; year++) {
      // If the year is outside of the expense's active period, value is 0
      if (year < this.initYear || year > this.endYear) {
        plotPoints.push({ year, value: 0 });
        continue;
      }

      // Calculate the value for the current year based on growth rate
      const yearsOfGrowth = year - this.initYear;
      const growthFactor = Math.pow(1 + this.growthRate, yearsOfGrowth);
      let value = this.initValue * growthFactor;

      // Add downpayment to first year if it exists
      if (year === this.initYear && this.downPayment) {
        value += this.downPayment;
      }

      plotPoints.push({ year, value });
    }

    return plotPoints;
  }

  getPlotPoint(year: number): PlotPoint {
    const plotPoints = this.getPlotPoints(Math.min(year, this.initYear), Math.max(year, this.initYear));
    return plotPoints.find(point => point.year === year) || { year, value: 0 };
  }

  extrapolateFromStart(startYear: number, startValue: number = 0): Expense {
    // noop - expenses are not extrapolated
    throw new ErrorUnsupportedExtrapolation("Expenses are not extrapolated");
  }
} 
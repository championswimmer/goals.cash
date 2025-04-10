import { ErrorUnsupportedExtrapolation } from '../commons/errors';
import { populatePlotPointsWithPastData } from '../commons/plot-point-utils';
import { MoneyStream, PlotPoint } from '../commons/types';

export class ErrorExpenseBounds extends Error {
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

  private _plotPoints: Map<number, number> = new Map();

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

    this.calculatePlotPoints(initYear, endYear);
  }

  private calculatePlotPoints(startYear: number, endYear: number) {
    for (let year = startYear; year <= endYear; year++) {
      // If the year is outside of the income's active period, value is 0
      if (year < this.initYear || year > this.endYear) {
        this._plotPoints.set(year, 0);
      }
      else {
        const yearsOfGrowth = year - this.initYear;
        const growthFactor = Math.pow(1 + this.growthRate, yearsOfGrowth);
        let value = this.initValue * growthFactor;

        // Add downpayment to first year if it exists
        if (this.downPayment && year === this.initYear) {
          value += this.downPayment;
        }

        this._plotPoints.set(year, value);
      }
    }
  }

  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    // Do not calculate plot points if they are already calculated 
    if (this._plotPoints.size === 0 || this._plotPoints.get(startYear) === undefined || this._plotPoints.get(endYear) === undefined) {
      this.calculatePlotPoints(startYear, endYear);
    }
    const plotPoints: PlotPoint[] = [];
    for (let year = startYear; year <= endYear; year++) {
      plotPoints.push({ year, value: this._plotPoints.get(year) || 0 });
    }
    return plotPoints;
  }

  getPlotPoint(year: number): PlotPoint {
    // if this year's data doesn't exists, calculate it 
    if (this._plotPoints.get(year) === undefined) {
      this.calculatePlotPoints(Math.min(year, this.initYear), Math.max(year, this.endYear));
    }
    return { year, value: this._plotPoints.get(year) || 0 };

  }
  extrapolateFromStart(startYear: number, startValue: number = 0): Expense {
    // noop - expenses are not extrapolated
    throw new ErrorUnsupportedExtrapolation("Expenses are not extrapolated");
  }
  populatePastValues(...values: PlotPoint[]): Expense {
    populatePlotPointsWithPastData(this._plotPoints, this.initYear, this.initValue, ...values);
    return this;
  }
}
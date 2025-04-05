import { Expense } from './Expense';
import { populatePlotPointsWithPastData } from '../commons/plot-point-utils';
import { MoneyPool, PlotPoint } from '../commons/types';

export class Liability implements MoneyPool {
  type: "pool" = "pool";
  chart: "area" = "area";
  poolType: "liability" = "liability";
  repaymentExpense: Expense | undefined;

  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;

  private _plotPoints: Map<number, number> = new Map();

  constructor(name: string, color: string, initYear: number, initValue: number, growthRate: number, repaymentExpense?: Expense) {
    this.name = name;
    this.color = color;
    this.initYear = initYear;
    this.initValue = initValue;
    this.growthRate = growthRate;
    this.repaymentExpense = repaymentExpense;

    // Initialize the first plot point
    this._plotPoints.set(initYear, initValue);
  }

  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    // Ensure we have all the plot points calculated
    this.calculatePlotPoints(startYear, endYear);

    const plotPoints: PlotPoint[] = [];

    for (let year = startYear; year <= endYear; year++) {
      plotPoints.push({
        year,
        value: this._plotPoints.get(year) || 0
      });
    }

    return plotPoints;
  }

  getPlotPoint(year: number): PlotPoint {
    // Ensure we have all the plot points calculated
    this.calculatePlotPoints(Math.min(year, this.initYear), Math.max(year, this.initYear));
    return {
      year,
      value: this._plotPoints.get(year) || 0
    };
  }

  private calculatePlotPoints(startYear: number, endYear: number) {
    // for the simple case, without repayment, liability just grows 
    if (!this.repaymentExpense) {
      // Calculate plot points for years after initYear
      for (let year = this.initYear + 1; year <= endYear; year++) {
        // If we already have the value, skip calculation
        if (this._plotPoints.has(year)) continue;

        const prevYearValue = this._plotPoints.get(year - 1) || 0;
        const thisYearValue = prevYearValue * (1 + this.growthRate);
        this._plotPoints.set(year, thisYearValue);
      }
    } else {
      // for the case with repayment, liability grows by growthRate, but is reduced by the repayment expense
      for (let year = this.initYear + 1; year <= endYear; year++) {
        // If we already have the value, skip calculation
        if (this._plotPoints.has(year)) continue;

        const prevYearValue = this._plotPoints.get(year - 1) || 0;
        const repaymentExpenseValue = this.repaymentExpense!.getPlotPoints(this.initYear, endYear).find(point => point.year === year)?.value || 0;
        let thisYearValue = prevYearValue * (1 + this.growthRate)
        thisYearValue -= repaymentExpenseValue;
        if (Math.abs(thisYearValue) < 0.1) { // due to rounding errors, we set it to 0
          thisYearValue = 0;
        }
        this._plotPoints.set(year, thisYearValue);
      }
    }
  }

  extrapolateFromStart(startYear: number, startValue: number): MoneyPool {
    // noop - liabilities are not extrapolated 
    throw new Error("Liabilities are not extrapolated");
  }

  // TODO: commonize with Asset.populatePastValues
  populatePastValues(...values: PlotPoint[]): Liability {
    populatePlotPointsWithPastData(this._plotPoints, this.initYear, this.initValue, ...values);
    return this;
  }
} 
import { Expense } from './Expense';
import { MoneyPool, PlotPoint } from './types';

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
  populatePastValues(...values: PlotPoint[]): MoneyPool {
    // add the initYear to the values
    values.push({ year: this.initYear, value: this.initValue });

    values.sort((a, b) => a.year - b.year).forEach((value, index) => {
      if (value.year >= this.initYear) {
        // TODO: custom error
        throw new Error("Value year must be less than init year");
      }

      // interpolate values for missing years if there is a gap
      if (index > 0 && values[index - 1].year < value.year - 1) {
        const prevValue = values[index - 1].value;
        const yearDiff = value.year - values[index - 1].year;
        const valueIncrement = (value.value - prevValue) / yearDiff;
        for (let year = values[index - 1].year + 1; year < value.year; year++) {
          this._plotPoints.set(year, prevValue + valueIncrement * (year - values[index - 1].year));
        }
      }

      // set the value for the year
      this._plotPoints.set(value.year, value.value);
    })


    return this;
  }
} 
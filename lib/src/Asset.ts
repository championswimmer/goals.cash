import { MoneyPool, PlotPoint } from './types';

export class Asset implements MoneyPool {
  type: "pool" = "pool";
  chart: "area" = "area";
  poolType: "asset" = "asset";
  isLiquid: boolean;
  /**
   * If asset depletes below this, then do not spend any more from it
   * Unless no other assets are available
   */
  spendCutoff: number;

  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;

  private _plotPoints: Map<number, number> = new Map();

  constructor(name: string, color: string, initYear: number, initValue: number, growthRate: number, isLiquid: boolean = true, spendCutoff: number = 0) {
    this.name = name;
    this.color = color;
    this.initYear = initYear;
    this.initValue = initValue;
    this.growthRate = growthRate;
    this.isLiquid = isLiquid;
    this.spendCutoff = spendCutoff;
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

    // Calculate plot points for years after initYear
    for (let year = this.initYear + 1; year <= endYear; year++) {
      // If we already have the value, skip calculation
      if (this._plotPoints.has(year)) continue;

      const prevYearValue = this._plotPoints.get(year - 1) || 0;
      const thisYearValue = prevYearValue * (1 + this.growthRate);
      this._plotPoints.set(year, thisYearValue);
    }
  }

  extrapolateFromStart(startYear: number, startValue: number = 0): MoneyPool {
    if (startYear >= this.initYear) {
      throw new Error("Start year must be less than init year");
    }

    // Calculate the yearly increment for linear growth
    const yearDiff = this.initYear - startYear;
    const valueIncrement = (this.initValue - startValue) / yearDiff;

    // Clear any existing points before initYear
    for (let year = startYear; year < this.initYear; year++) {
      this._plotPoints.delete(year);
    }

    // Fill values from startYear to initYear using linear growth
    let currentValue = startValue;
    for (let year = startYear; year < this.initYear; year++) {
      this._plotPoints.set(year, currentValue);
      currentValue += valueIncrement;
    }

    // Ensure initYear has its original value
    this._plotPoints.set(this.initYear, this.initValue);

    return this;
  }

  // TODO: commonize with Liability.populatePastValues
  populatePastValues(...values: PlotPoint[]): MoneyPool {
    // add the initYear to the values
    values.push({ year: this.initYear, value: this.initValue });

    values.sort((a, b) => a.year - b.year).forEach((value, index) => {
      if (value.year > this.initYear) {
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
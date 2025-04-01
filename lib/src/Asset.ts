import { MoneyPool, PlotPoint } from './types';

export class Asset implements MoneyPool {
  type: "pool" = "pool";
  chart: "area" = "area";
  poolType: "assets" = "assets";

  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;

  private _plotPoints: Map<number, number> = new Map();

  constructor(name: string, color: string, initYear: number, initValue: number, growthRate: number) {
    this.name = name;
    this.color = color;
    this.initYear = initYear;
    this.initValue = initValue;
    this.growthRate = growthRate;

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

  extrapolateFromStart(startYear: number, startValue: number): MoneyPool {
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
} 
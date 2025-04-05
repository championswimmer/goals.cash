import { extrapolatePlotPointsFromStart, populatePlotPointsWithPastData } from './commons/plot-point-utils';
import { MoneyPool, PlotPoint } from './commons/types';

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
    extrapolatePlotPointsFromStart(this._plotPoints, this.initYear, this.initValue, startYear, startValue);
    return this;
  }

  populatePastValues(...values: PlotPoint[]): Asset {
    populatePlotPointsWithPastData(this._plotPoints, this.initYear, this.initValue, ...values);
    return this;
  }
} 
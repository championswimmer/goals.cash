import { ErrorPortfolioSimulationIncomplete } from '../commons/errors';
import { extrapolatePlotPointsFromStart, populatePlotPointsWithPastData } from '../commons/plot-point-utils';
import { MoneyPool, PlotPoint } from '../commons/types';

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
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => this.getPlotPoint(startYear + i));
  }

  getPlotPoint(year: number): PlotPoint {
    // if before init year, return existing data or 0  
    if (year < this.initYear) {
      return {
        year,
        value: this._plotPoints.get(year) || 0
      };
    }
    // check if year is in plot points
    if (!this._plotPoints.has(year)) {
      throw new ErrorPortfolioSimulationIncomplete(`Plot point for year ${year} not found. Run portfolio.simulate()`);
    }
    return {
      year,
      value: this._plotPoints.get(year) || 0
    };
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
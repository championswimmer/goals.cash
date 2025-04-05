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

  /**
   * Update the plot point for the given year with the given inflow amount
   * If the inflow amount is negative, it means we are spending money from this asset
   * @param year - the year to update the plot point for
   * @param inflowAmount - the amount to add to the plot point
   * @param ignoreCutoff - if true, ignore the spend cutoff
   * @returns true if the plot point was updated, false otherwise
   */
  updatePlotPoint(year: number, inflowAmount: number, ignoreCutoff: boolean = false): boolean {
    // fail-fast: simulation is only for years after init year
    if (year < this.initYear) {
      throw new Error(`Simulation is only for years after init year ${this.initYear}`)
    }
    if (year === this.initYear) {
      // this value is set during init, skip
      return false;
    }
    // if zero inflow and this year data exists, ignore
    // this exists so that simulate() can safely call updatePlotPoint(year, 0) multiple times
    if (inflowAmount === 0 && this._plotPoints.has(year)) {
      return false;
    }
    // fail-fast: error if not simulated till previous year
    if (!this._plotPoints.has(year - 1)) {
      throw new ErrorPortfolioSimulationIncomplete(`Plot point for year ${year - 1} not found. portfolio.simulate() has not run till ${year - 1}`);
    }

    const previousYearValue = this._plotPoints.get(year - 1) || 0;
    const inherentlyGrownValue = previousYearValue * (1 + this.growthRate);

    // if we are spending money, check if we are below the spend cutoff
    if (inflowAmount < 0 && !ignoreCutoff && inherentlyGrownValue + inflowAmount < this.spendCutoff) {
      return false;
    }

    // even if ignoring cutoff, we cannot spend more than the inherently grown value
    if (inflowAmount < 0 && inherentlyGrownValue + inflowAmount < 0) {
      return false;
    }

    // update the plot point
    this._plotPoints.set(year, inherentlyGrownValue + inflowAmount);
    return true;
  }

  extrapolateFromStart(startYear: number, startValue: number = 0): MoneyPool {
    extrapolatePlotPointsFromStart(this._plotPoints, this.initYear, this.initValue, startYear, startValue);
    return this;
  }

  populatePastValues(...values: PlotPoint[]): Asset {
    populatePlotPointsWithPastData(this._plotPoints, this.initYear, this.initValue, ...values);
    return this;
  }

  clone(): Asset {
    const asset = new Asset(this.name, this.color, this.initYear, this.initValue, this.growthRate, this.isLiquid, this.spendCutoff);
    // copy only plot points before initYear (extrapolated or manually set ones)
    for (const [year, value] of this._plotPoints.entries()) {
      if (year < this.initYear) {
        asset._plotPoints.set(year, value);
      }
    }
    return asset;
  }
} 
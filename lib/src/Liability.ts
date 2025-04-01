import { MoneyPool, PlotPoint } from './types';

export class Liability implements MoneyPool {
  type: "pool" = "pool";
  chart: "area" = "area";
  poolType: "liability" = "liability";
  
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
    // noop - liabilities are not extrapolated 
    throw new Error("Liabilities are not extrapolated");
  }
} 
import { MoneyPool, PlotPoint } from './types';

export class Liability implements MoneyPool {
  type: "pool" = "pool";
  chart: "area" = "area";
  poolType: "liabilities" = "liabilities";
  
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
    // Calculate plot points for years before initYear
    for (let year = this.initYear - 1; year >= startYear; year--) {
      const nextYearValue = this._plotPoints.get(year + 1) || 0;
      const thisYearValue = nextYearValue / (1 + this.growthRate);
      this._plotPoints.set(year, thisYearValue);
    }
    
    // Calculate plot points for years after initYear
    for (let year = this.initYear + 1; year <= endYear; year++) {
      const prevYearValue = this._plotPoints.get(year - 1) || 0;
      const thisYearValue = prevYearValue * (1 + this.growthRate);
      this._plotPoints.set(year, thisYearValue);
    }
  }
  
  extrapolateFromStart(startYear: number, startValue: number): MoneyPool {
    if (startYear > this.initYear) {
      throw new Error("Start year must be less than or equal to init year");
    }
    
    // If initYear is equal to startYear, just update the value
    if (startYear === this.initYear) {
      this.initValue = startValue;
      this._plotPoints.set(startYear, startValue);
      return this;
    }
    
    // Calculate the growth factor to adjust the initial value
    const yearsOfGrowth = this.initYear - startYear;
    const growthFactor = Math.pow(1 + this.growthRate, yearsOfGrowth);
    
    // Update initial value based on the start value and growth
    this.initValue = startValue * growthFactor;
    this._plotPoints.clear();
    this._plotPoints.set(this.initYear, this.initValue);
    
    return this;
  }
} 
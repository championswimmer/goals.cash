import { MoneyStream, PlotPoint } from './types';

export class Income implements MoneyStream {
  type: "stream" = "stream";
  chart: "bar" = "bar";
  streamType: "income" = "income";
  
  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;
  endYear: number;
  
  constructor(name: string, color: string, initYear: number, endYear: number, initValue: number, growthRate: number) {
    this.name = name;
    this.color = color;
    this.initYear = initYear;
    this.endYear = endYear;
    this.initValue = initValue;
    this.growthRate = growthRate;
  }
  
  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    const plotPoints: PlotPoint[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
      // If the year is outside of the income's active period, value is 0
      if (year < this.initYear || year > this.endYear) {
        plotPoints.push({ year, value: 0 });
        continue;
      }
      
      // Calculate the value for the current year based on growth rate
      const yearsOfGrowth = year - this.initYear;
      const growthFactor = Math.pow(1 + this.growthRate, yearsOfGrowth);
      const value = this.initValue * growthFactor;
      
      plotPoints.push({ year, value });
    }
    
    return plotPoints;
  }
  
  extrapolateFromStart(startYear: number, startValue: number): MoneyStream {
    if (startYear > this.initYear) {
      throw new Error("Start year must be less than or equal to init year");
    }
    
    // If initYear is equal to startYear, just update the value
    if (startYear === this.initYear) {
      this.initValue = startValue;
      return this;
    }
    
    // Calculate the growth factor to adjust the initial value
    const yearsOfGrowth = this.initYear - startYear;
    const growthFactor = Math.pow(1 + this.growthRate, yearsOfGrowth);
    
    // Update initial value based on the start value and growth
    this.initValue = startValue * growthFactor;
    
    return this;
  }
} 
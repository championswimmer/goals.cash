import { MoneyStream, PlotPoint } from './types';

export class Expense implements MoneyStream {
  type: "stream" = "stream";
  chart: "bar" = "bar";
  streamType: "expense" = "expense";
  
  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;
  endYear: number;
  // if this expense if for a loan, a down payment can be made
  downPayment?: number;
  
  constructor(name: string, color: string, initYear: number, endYear: number, initValue: number, growthRate: number, downPayment?: number) {
    this.name = name;
    this.color = color;
    this.initYear = initYear;
    this.endYear = endYear;
    this.initValue = initValue;
    this.growthRate = growthRate;
    this.downPayment = downPayment;
  }
  
  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    const plotPoints: PlotPoint[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
      // If the year is outside of the expense's active period, value is 0
      if (year < this.initYear || year > this.endYear) {
        plotPoints.push({ year, value: 0 });
        continue;
      }
      
      // Calculate the value for the current year based on growth rate
      const yearsOfGrowth = year - this.initYear;
      const growthFactor = Math.pow(1 + this.growthRate, yearsOfGrowth);
      let value = this.initValue * growthFactor;
      
      // Add downpayment to first year if it exists
      if (year === this.initYear && this.downPayment) {
        value += this.downPayment;
      }
      
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
    
    // Calculate the yearly change needed for linear growth
    const yearDiff = this.initYear - startYear;
    const valueDiff = this.initValue - startValue;
    const yearlyChange = valueDiff / yearDiff;
    
    // Update initial value to match the linear progression
    this.initValue = startValue + (yearDiff * yearlyChange);
    
    return this;
  }
} 
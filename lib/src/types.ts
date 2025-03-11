export interface MoneyStream {
  amountPerYear: number; // this is at startYear, signed value
  growthRate: number; // in percentage
}

export interface Plottable {
  name: string;
  startYear: number;
  endYear: number;
  generateYearlyData(startYear: number, endYear: number): Map<string, number>;
}
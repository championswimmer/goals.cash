export type PlotType = "line" | "bar" | "scatter";

export interface Plottable {
  name: string;
  plotType: PlotType;
  startYear: number;
  endYear: number;
  generateYearlyData(startYear: number, endYear: number): Map<string, number>;
}

export interface MoneyStream {
  name: string;
  startYear: number;
  endYear: number;
  amountPerYear: number; // this is at startYear, signed value
  growthRate: number; // in percentage
  getAmountForYear(year: number): number;
  plot(): Plottable;
}

export interface MoneyPool {
  name: string;
  startYear: number;
  endYear: number;
  currentYear: number;
  currentValue: number;
  growthRate: number; // in percentage
  plot(): Plottable;
}


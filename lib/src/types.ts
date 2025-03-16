export type PlotType = "line" | "bar" | "scatter";

export interface Plottable {
  name: string;
  plotType: PlotType;
  startYear: number;
  endYear: number;
  generateYearlyData(startYear: number, endYear: number): Map<string, number>;
}

export interface MoneyStream extends Plottable {
  amountPerYear: number; // this is at startYear, signed value
  growthRate: number; // in percentage
  getAmountForYear(year: number): number;
}

export interface MoneyPool extends Plottable {

}


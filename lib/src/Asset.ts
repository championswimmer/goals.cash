import { Plottable } from "./types";


export default class Asset implements Plottable {
  name: string;
  startYear: number;
  endYear: number;
  initialValue: number;
  growthRate: number;

  constructor(name: string, startYear: number, endYear: number, initialValue: number, growthRate: number) {
    this.name = name;
    this.startYear = startYear;
    this.endYear = endYear;
    this.initialValue = initialValue;
    this.growthRate = growthRate;
  }

  generateYearlyData(startYear: number, endYear: number): Map<string, number> {
    throw new Error("Method not implemented.");
  }

}
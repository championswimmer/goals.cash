import { MoneyPool } from ".";

export class Liability implements MoneyPool {
  chartType: "area" = "area";
  name: string;
  startYear: number;
  initialValue: number;
  intrinsicGrowthRate: number;
  extrapolateFromZero: boolean = false; // liabilities are not extrapolated from zero

  private constructor(
    name: string,
    startYear: number,
    initialValue: number,
    intrinsicGrowthRate: number
  ) {
    this.name = name;
    this.startYear = startYear;
    this.initialValue = initialValue;
    this.intrinsicGrowthRate = intrinsicGrowthRate;
  }
  static create(
    name: string,
    startYear: number,
    initialValue: number,
    intrinsicGrowthRate: number
  ): Liability {
    return new Liability(name, startYear, initialValue, intrinsicGrowthRate);
  }
}

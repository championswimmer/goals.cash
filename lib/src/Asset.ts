import { MoneyPool } from ".";

export class Asset implements MoneyPool {
  chartType: "area" = "area";
  name: string;
  startYear: number;
  initialValue: number;
  intrinsicGrowthRate: number;
  extrapolateFromZero: boolean;

  private constructor(
    name: string,
    startYear: number,
    initialValue: number,
    intrinsicGrowthRate: number,
    extrapolateFromZero: boolean = false
  ) {
    this.name = name;
    this.startYear = startYear;
    this.initialValue = initialValue;
    this.intrinsicGrowthRate = intrinsicGrowthRate;
    this.extrapolateFromZero = extrapolateFromZero;
  }
  static create(
    name: string,
    startYear: number,
    initialValue: number,
    intrinsicGrowthRate: number,
    extrapolateFromZero: boolean
  ): Asset {
    return new Asset(
      name,
      startYear,
      initialValue,
      intrinsicGrowthRate,
      extrapolateFromZero
    );
  }
}

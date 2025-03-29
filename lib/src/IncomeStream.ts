import { MoneyStream } from ".";

export class IncomeStream implements MoneyStream {
  chartType: "bar" = "bar";

  name: string;
  startYear: number;
  endYear: number;
  initialValue: number;
  growthRate: number;

  private constructor(
    name: string,
    startYear: number,
    endYear: number,
    initialValue: number,
    growthRate: number
  ) {
    this.name = name;
    this.startYear = startYear;
    this.endYear = endYear;
    this.initialValue = initialValue;
    this.growthRate = growthRate;
  }

  static create(
    name: string,
    startYear: number,
    endYear: number,
    initialValue: number,
    growthRate: number
  ): IncomeStream {
    return new IncomeStream(name, startYear, endYear, initialValue, growthRate);
  }
}

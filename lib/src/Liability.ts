import { MoneyPool } from ".";

export class Liability implements MoneyPool {
    chartType: "area" = "area";
    name: string;
    startYear: number;
    initialValue: number;
    intrinsicGrowthRate: number;
    extrapolateFromZero: boolean;

    private constructor(name: string, startYear: number, initialValue: number, intrinsicGrowthRate: number, extrapolateFromZero: boolean) {
        this.name = name;
        this.startYear = startYear;
        this.initialValue = initialValue;
        this.intrinsicGrowthRate = intrinsicGrowthRate;
        this.extrapolateFromZero = extrapolateFromZero;
    }
    static create(name: string, startYear: number, initialValue: number, intrinsicGrowthRate: number, extrapolateFromZero: boolean): Liability {
        return new Liability(name, startYear, initialValue, intrinsicGrowthRate, extrapolateFromZero);
    }

}
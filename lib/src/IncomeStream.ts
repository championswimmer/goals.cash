import { MoneyStream, Plottable } from './Portfolio';

export class IncomeStream implements MoneyStream, Plottable {
    name: string;
    startYear: number;
    endYear: number;
    amountPerYear: number;
    growthRate: number;

    private constructor(name: string, startYear: number, endYear: number, amountPerYear: number, growthRate: number) {
        this.name = name;
        this.startYear = startYear;
        this.endYear = endYear;
        this.amountPerYear = amountPerYear;
        this.growthRate = growthRate;
    }
    generateYearlyData(startYear: number, endYear: number): number[] {
        throw new Error('Method not implemented.');
    }

}
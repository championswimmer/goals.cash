export interface MoneyStream {
    startYear: number;
    endYear: number;
    amountPerYear: number; // this is at startYear, signed value
    growthRate: number; // in percentage
}

export interface Plottable {
    name: string;
    generateYearlyData(startYear: number, endYear: number): number[];
}

export class Portfolio {
    startYear!: number;
    endYear!: number;
    currentYear!: number;
    userAge!: number;
    allowNegative!: boolean;

    private constructor(startYear: number, endYear: number, currentYear: number, userAge: number, allowNegative: boolean) {
        this.startYear = startYear;
        this.endYear = endYear;
        this.currentYear = currentYear;
        this.userAge = userAge;
        this.allowNegative = allowNegative;
    }

    static create({
        startYear = 2015,
        endYear = 2025,
        userAge = 30,
        currentYear = new Date().getFullYear(),
        allowNegative = false,
    } = {}): Portfolio {
        return new Portfolio(startYear, endYear, currentYear, userAge, allowNegative);
    }
}
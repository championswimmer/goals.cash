import { MoneyStream } from '.';

export class ExpenseStream implements MoneyStream {
    chartType: 'bar' = 'bar';
    
    name: string;
    startYear: number;
    initialValue: number;
    growthRate: number;

    private constructor(name: string, startYear: number, initialValue: number, growthRate: number) {
        this.name = name;
        this.startYear = startYear;
        this.initialValue = initialValue;
        this.growthRate = growthRate;
    }

    static create(name: string, startYear: number, initialValue: number, growthRate: number): ExpenseStream {
        return new ExpenseStream(name, startYear, initialValue, growthRate);
    }

}
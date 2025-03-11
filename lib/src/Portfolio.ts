import IncomeStream from "./IncomeStream";
import ExpenseStream from "./ExpenseStream";
export class Portfolio {
    startYear!: number;
    endYear!: number;
    currentYear!: number;
    userAge!: number;
    allowNegative!: boolean;
    incomeStreams: IncomeStream[] = [];
    expenseStreams: ExpenseStream[] = [];
    

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
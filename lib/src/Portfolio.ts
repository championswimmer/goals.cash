import { Liability, Asset, IncomeStream, ExpenseStream } from "."

export class Portfolio {
    /**
     * The year from which portfolio is to be plotted
     * None of its constituents should have startYear before this 
     */
    startYear: number 

    /**
     * The year till which portfolio is to be plotted 
     * None of its constituents should have endYear after this
     */
    endYear: number

    currentYear: number 

    /**
     * Age of person during currentYear
     */
    currentAge: number

    assets: Asset[] = []
    liabilities: Liability[] = []
    incomeStreams: IncomeStream[] = []
    expenseStreams: ExpenseStream[] = []

    constructor(startYear: number, endYear: number, currentYear: number, currentAge: number) {
        this.startYear = startYear
        this.endYear = endYear
        this.currentYear = currentYear
        this.currentAge = currentAge
    }

}
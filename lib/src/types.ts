

export interface Plottable {
    chartType: "bar" | "line" | "area" | "scatter";
}

export interface MoneyPool extends Plottable {
    chartType: "area"
    name: string;
    // TODO: @championswimmer have color here ? 
    
    startYear: number;

    /**
     * The initial value of the money pool at the startYear 
     * This is not an "annual" number, but the absolute value
     * Positive for assets, negative for liabilities
     */
    initialValue: number;

    /**
     * If this pool has an intrinsic rate of growth (eg: due to its own interest)
     */
    intrinsicGrowthRate: number;
    
    /**
     * If true, then values from 0 to inital value between portfolio.startYear 
     * to this.startYear will be generated
     */
    extrapolateFromZero: boolean;
}

export interface MoneyStream extends Plottable {
    chartType: "bar"
    name: string;
    // TODO: @championswimmer have color here ? 
    
    startYear: number;
    endYear: number;

    /**
     * The initial annual rate of money stream, at the startYear
     * Positive for incomes, negative for expenses
     */
    initialValue: number;

    /**
     * The rate of growth of the stream itself. (eg increase in salary)
     */
    growthRate: number;

}
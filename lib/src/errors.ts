

export class PortfolioYearBoundsError extends Error {
    name: string = "ERR_YEAR_BOUNDS";
    constructor(message: string) {
        super(message);
    }
}
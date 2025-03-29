import { Liability, Asset, IncomeStream, ExpenseStream } from ".";
import { PortfolioYearBoundsError } from "./errors";

export class Portfolio {
  /**
   * The year from which portfolio is to be plotted
   * None of its constituents should have startYear before this
   */
  startYear: number;

  /**
   * The year till which portfolio is to be plotted
   * None of its constituents should have endYear after this
   */
  endYear: number;

  currentYear: number;

  /**
   * Age of person during currentYear
   */
  currentAge: number;

  assets: Asset[] = [];
  liabilities: Liability[] = [];
  incomeStreams: IncomeStream[] = [];
  expenseStreams: ExpenseStream[] = [];

  constructor(
    startYear: number,
    endYear: number,
    currentYear: number,
    currentAge: number
  ) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.currentYear = currentYear;
    this.currentAge = currentAge;
  }

  addAsset(asset: Asset): void {
    if (asset.startYear != this.currentYear) {
      throw new PortfolioYearBoundsError(
        `Asset start year ${asset.startYear} does not match portfolio current year ${this.currentYear}`
      );
    }
    this.assets.push(asset);
  }

  addLiability(liability: Liability): void {
    if (liability.startYear < this.currentYear) {
      throw new PortfolioYearBoundsError(
        `Liability start year ${liability.startYear} cannot be before current year ${this.currentYear}`
      );
    }
    this.liabilities.push(liability);
  }

  addIncomeStream(incomeStream: IncomeStream): void {
    if (incomeStream.startYear < this.startYear) {
      throw new PortfolioYearBoundsError(
        `Income stream start year ${incomeStream.startYear} cannot be before portfolio start year ${this.startYear}`
      );
    }
    this.incomeStreams.push(incomeStream);
  }

  addExpenseStream(expenseStream: ExpenseStream): void {
    if (expenseStream.startYear < this.startYear) {
      throw new PortfolioYearBoundsError(
        `Expense stream start year ${expenseStream.startYear} cannot be before portfolio start year ${this.startYear}`
      );
    }
    this.expenseStreams.push(expenseStream);
  }
}

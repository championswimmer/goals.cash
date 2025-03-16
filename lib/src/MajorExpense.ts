import ExpenseStream from "./ExpenseStream";
import { PlotType } from "./types";


export default class MajorExpense extends ExpenseStream {
  plotType: PlotType = "scatter";
  totalAmount: number;
  isViaLoan: boolean;
  loanInterestRate: number; // 0 if not via loan
  loanTermYears: number; // 0 if not via loan
  loanDownPayment: number; // 0 if not via loan

  public static calculateAnnualPayment(totalAmount: number, loanInterestRate: number, loanTermYears: number, loanDownPayment: number) {
    // TODO: Errors for negative term value, negative interest rate, negative down payment
    const leftOverAmount = totalAmount - loanDownPayment;
    const leftOverAmountWithInterest = leftOverAmount * (1 + loanInterestRate / 100) ** loanTermYears;
    const annualPayment = leftOverAmountWithInterest / loanTermYears;
    return annualPayment;
  }

  constructor(name: string, year: number, amount: number);
  constructor(name: string, startYear: number, totalAmount: number, isViaLoan: true, loanInterestRate: number, loanTermYears: number, loanDownPayment: number);
  constructor(name: string, startYear: number, totalAmount: number, isViaLoan: boolean = false, loanInterestRate: number = 0, loanTermYears: number = 0, loanDownPayment: number = 0) {
    const annualPayment = isViaLoan ? MajorExpense.calculateAnnualPayment(totalAmount, loanInterestRate, loanTermYears, loanDownPayment) : totalAmount;
    super(name, startYear, startYear + loanTermYears, annualPayment, 0);
    this.totalAmount = totalAmount;
    this.isViaLoan = isViaLoan;
    this.loanInterestRate = loanInterestRate;
    this.loanTermYears = loanTermYears;
    this.loanDownPayment = loanDownPayment;
    if (isViaLoan) {
      this.plotType = "bar"
    }
  }

  generateYearlyData(startYear: number, endYear: number): Map<string, number> {
    let yearlyData = new Map<string, number>();
    for (let year = startYear; year <= endYear; year++) {
      yearlyData.set(year.toString(), this.getAmountForYear(year));
    }
    return yearlyData;
  }

  getAmountForYear(year: number): number {
    if (!this.isViaLoan) {
      // only 1 payment in the year of startYear
      if (year === this.startYear) return this.amountPerYear;
      else return 0;
    } else {
      // downPayment + annual payment in the startYear, annual payment for the rest of the years
      if (year === this.startYear) return this.loanDownPayment + this.amountPerYear;
      else if (year > this.startYear && year <= this.endYear) return this.amountPerYear;
      else return 0;
    }
  }
}
import ExpenseStream from "./ExpenseStream";


export default class MajorExpense extends ExpenseStream {
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
    const annualPayment = MajorExpense.calculateAnnualPayment(totalAmount, loanInterestRate, loanTermYears, loanDownPayment);
    super(name, startYear, startYear + loanTermYears, annualPayment, 0);
    this.totalAmount = totalAmount;
    this.isViaLoan = isViaLoan;
    this.loanInterestRate = loanInterestRate;
    this.loanTermYears = loanTermYears;
    this.loanDownPayment = loanDownPayment;
  }

  // TODO: override generateYearlyData
}
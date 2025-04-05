import { Liability } from "./Liability";
import { Expense } from "./Expense";
import { MoneyPool, MoneyStream } from "./commons/types";
import { getRandomLiabilityColor } from "./commons/colors";

export class Goal {
  name: string;
  color: string;
  startYear: number;
  amount: number;
  interestRate: number;
  term: number;
  downPayment: number;

  // TODO: also have an _asset (if it's a house, for example)
  private _liability: Liability | null = null;
  private _expense!: Expense;

  constructor(
    name: string,
    color: string,
    startYear: number,
    amount: number,
    interestRate: number,
    term: number,
    downPayment: number = 0
  ) {
    this.name = name;
    this.color = color;
    this.startYear = startYear;
    this.amount = amount;
    this.interestRate = interestRate;
    this.term = term;
    this.downPayment = downPayment;

    // Create the appropriate Expense and Liability
    this.createFinancialEntities();
  }

  private createFinancialEntities() {
    if (this.term === 0) {
      // If term is 0, create a one-time expense with same start and end year
      this._expense = new Expense(
        this.name,
        this.color,
        this.startYear,
        this.startYear,
        this.amount,
        0, // No growth for a one-time expense
        this.downPayment
      );
      // No liability for term = 0
      this._liability = null;
    } else {
      // Calculate the yearly payment amount based on loan parameters
      const yearlyPayment = this.calculateYearlyPayment();
      
      // Calculate the actual loan amount after downpayment
      const loanAmount = this.amount - this.downPayment;
      
      // Create an expense that lasts for the term years and includes downpayment
      this._expense = new Expense(
        `${this.name} Payment`,
        this.color,
        this.startYear,
        this.startYear + this.term, // End year is start + term
        yearlyPayment,
        0, // Fixed payment amount, so growth rate is 0
        this.downPayment
      );
      
      // Create a liability that starts with the loan amount (after downpayment)
      this._liability = new Liability(
        `${this.name} Loan`,
        getRandomLiabilityColor(),
        this.startYear,
        loanAmount,
        this.interestRate,
        this._expense
      );
    }
  }

  private calculateYearlyPayment(): number {
    if (this.term === 0) return this.amount;
    
    // Standard formula for calculating fixed payment for a loan:
    // P = A * r(1+r)^n / ((1+r)^n - 1)
    // Where:
    // P = payment, A = amount (minus downpayment), r = interest rate, n = term in years
    
    const r = this.interestRate;
    const n = this.term;
    const loanAmount = this.amount - this.downPayment;
    
    if (r === 0) {
      // If there's no interest, simply divide the loan amount by the term
      return loanAmount / n;
    }
    
    const payment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return payment;
  }

  getLiability(): MoneyPool | null {
    return this._liability;
  }

  getExpense(): MoneyStream {
    return this._expense;
  }
} 
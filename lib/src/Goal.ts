import { Liability } from "./Liability";
import { Expense } from "./Expense";
import { MoneyPool, MoneyStream } from "./types";
import { getRandomLiabilityColor } from "./colors";

export class Goal {
  name: string;
  color: string;
  startYear: number;
  amount: number;
  interestRate: number;
  term: number;

  private _liability: Liability | null = null;
  private _expense!: Expense;

  constructor(
    name: string,
    color: string,
    startYear: number,
    amount: number,
    interestRate: number,
    term: number
  ) {
    this.name = name;
    this.color = color;
    this.startYear = startYear;
    this.amount = amount;
    this.interestRate = interestRate;
    this.term = term;

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
        0 // No growth for a one-time expense
      );
      // No liability for term = 0
      this._liability = null;
    } else {
      // Calculate the yearly payment amount based on loan parameters
      const yearlyPayment = this.calculateYearlyPayment();
      
      // Create an expense that lasts for the term years
      this._expense = new Expense(
        `${this.name} Payment`,
        this.color,
        this.startYear,
        this.startYear + this.term - 1, // End year is start + term - 1
        yearlyPayment,
        0 // Fixed payment amount, so growth rate is 0
      );
      
      // Create a liability that starts with the full amount
      // and pass the repaymentExpense to the Liability constructor
      // it internally will use the repaymentExpense to calculate the plot points
      this._liability = new Liability(
        `${this.name} Loan`,
        getRandomLiabilityColor(),
        this.startYear,
        this.amount,
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
    // P = payment, A = amount, r = interest rate, n = term in years
    
    const r = this.interestRate;
    const n = this.term;
    
    if (r === 0) {
      // If there's no interest, simply divide the amount by the term
      return this.amount / n;
    }
    
    const payment = this.amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return payment;
  }

  getLiability(): MoneyPool | null {
    return this._liability;
  }

  getExpense(): MoneyStream {
    return this._expense;
  }
} 
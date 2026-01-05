export interface UserProfile {
  name: string
  currentAge: number
  planningHorizonAge: number
  currency: string
  startYear: number
}

export interface Asset {
  id: string
  name: string
  currentValue: number
  growthRate: number
  startYear: number
  risk: number
}

export interface Liability {
  id: string
  name: string
  remainingBalance: number
  monthlyPayment: number
  startYear: number
}

export interface Income {
  id: string
  name: string
  annualAmount: number
  growthRate: number
  startYear: number
  endYear?: number
}

export interface Expense {
  id: string
  name: string
  annualAmount: number
  growthRate: number
  startYear: number
}

export type GoalType = 'one-time' | 'recurring' | 'loan'

export interface Goal {
  id: string
  name: string
  type: GoalType
  year: number
  amount: number
  loanDetails?: {
    downPayment: number
    annualPayment: number
    years: number
    interestRate: number
  }
  recurringDetails?: {
    growthRate: number
    endYear?: number
  }
}

export interface YearlyProjection {
  year: number
  age: number
  totalIncome: number
  incomeBreakdown: Record<string, number>
  totalExpenses: number
  expenseBreakdown: Record<string, number>
  totalAssets: number
  assetBreakdown: Record<string, number>
  totalLiabilities: number
  liabilityBreakdown: Record<string, number>
  netWorth: number
  goals: Goal[]
}

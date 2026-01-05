import type {
  UserProfile,
  Asset,
  Liability,
  Income,
  Expense,
  Goal,
  YearlyProjection,
} from './types'

function getRandomGrowthRate(baseRate: number, risk: number): number {
  if (risk === 0) {
    return baseRate
  }
  
  const minRate = baseRate - (baseRate * risk)
  const maxRate = baseRate + (2 * baseRate * risk)
  
  return minRate + Math.random() * (maxRate - minRate)
}

export function calculateProjections(
  profile: UserProfile,
  assets: Asset[],
  liabilities: Liability[],
  incomes: Income[],
  expenses: Expense[],
  goals: Goal[]
): YearlyProjection[] {
  const projections: YearlyProjection[] = []
  const currentYear = profile.startYear
  const yearsToProject = profile.planningHorizonAge - profile.currentAge + 1

  const activeGoalExpenses = new Map<string, number>()
  const activeGoalLiabilities = new Map<string, { balance: number; payment: number }>()

  for (let i = 0; i < yearsToProject; i++) {
    const year = currentYear + i
    const age = profile.currentAge + i
    const yearsElapsed = i

    const incomeBreakdown: Record<string, number> = {}
    let totalIncome = 0

    incomes.forEach((income) => {
      const yearsActive = year - income.startYear
      const isActive = yearsActive >= 0 && (!income.endYear || year < income.endYear)
      if (isActive) {
        const amount = income.annualAmount * Math.pow(1 + income.growthRate / 100, yearsActive)
        incomeBreakdown[income.id] = amount
        totalIncome += amount
      }
    })

    const expenseBreakdown: Record<string, number> = {}
    let totalExpenses = 0

    expenses.forEach((expense) => {
      const yearsActive = year - expense.startYear
      if (yearsActive >= 0) {
        const amount = expense.annualAmount * Math.pow(1 + expense.growthRate / 100, yearsActive)
        expenseBreakdown[expense.id] = amount
        totalExpenses += amount
      }
    })

    activeGoalExpenses.forEach((amount, goalId) => {
      expenseBreakdown[`goal-${goalId}`] = amount
      totalExpenses += amount
    })

    const yearGoals = goals.filter((g) => g.year === year)
    yearGoals.forEach((goal) => {
      if (goal.type === 'one-time') {
        expenseBreakdown[`goal-${goal.id}`] = goal.amount
        totalExpenses += goal.amount
      } else if (goal.type === 'recurring' && goal.recurringDetails) {
        activeGoalExpenses.set(goal.id, goal.amount)
        expenseBreakdown[`goal-${goal.id}`] = goal.amount
        totalExpenses += goal.amount
      } else if (goal.type === 'loan' && goal.loanDetails) {
        expenseBreakdown[`goal-${goal.id}-down`] = goal.loanDetails.downPayment
        totalExpenses += goal.loanDetails.downPayment
        activeGoalLiabilities.set(goal.id, {
          balance: goal.amount - goal.loanDetails.downPayment,
          payment: goal.loanDetails.annualPayment,
        })
      }
    })

    activeGoalLiabilities.forEach((liability, goalId) => {
      if (liability.balance > 0) {
        expenseBreakdown[`goal-${goalId}-payment`] = Math.min(
          liability.payment,
          liability.balance
        )
        totalExpenses += Math.min(liability.payment, liability.balance)
      }
    })

    goals.forEach((goal) => {
      if (
        goal.type === 'recurring' &&
        goal.recurringDetails &&
        activeGoalExpenses.has(goal.id)
      ) {
        const yearsActive = year - goal.year
        if (yearsActive > 0) {
          const currentAmount = activeGoalExpenses.get(goal.id)!
          const newAmount = currentAmount * (1 + goal.recurringDetails.growthRate / 100)
          activeGoalExpenses.set(goal.id, newAmount)
        }
        if (goal.recurringDetails.endYear && year >= goal.recurringDetails.endYear) {
          activeGoalExpenses.delete(goal.id)
        }
      }
    })

    activeGoalLiabilities.forEach((liability, goalId) => {
      if (liability.balance > 0) {
        liability.balance -= liability.payment
        if (liability.balance <= 0) {
          liability.balance = 0
        }
      }
    })

    const assetBreakdown: Record<string, number> = {}
    let totalAssets = 0

    if (i === 0) {
      assets.forEach((asset) => {
        assetBreakdown[asset.id] = asset.currentValue
        totalAssets += asset.currentValue
      })
    } else {
      const prevProjection = projections[i - 1]
      assets.forEach((asset) => {
        const prevValue = prevProjection.assetBreakdown[asset.id] || 0
        const effectiveGrowthRate = getRandomGrowthRate(asset.growthRate, asset.risk)
        const newValue = prevValue * (1 + effectiveGrowthRate / 100)
        assetBreakdown[asset.id] = newValue
        totalAssets += newValue
      })

      const netChange = prevProjection.totalIncome - prevProjection.totalExpenses
      if (netChange > 0) {
        assetBreakdown['cash-flow'] = (assetBreakdown['cash-flow'] || 0) + netChange
        totalAssets += netChange
      }
    }

    const liabilityBreakdown: Record<string, number> = {}
    let totalLiabilities = 0

    if (i === 0) {
      liabilities.forEach((liability) => {
        liabilityBreakdown[liability.id] = liability.remainingBalance
        totalLiabilities += liability.remainingBalance
      })
    } else {
      const prevProjection = projections[i - 1]
      liabilities.forEach((liability) => {
        const prevBalance = prevProjection.liabilityBreakdown[liability.id] || 0
        const annualPayment = liability.monthlyPayment * 12
        const newBalance = Math.max(0, prevBalance - annualPayment)
        if (newBalance > 0) {
          liabilityBreakdown[liability.id] = newBalance
          totalLiabilities += newBalance
        }
      })
    }

    activeGoalLiabilities.forEach((liability, goalId) => {
      if (liability.balance > 0) {
        liabilityBreakdown[`goal-${goalId}`] = liability.balance
        totalLiabilities += liability.balance
      }
    })

    const netWorth = totalAssets - totalLiabilities

    projections.push({
      year,
      age,
      totalIncome,
      incomeBreakdown,
      totalExpenses,
      expenseBreakdown,
      totalAssets,
      assetBreakdown,
      totalLiabilities,
      liabilityBreakdown,
      netWorth,
      goals: yearGoals,
    })
  }

  return projections
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export interface LoanCalculationParams {
  totalAmount: number
  downPayment: number
  annualPayment?: number
  years?: number
  interestRate?: number
}

export interface LoanCalculationResult {
  downPayment: number
  annualPayment: number
  years: number
  interestRate: number
  loanPrincipal: number
}

export function calculateLoanParameters(params: LoanCalculationParams): LoanCalculationResult | null {
  const { totalAmount, downPayment } = params
  
  if (totalAmount <= 0 || downPayment < 0 || downPayment >= totalAmount) {
    return null
  }
  
  const loanPrincipal = totalAmount - downPayment
  
  if (params.annualPayment && params.years) {
    const P = loanPrincipal
    const A = params.annualPayment
    const n = params.years
    
    if (A <= 0 || n <= 0 || A * n < P) {
      return null
    }
    
    let r = 0.05
    const maxIterations = 100
    const tolerance = 0.0001
    
    for (let i = 0; i < maxIterations; i++) {
      const presentValue = r === 0 ? A * n : A * ((1 - Math.pow(1 + r, -n)) / r)
      const derivative = r === 0 ? 0 : A * (n * Math.pow(1 + r, -n - 1) / r - (1 - Math.pow(1 + r, -n)) / (r * r))
      
      if (Math.abs(presentValue - P) < tolerance) {
        return {
          downPayment,
          annualPayment: A,
          years: n,
          interestRate: parseFloat((r * 100).toFixed(2)),
          loanPrincipal,
        }
      }
      
      if (derivative !== 0) {
        r = r - (presentValue - P) / derivative
      } else {
        r = (A * n - P) / (P * n / 2)
      }
      
      r = Math.max(0, Math.min(r, 0.5))
    }
    
    return {
      downPayment,
      annualPayment: A,
      years: n,
      interestRate: parseFloat((r * 100).toFixed(2)),
      loanPrincipal,
    }
  }
  
  if (params.annualPayment && params.interestRate !== undefined) {
    const A = params.annualPayment
    const r = params.interestRate / 100
    const P = loanPrincipal
    
    if (A <= 0 || r < 0) {
      return null
    }
    
    let years: number
    if (r === 0) {
      years = P / A
    } else {
      if (A <= P * r) {
        return null
      }
      years = -Math.log(1 - (P * r) / A) / Math.log(1 + r)
    }
    
    if (!isFinite(years) || years <= 0) {
      return null
    }
    
    return {
      downPayment,
      annualPayment: A,
      years: Math.ceil(years),
      interestRate: params.interestRate,
      loanPrincipal,
    }
  }
  
  if (params.years && params.interestRate !== undefined) {
    const n = params.years
    const r = params.interestRate / 100
    const P = loanPrincipal
    
    if (n <= 0 || r < 0) {
      return null
    }
    
    let annualPayment: number
    if (r === 0) {
      annualPayment = P / n
    } else {
      annualPayment = (P * r) / (1 - Math.pow(1 + r, -n))
    }
    
    if (!isFinite(annualPayment) || annualPayment <= 0) {
      return null
    }
    
    return {
      downPayment,
      annualPayment: parseFloat(annualPayment.toFixed(2)),
      years: n,
      interestRate: params.interestRate,
      loanPrincipal,
    }
  }
  
  return null
}

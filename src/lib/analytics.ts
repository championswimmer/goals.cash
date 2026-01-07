import posthog from 'posthog-js'
import type { Asset, Liability, Income, Expense, Goal } from './types'

let currentCurrency = 'USD'

export const setAnalyticsCurrency = (currency: string) => {
  currentCurrency = currency
}

export const trackAddIncome = (income: Income) => {
  posthog.capture('add_income', {
    amount: income.annualAmount,
    currency: currentCurrency,
    ...income
  })
}

export const trackAddExpense = (expense: Expense) => {
  posthog.capture('add_expense', {
    amount: expense.annualAmount,
    currency: currentCurrency,
    ...expense
  })
}

export const trackAddAsset = (asset: Asset) => {
  posthog.capture('add_asset', {
    amount: asset.currentValue,
    currency: currentCurrency,
    ...asset
  })
}

export const trackAddLiability = (liability: Liability) => {
  posthog.capture('add_liability', {
    amount: liability.remainingBalance,
    currency: currentCurrency,
    ...liability
  })
}

export const trackAddGoal = (goal: Goal) => {
  posthog.capture('add_goal', {
    amount: goal.amount,
    type: goal.type,
    year: goal.year,
    currency: currentCurrency,
    ...goal
  })
}

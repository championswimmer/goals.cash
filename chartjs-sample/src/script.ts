import {
  Asset,
  Liability,
  Portfolio,
  Income,
  Expense,
  colors
} from "@goalscash/lib/src";

import Chart, { ChartType } from "chart.js/auto";

const pb = new Portfolio.Builder(2015, 2075, new Date().getFullYear(), 30)

// pb.addAsset(new Asset("Savings", "blue", 2015, 100000, 0.05))
// pb.addLiability(new Liability("Mortgage", "red", 2015, 200000, 0.03))
pb.addIncome(new Income("Salary", colors.getRandomIncomeColor(), 2020, 2030, 50000, 0.05))
pb.addIncome(new Income("Side Hustle", colors.getRandomIncomeColor(), 2020, 2030, 10000, 0.05))
pb.addExpense(new Expense("Rent", colors.getRandomExpenseColor(), 2025, 2030, 10000, 0.03))

const portfolio = pb.build()

const ctx = document.getElementById("portfolio-chart") as HTMLCanvasElement

const portfolioChart = new Chart(ctx, {
  data: {
    labels: [
      ...Array.from({ length: portfolio.endYear - portfolio.startYear + 1 }, (_, i) => portfolio.startYear + i),
    ],
    datasets: [
      ...(portfolio.incomes.map(income => ({
        label: income.name,
        type: income.chart,
        backgroundColor: income.color,
        data: income.getPlotPoints(2015, 2075).map((point) => point.value),
      }))),
      ...(portfolio.expenses.map(expense => ({
        label: expense.name,
        type: expense.chart,
        backgroundColor: expense.color,
        data: expense.getPlotPoints(2015, 2075).map((point) => -point.value),
      })))
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
      },
      x: {
        stacked: true,
      }
    },
  }
})

portfolioChart.update()

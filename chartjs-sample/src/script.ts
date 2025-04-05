import {
  Asset,
  Liability,
  Portfolio,
  Income,
  Expense,
  colors,
  PortfolioSimulator,
  SavingsDistribution,
  SpendPriority
} from "@goalscash/lib/src";

import Chart, { ChartType } from "chart.js/auto";

const currentYear = new Date().getFullYear()
const pb = new Portfolio.Builder(2015, 2040, currentYear, 30)

const savingsAsset = new Asset("Savings", colors.getRandomAssetColor(), 2025, 30000, 0.03)
savingsAsset.extrapolateFromStart(2015, 0)
const stocksAsset = new Asset("Stocks", colors.getRandomAssetColor(), 2025, 100000, 0.07)
stocksAsset.extrapolateFromStart(2015, 0)
pb.addAsset(savingsAsset)
pb.addAsset(stocksAsset)
// pb.addLiability(new Liability("Mortgage", "red", 2015, 200000, 0.03))

const salaryIncome = new Income("Salary", colors.getRandomIncomeColor(), 2024, 2034, 85000, 0.05)
// salaryIncome.extrapolateFromStart(2015, 0)
const sideHustleIncome = new Income("Side Hustle", colors.getRandomIncomeColor(), 2023, 2030, 10000, 0.02)
// sideHustleIncome.extrapolateFromStart(2015, 0)
pb.addIncome(salaryIncome)
pb.addIncome(sideHustleIncome)

const rentExpense = new Expense("Rent", colors.getRandomExpenseColor(), currentYear, 2040, 45000, 0.04)
pb.addExpense(rentExpense)
pb.addSavingsDistribution(new SavingsDistribution(2025, 2040, [
  { asset: savingsAsset, percentage: 30 },
  { asset: stocksAsset, percentage: 70 },
]))

pb.addSpendPriority(new SpendPriority(2025, 2040, [
  { asset: savingsAsset, priority: 1},
  { asset: stocksAsset, priority: 2},
]))

const portfolio = pb.build()

const simulator = new PortfolioSimulator(portfolio)
simulator.simulate()


const ctx = document.getElementById("portfolio-chart") as HTMLCanvasElement
const s = portfolio.startYear 
const e = portfolio.endYear
const portfolioChart = new Chart(ctx, {
  data: {
    labels: [
      ...Array.from({ length: e - s + 1 }, (_, i) => s + i),
    ],
    datasets: [
      // net flow
      {
        label: portfolio.netFlow.name,
        type: portfolio.netFlow.chart,
        backgroundColor: portfolio.netFlow.color,
        data: portfolio.netFlow.getPlotPoints(s, e).map((point) => point.value == 0 ? null : point.value),
        stack: "net",
      },
      // incomes
      ...(portfolio.incomes.map(income => ({
        label: income.name,
        type: income.chart,
        backgroundColor: income.color,
        data: income.getPlotPoints(s, e).map((point) => point.value),
        stack: "flow",
      }))),
      // expenses
      ...(portfolio.expenses.map(expense => ({
        label: expense.name,
        type: expense.chart,
        backgroundColor: expense.color,
        data: expense.getPlotPoints(s, e).map((point) => -point.value),
        stack: "flow",
      }))),
      // assets
      ...(portfolio.assets.map(asset => ({
        label: asset.name,
        type: asset.chart === "area" ? "line" : "line" as "line",
        backgroundColor: asset.color,
        fill: asset.chart === "area", // TODO: fill to last index
        data: asset.getPlotPoints(s, e).map((point) => point.value),
        stack: "pool",
      }))),
    ],
  },
  options: {
    locale: "en-US",
    elements: {
      line: {
        cubicInterpolationMode: "monotone",
      }
    },
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


console.log(portfolio)
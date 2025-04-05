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

const cy = new Date().getFullYear()
const sy = 2015 
const ey = 2055

const pb = new Portfolio.Builder(sy, ey, cy, 30)

const cashAsset = new Asset("Cash", colors.getRandomAssetColor(), 2025, 30000, 0.03)
cashAsset.extrapolateFromStart(2020, 0)
cashAsset.spendCutoff = 25000
const stocksAsset = new Asset("Stocks", colors.getRandomAssetColor(), 2025, 100000, 0.07)
stocksAsset.extrapolateFromStart(2020, 0)
stocksAsset.spendCutoff = 20000
pb.addAsset(cashAsset)
pb.addAsset(stocksAsset)
// pb.addLiability(new Liability("Mortgage", "red", 2015, 200000, 0.03))

const salaryIncome = new Income("Salary", colors.getRandomIncomeColor(), 2025, 2035, 87000, 0.05)
const rsuIncome = new Income("RSU", colors.getRandomIncomeColor(), 2025, 2030, 72000, 0.05)
// salaryIncome.extrapolateFromStart(2015, 0)
const sideHustleIncome = new Income("Side Hustle", colors.getRandomIncomeColor(), 2023, 2035, 8000, 0.02)
// sideHustleIncome.extrapolateFromStart(2015, 0)
pb.addIncome(salaryIncome)
pb.addIncome(rsuIncome)
pb.addIncome(sideHustleIncome)

const rentExpense1 = new Expense("Rent", colors.getRandomExpenseColor(), cy, 2040, 2700 * 12, 0.04)
const rentExpense2 = new Expense("Rent", colors.getRandomExpenseColor(), 2041, ey, 3200 * 12, 0.04)
const livingExpense = new Expense("Living", colors.getRandomExpenseColor(), cy, ey, 1800 * 12, 0.04)
const travelExpense = new Expense("Travel", colors.getRandomExpenseColor(), cy, 2040, 20000, 0)
pb.addExpense(rentExpense1)
pb.addExpense(rentExpense2)
pb.addExpense(livingExpense)
pb.addExpense(travelExpense)

pb.addSavingsDistribution(new SavingsDistribution(cy, ey, [
  { asset: cashAsset, percentage: 30 },
  { asset: stocksAsset, percentage: 70 },
]))

pb.addSpendPriority(new SpendPriority(cy, ey, [
  { asset: cashAsset, priority: 1},
  { asset: stocksAsset, priority: 2},
]))

const portfolio = pb.build()
portfolio.overrideSpendCutoff = false

const simulator = new PortfolioSimulator(portfolio)
simulator.simulate()


const ctx = document.getElementById("portfolio-chart") as HTMLCanvasElement
const portfolioChart = new Chart(ctx, {
  data: {
    labels: [
      ...Array.from({ length: ey - sy + 1 }, (_, i) => sy + i),
    ],
    datasets: [
      // net flow
      {
        label: portfolio.netFlow.name,
        type: portfolio.netFlow.chart,
        backgroundColor: portfolio.netFlow.color,
        data: portfolio.netFlow.getPlotPoints(sy, ey).map((point) => point.value == 0 ? null : point.value),
        stack: "net",
      },
      // incomes
      ...(portfolio.incomes.map(income => ({
        label: income.name,
        type: income.chart,
        backgroundColor: income.color,
        data: income.getPlotPoints(sy, ey).map((point) => point.value),
        stack: "flow",
      }))),
      // expenses
      ...(portfolio.expenses.map(expense => ({
        label: expense.name,
        type: expense.chart,
        backgroundColor: expense.color,
        data: expense.getPlotPoints(sy, ey).map((point) => -point.value),
        stack: "flow",
      }))),
      // assets
      ...(portfolio.assets.map(asset => ({
        label: asset.name,
        type: asset.chart === "area" ? "line" : "line" as "line",
        backgroundColor: asset.color,
        fill: asset.chart === "area", // TODO: fill to last index
        data: asset.getPlotPoints(sy, ey).map((point) => point.value),
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
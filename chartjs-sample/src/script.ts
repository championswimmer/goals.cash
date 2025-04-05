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

const pb = new Portfolio.Builder(2015, 2035, new Date().getFullYear(), 30)

const savingsAsset = new Asset("Savings", colors.getRandomAssetColor(), 2015, 10000, 0.01)
pb.addAsset(savingsAsset)
// pb.addLiability(new Liability("Mortgage", "red", 2015, 200000, 0.03))
pb.addIncome(new Income("Salary", colors.getRandomIncomeColor(), 2020, 2030, 50000, 0.05))
pb.addIncome(new Income("Side Hustle", colors.getRandomIncomeColor(), 2020, 2030, 10000, 0.05))
pb.addExpense(new Expense("Rent", colors.getRandomExpenseColor(), 2022, 2033, 20000, 0.03))

pb.addSavingsDistribution(new SavingsDistribution(2015, 2035, [
  { asset: savingsAsset, percentage: 100 },
]))

pb.addSpendPriority(new SpendPriority(2015, 2035, [
  { asset: savingsAsset, priority: 1}
]))

const portfolio = pb.build()

const simulator = new PortfolioSimulator(portfolio)
simulator.simulate()


const ctx = document.getElementById("portfolio-chart") as HTMLCanvasElement

const portfolioChart = new Chart(ctx, {
  data: {
    labels: [
      ...Array.from({ length: portfolio.endYear - portfolio.startYear + 1 }, (_, i) => portfolio.startYear + i),
    ],
    datasets: [
      // net flow
      {
        label: portfolio.netFlow.name,
        type: portfolio.netFlow.chart,
        backgroundColor: portfolio.netFlow.color,
        data: portfolio.netFlow.getPlotPoints(2015, 2035).map((point) => point.value),
        stack: "net",
      },
      // incomes
      ...(portfolio.incomes.map(income => ({
        label: income.name,
        type: income.chart,
        backgroundColor: income.color,
        data: income.getPlotPoints(2015, 2035).map((point) => point.value),
        stack: "flow",
      }))),
      // expenses
      ...(portfolio.expenses.map(expense => ({
        label: expense.name,
        type: expense.chart,
        backgroundColor: expense.color,
        data: expense.getPlotPoints(2015, 2035).map((point) => -point.value),
        stack: "flow",
      }))),
      // assets
      ...(portfolio.assets.map(asset => ({
        label: asset.name,
        type: asset.chart === "area" ? "line" : "line" as "line",
        backgroundColor: asset.color,
        fill: asset.chart === "area", // TODO: fill to last index
        data: asset.getPlotPoints(2015, 2035).map((point) => point.value),
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
      y1: {
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
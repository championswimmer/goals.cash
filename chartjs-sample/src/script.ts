import {
  Asset,
  Liability,
  Portfolio,
  Income,
  Expense,
} from "@goalscash/lib/src";

import Chart, { ChartType } from "chart.js/auto";

const portfolio = new Portfolio(
  2015,
  2075,
  new Date().getFullYear(),
  30
)

portfolio.addAsset(new Asset("Savings", "blue", 2015, 100000, 0.05))
portfolio.addLiability(new Liability("Mortgage", "red", 2015, 200000, 0.03))
portfolio.addIncome(new Income("Salary", "green", 2015, 2030, 50000, 0.05))
portfolio.addExpense(new Expense("Rent", "yellow", 2015, 2030, 10000, 0.03))

// const portfolioChart = new Chart(ctx, {
//   data: {
//     labels: Object.keys(yearlyData[0].data),
//     datasets: yearlyData.map((plottable) => ({
//       label: plottable.name,
//       type: plottable.type,
//       data: Object.values(plottable.data).map((value) => value * (plottable.name == "Rent" ? -1 : 1)),
//     })),
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//       x: {
//         stacked: true,
//       }
//     },
//   }
// })

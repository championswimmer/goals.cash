import {
  Asset,
  ExpenseStream,
  IncomeStream,
  MajorExpense,
  Portfolio,
} from "@goalscash/lib/src";

import Chart, { ChartType } from "chart.js/auto";

const portfolio = new Portfolio(
  2015,
  2075,
  new Date().getFullYear(),
  30,
  false,
);

portfolio.addIncomeStream(new IncomeStream("Salary", 2025, 2045, 180000, 3));

portfolio.addExpenseStream(new ExpenseStream("Rent", 2025, 2050, 12 * 2200, 3));

portfolio.addMajorExpense(new MajorExpense("House", 2030, 100000))

portfolio.addAsset(Asset.create(portfolio, "Cash", 2025, 120000, 3));

console.log(portfolio);

console.log(portfolio.getYearlyData());

const chart = document.getElementById("portfolio-chart") as HTMLCanvasElement;
const ctx = chart.getContext("2d") as CanvasRenderingContext2D;

const yearlyData = portfolio.getYearlyData();

const portfolioChart = new Chart(ctx, {
  data: {
    labels: Object.keys(yearlyData[0].data),
    datasets: yearlyData.map((plottable) => ({
      label: plottable.name,
      type: plottable.type,
      data: Object.values(plottable.data).map((value) => value * (plottable.name == "Rent" ? -1 : 1)),
    })),
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        stacked: true,
      }
    },
  }
})

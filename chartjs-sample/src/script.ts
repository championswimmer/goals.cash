import { Asset, ExpenseStream, IncomeStream, Portfolio } from "@goalscash/lib/src";

const portfolio = new Portfolio(
    2015,
    2075,
    new Date().getFullYear(),
    30,
    false
)

portfolio.addIncomeStream(new IncomeStream(
    "Salary",
    2025,
    2045,
    180000,
    3
))

portfolio.addExpenseStream(new ExpenseStream(
    "Rent",
    2025,
    2050,
    12 * 2200, 
    3
))

portfolio.addAsset(Asset.create(portfolio, "Cash", 2025, 120000, 3))

console.log(portfolio)

console.log(portfolio.getYearlyData())

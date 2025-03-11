import { IncomeStream, Portfolio } from "@goalscash/lib/src";

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
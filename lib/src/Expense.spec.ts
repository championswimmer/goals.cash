import { describe, it, expect } from "@jest/globals";
import { Expense } from "./Expense";
import { getRandomExpenseColor } from "./commons/colors";

describe("Expense", () => {
  it("should create an expense", () => {
    const expense = new Expense("Expense", getRandomExpenseColor(), 2020, 2025, 1000, 0.05);

    const plotPoints = expense.getPlotPoints(2020, 2025);

    expect(plotPoints.length).toBe(6);

    expect(plotPoints[0].year).toBe(2020);
    expect(plotPoints[0].value).toBe(1000);

    expect(plotPoints[1].year).toBe(2021);
    expect(plotPoints[1].value).toBe(1050);

    expect(expense.getPlotPoint(2020).value).toBe(1000);
    expect(expense.getPlotPoint(2021).value).toBe(1050);
    
  });

  it("should create an expense with a down payment", () => {
    const expense = new Expense("Expense", getRandomExpenseColor(), 2020, 2025, 1000, 0.05, 1000);

    const plotPoints = expense.getPlotPoints(2020, 2025);

    expect(plotPoints[0].value).toBe(2000);
  });
});
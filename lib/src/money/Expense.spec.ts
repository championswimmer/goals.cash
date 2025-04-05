import { describe, it, expect } from "@jest/globals";
import { ErrorExpenseBounds, Expense } from "./Expense";
import { getRandomExpenseColor } from "../commons/colors";
import { ErrorUnsupportedExtrapolation } from "../commons/errors";

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

  it("should handle years outside of expense period", () => {
    const expense = new Expense("Expense", getRandomExpenseColor(), 2021, 2024, 1000, 0.05);

    const plotPoints = expense.getPlotPoints(2020, 2025);

    expect(plotPoints.length).toBe(6);
    expect(plotPoints[0].year).toBe(2020);
    expect(plotPoints[0].value).toBe(0);
    expect(plotPoints[5].year).toBe(2025);
    expect(plotPoints[5].value).toBe(0);

    // 0 for years before the expense starts
    expect(expense.getPlotPoint(2010).value).toBe(0);
  });

  it("should handle down payment in first year", () => {
    const expense = new Expense("Expense", getRandomExpenseColor(), 2020, 2025, 1000, 0.05, 5000);

    const plotPoints = expense.getPlotPoints(2020, 2025);

    expect(plotPoints[0].year).toBe(2020);
    expect(plotPoints[0].value).toBe(6000); // 1000 + 5000 down payment

    expect(plotPoints[1].year).toBe(2021);
    expect(plotPoints[1].value).toBe(1050); // No down payment in subsequent years
  });

  it("should throw error for invalid year bounds", () => {
    expect(() => {
      new Expense("Expense", getRandomExpenseColor(), 2025, 2020, 1000, 0.05);
    }).toThrow(ErrorExpenseBounds);
  });

  it("should throw error when trying to extrapolate", () => {
    const expense = new Expense("Expense", getRandomExpenseColor(), 2020, 2025, 1000, 0.05);
    
    expect(() => {
      expense.extrapolateFromStart(2010, 0);
    }).toThrow(ErrorUnsupportedExtrapolation);
  });
});
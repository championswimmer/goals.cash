import { describe, it, expect } from "@jest/globals";
import { Income } from "./Income";
import { getRandomIncomeColor } from "../commons/colors";

describe("Income", () => {
  it("should create an income", () => {
    const income = new Income("Income", getRandomIncomeColor(), 2020, 2025, 1000, 0.05);

    const plotPoints = income.getPlotPoints(2020, 2025);

    expect(plotPoints.length).toBe(6);

    expect(plotPoints[0].year).toBe(2020);
    expect(plotPoints[0].value).toBe(1000);

    expect(plotPoints[1].year).toBe(2021);
    expect(plotPoints[1].value).toBe(1050);

    expect(income.getPlotPoint(2020).value).toBe(1000);
    expect(income.getPlotPoint(2021).value).toBe(1050);
  });

  it("should handle years outside of income period", () => {
    const income = new Income("Income", getRandomIncomeColor(), 2021, 2024, 1000, 0.05);

    const plotPoints = income.getPlotPoints(2020, 2025);

    expect(plotPoints.length).toBe(6);
    expect(plotPoints[0].year).toBe(2020);
    expect(plotPoints[0].value).toBe(0);
    expect(plotPoints[5].year).toBe(2025);
    expect(plotPoints[5].value).toBe(0);

    // 0 for years before the income starts
    expect(income.getPlotPoint(2010).value).toBe(0);

  });

  it("should extrapolate income", () => {
    const income = new Income("Income", getRandomIncomeColor(), 2020, 2025, 1000, 0.05);

    income.extrapolateFromStart(2010, 0);

    expect(income.getPlotPoint(2010).value).toBe(0);
    expect(income.getPlotPoint(2011).value).toBe(100);
    expect(income.getPlotPoint(2012).value).toBe(200);
    
  })
}); 
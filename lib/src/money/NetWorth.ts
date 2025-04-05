import { ErrorOutsidePortfolioBounds, Portfolio } from "..";
import { ErrorPortfolioSimulationIncomplete } from "../commons/errors";
import { MoneyPlottable, MoneyPool, PlotPoint } from "../commons/types";

export class NetWorth implements MoneyPool {
  type: "pool" = "pool";
  chart: "area" = "area";
  poolType: "worth" = "worth";
  name: string = "Net Worth";
  // translucent green-grey
  color: string = "rgba(100, 200, 100, 0.5)";

  initYear: number;
  initValue: number;
  growthRate: number = 0;

  // reference to the portfolio whose networth this is 
  private _portfolio: Portfolio;

  private _plotPoints: Map<number, number> = new Map();

  constructor(portfolio: Portfolio) {
    this._portfolio = portfolio;
    this.initYear = portfolio.startYear;
    this.initValue = 0;
  }

  extrapolateFromStart(startYear: number, startValue?: number): MoneyPlottable {
    throw new Error("Unsupported operation");
  }
  populatePastValues(...values: PlotPoint[]): MoneyPlottable {
    throw new Error("Unsupported operation");
  }

  
  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => this.getPlotPoint(startYear + i));
  }

  getPlotPoint(year: number): PlotPoint {
    if (year < this._portfolio.startYear || year > this._portfolio.endYear) {
      throw new ErrorOutsidePortfolioBounds("Network Cannot be plotted outside portfolio bounds");
    }

    if (this._plotPoints.has(year)) {
      throw new ErrorPortfolioSimulationIncomplete(`Plot point for year ${year} not found. Run portfolio.simulate()`);
    }

    return {  
      year,
      value: this._plotPoints.get(year) || 0
    };
  }

}

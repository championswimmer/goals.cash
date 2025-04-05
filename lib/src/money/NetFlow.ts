import { ErrorOutsidePortfolioBounds, ErrorPortfolioSimulationIncomplete } from "../commons/errors";
import { MoneyPlottable, MoneyStream, PlotPoint } from "../commons/types";
import { Portfolio } from "../Portfolio";

export class NetFlow implements MoneyStream {
  type: "stream" = "stream";
  chart: "line" = "line"
  streamType: "flow" = "flow";
  endYear: number;
  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;

  // reference to the portfolio whose netflow this is 
  private _portfolio: Portfolio;

  private _plotPoints: Map<number, number> = new Map();

  constructor(portfolio: Portfolio) {
    this._portfolio = portfolio;
    this.name = "Net Flow";
    // translucent grey color
    this.color = "rgba(56, 56, 56, 0.8)";
    this.initYear = portfolio.startYear;
    this.initValue = 0;
    this.endYear = portfolio.endYear;
    this.growthRate = 0;
  }

  extrapolateFromStart(startYear: number, startValue?: number): MoneyPlottable {
    throw new Error("Unsuported operation");
  }
  populatePastValues(...values: PlotPoint[]): MoneyPlottable {
    throw new Error("Unsuported operation");
  }

  updatePlotPoint(year: number, value: number) {
    if (year < this._portfolio.startYear || year > this._portfolio.endYear) {
      throw new ErrorOutsidePortfolioBounds("NetFlow cannot be plotted outside portfolio bounds");
    }
    this._plotPoints.set(year, value);
  }


  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => this.getPlotPoint(startYear + i));
  }

  getPlotPoint(year: number): PlotPoint {
    return {  
      year,
      value: this._plotPoints.get(year) || 0
    };
  }
  
  
}
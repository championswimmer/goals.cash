import { Expense } from './Expense';
import { populatePlotPointsWithPastData } from '../commons/plot-point-utils';
import { MoneyPool, PlotPoint } from '../commons/types';
import { ErrorPortfolioSimulationIncomplete } from '../commons/errors';

export class Liability implements MoneyPool {
  type: "pool" = "pool";
  chart: "area" = "area";
  poolType: "liability" = "liability";
  repaymentExpense: Expense | undefined;

  name: string;
  color: string;
  initYear: number;
  initValue: number;
  growthRate: number;

  private _plotPoints: Map<number, number> = new Map();

  constructor(name: string, color: string, initYear: number, initValue: number, growthRate: number, repaymentExpense?: Expense) {
    this.name = name;
    this.color = color;
    this.initYear = initYear;
    this.initValue = initValue;
    this.growthRate = growthRate;
    this.repaymentExpense = repaymentExpense;

    // Initialize the first plot point
    this._plotPoints.set(initYear, initValue);
  }

  getPlotPoints(startYear: number, endYear: number): PlotPoint[] {
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => this.getPlotPoint(startYear + i));
  }

  getPlotPoint(year: number): PlotPoint {
    // if before init year, save 0 as value and return it 
    if (year < this.initYear) {
      this._plotPoints.set(year, 0);
      return {
        year,
        value: 0
      };
    }
    // check if year is in plot points
    if (!this._plotPoints.has(year)) {
      throw new ErrorPortfolioSimulationIncomplete(`Plot point for year ${year} not found. Run portfolio.simulate()`);
    }
    return {
      year,
      value: this._plotPoints.get(year) || 0
    };
  }

  extrapolateFromStart(startYear: number, startValue: number): MoneyPool {
    // noop - liabilities are not extrapolated 
    throw new Error("Liabilities are not extrapolated");
  }

  // TODO: commonize with Asset.populatePastValues
  populatePastValues(...values: PlotPoint[]): Liability {
    populatePlotPointsWithPastData(this._plotPoints, this.initYear, this.initValue, ...values);
    return this;
  }
} 
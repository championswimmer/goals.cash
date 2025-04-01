
export interface PlotPoint {
  year: number
  value: number
}

/**
 * Represents an object that can be plotted on a financial chart
 * Pools are usually represented as an area chart
 * Streams are usually represented as a bar chart
 */
export interface MoneyPlottable {
  name: string
  type: "pool" | "stream"
  chart: "area" | "line" | "bar"
  color: string
  /**
   * The base year for this data point. 
   * This needs to be between start and end of portfolio
   */
  initYear: number

  /**
   * The initial value of this data point at the initYear
   * For pools this is the "total amount" of the pool, positive is assets, negative is liabilities
   * For streams this is the initial "flow per year", positive is inflow, negative is outflow
   */
  initValue: number

  /**
   * The growth rate of this data point (eg: 5% represents 0.05)
   * For pools this means the pool grows by this much each year
   *  eg: 100k savings account with 5% growth rate will be 105k in the next year
   * For streams, the stream grows by this much each year
   *  eg: 100k salary with 5% growth rate will be 105k salary in the next year
   */
  growthRate: number

  getPlotPoints(startYear: number, endYear: number): PlotPoint[]
}

/**
 * A pool of money (e.g. assets, liabilities, etc.) 
 * Pools start with an initial value and grow or shrink over time
 * Pools have a start year, but no end year
 */
export interface MoneyPool extends MoneyPlottable {
  type: "pool"
  chart: "area"
  poolType: "asset" | "liability"

  /**
   * Extrapolate the pool's value from startValue at the startYear to the initial value at the initYear
   * @param startYear The start year of the portfolio
   */
  extrapolateFromStart(startYear: number, startValue: number): MoneyPool
}

/**
 * A stream of money (e.g. income, expenses, etc.)
 * Streams start with an initial 'amount per year' and grow or shrink over time
 * Streams have a start year and an end year
 */
export interface MoneyStream extends MoneyPlottable {
  type: "stream"
  chart: "bar"
  streamType: "income" | "expense"

  /**
   * The end year of the stream
   */
  endYear: number

  /**
   * Extrapolate the stream's value from startValue at the startYear to the initial value at the initYear
   * @param startYear The start year of the portfolio
   */
  extrapolateFromStart(startYear: number, startValue: number): MoneyStream
}


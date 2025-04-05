import { PlotPoint } from "..";

export function extrapolatePlotPointsFromStart(
  plotPoints: Map<number, number>,
  initYear: number,
  initValue: number,
  startYear: number, 
  startValue: number = 0
) {

  if (startYear >= initYear) {
    throw new Error("Start year must be less than init year");
  }

  // Calculate the yearly increment for linear growth
  const yearDiff = initYear - startYear;
  const valueIncrement = (initValue - startValue) / yearDiff;

  // Clear any existing points before initYear
  for (let year = startYear; year < initYear; year++) {
    plotPoints.delete(year);
  }

  // Fill values from startYear to initYear using linear growth
  let currentValue = startValue;
  for (let year = startYear; year < initYear; year++) {
    plotPoints.set(year, currentValue);
    currentValue += valueIncrement;
  }

  // Ensure initYear has its original value
  plotPoints.set(initYear, initValue);

}

export function populatePlotPointsWithPastData(
  plotPoints: Map<number, number>,
  initYear: number,
  initValue: number,
  ...values: PlotPoint[]
) {
  // add the initYear to the values
  values.push({ year: initYear, value: initValue });

  values.sort((a, b) => a.year - b.year).forEach((value, index) => {
    if (value.year > initYear) {
      // TODO: custom error
      throw new Error("Value year must be less than init year");
    }

    // interpolate values for missing years if there is a gap
    if (index > 0 && values[index - 1].year < value.year - 1) {
      const prevValue = values[index - 1].value;
      const yearDiff = value.year - values[index - 1].year;
      const valueIncrement = (value.value - prevValue) / yearDiff;
      for (let year = values[index - 1].year + 1; year < value.year; year++) {
        plotPoints.set(year, prevValue + valueIncrement * (year - values[index - 1].year));
      }
    }

    // set the value for the year
    plotPoints.set(value.year, value.value);
  })
}
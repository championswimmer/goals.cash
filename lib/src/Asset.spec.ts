import { describe, it, expect } from "@jest/globals";
import { Asset } from "./Asset";
import { getRandomAssetColor } from "./colors";

describe("Asset", () => {
  it("should create an asset", () => {
    const asset = new Asset("Asset", getRandomAssetColor(), 2020, 1000, 0.05);

    expect(asset.name).toBe("Asset");

    const plotPoints = asset.getPlotPoints(2020, 2025);

    expect(plotPoints.length).toBe(6);
    expect(plotPoints[0].year).toBe(2020);
    expect(plotPoints[0].value).toBe(1000);

    expect(plotPoints[1].year).toBe(2021);
    expect(plotPoints[1].value).toBe(1050);

    expect(plotPoints[2].year).toBe(2022);
    expect(plotPoints[2].value).toBe(1102.5);
  });

  it("should not extrapolate by default", () => {
    const asset = new Asset("Asset", getRandomAssetColor(), 2020, 1000, 0.05);

    const plotPoints = asset.getPlotPoints(2015, 2025);

    expect(plotPoints.length).toBe(11);

    expect(plotPoints[0].year).toBe(2015);
    expect(plotPoints[0].value).toBe(0);

    expect(plotPoints[1].year).toBe(2016);
    expect(plotPoints[1].value).toBe(0);

    expect(asset.getPlotPoint(2015).value).toBe(0);

  })

  it("should extrapolate the asset's value", () => {
    const asset = new Asset("Asset", getRandomAssetColor(), 2020, 1000, 0.05);

    asset.extrapolateFromStart(2015, 500);

    const plotPoints = asset.getPlotPoints(2015, 2025);

    expect(plotPoints.length).toBe(11);

    expect(plotPoints[0].year).toBe(2015);
    expect(plotPoints[0].value).toBe(500);

    expect(plotPoints[1].year).toBe(2016);
    expect(plotPoints[1].value).toBe(600);





  })
});
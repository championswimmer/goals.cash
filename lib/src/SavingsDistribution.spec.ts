import { describe, it, expect } from "@jest/globals";
import { Asset, SavingsDistribution } from "./";
import { getRandomAssetColor } from "./colors";

describe("SavingsDistribution", () => {
  const cashSavings = new Asset("Cash Savings", getRandomAssetColor(), 2015, 100000, 0.05);
  const stocks = new Asset("Stocks", getRandomAssetColor(), 2018, 200000, 0.12);
  it("should throw an error if the savings distribution is not 100% mapped", () => {
    expect(() => {
      const savingsDistribution = new SavingsDistribution(2020, 2030, [
        { asset: cashSavings, percentage: 20 },
        { asset: stocks, percentage: 30 },
      ]);
    }).toThrow("Savings distribution must be 100% mapped");
  });

  it("should throw an error if the asset is not started yet", () => {
    expect(() => {
      const savingsDistribution = new SavingsDistribution(2015, 2030, [
        { asset: cashSavings, percentage: 20 },
        { asset: stocks, percentage: 30 },
      ]);
    }).toThrow("Cannot distribute savings for an asset that has not started yet");
  });


});

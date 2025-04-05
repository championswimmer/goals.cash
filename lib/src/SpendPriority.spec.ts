import { describe, it, expect } from "@jest/globals";
import { Asset, SavingsDistribution, SpendPriority } from "./";
import { getRandomAssetColor } from "./commons/colors";


describe("SpendPriority", () => {
  const cashSavings = new Asset("Cash Savings", getRandomAssetColor(), 2015, 100000, 0.05);
  const stocks = new Asset("Stocks", getRandomAssetColor(), 2018, 200000, 0.12);
  const house = new Asset("House", getRandomAssetColor(), 2020, 300000, 0.03, false);

  // FIXME: for now ignoring this error (as other assets will be spent from)
  
  // it("should throw an error for spending from an asset that has not started yet", () => {
  //   expect(() => {
  //     const spendPriority = new SpendPriority(2014, 2030, [
  //       { priority: 0, asset: cashSavings },
  //     ]);
  //   }).toThrow("Cannot spend from an asset that has not started yet");
  // })

  it("should throw an error for spending from an asset that is not liquid", () => {
    expect(() => {
      const spendPriority = new SpendPriority(2020, 2025, [
        { priority: 0, asset: house },
      ]);
    }).toThrow("Cannot spend from an asset that is not liquid");
  })

  it("should throw an error if spend priority has conflicting priority numbers", () => {

    expect(() => {
      const spendPriority = new SpendPriority(2018, 2020, [
        { priority: 0, asset: cashSavings },
        { priority: 0, asset: stocks },
      ]);
    }).toThrow("All priorities must be unique");

  })
})
import { Asset } from ".";

type SavingsAssetMap = Array<{ asset: Asset, percentage: number }>

export class SavingsDistribution {
  startYear: number;
  endYear: number;
  savingsAssetMap!: SavingsAssetMap;

  constructor(startYear: number, endYear: number, savingsAssetMap: SavingsAssetMap) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.setSavingsAssetMap(savingsAssetMap);
  }

  private static is100PercentMapped(savingsAssetMap: SavingsAssetMap): boolean {
    const totalSavings = savingsAssetMap.reduce((acc, curr) => acc + curr.percentage, 0);
    return totalSavings === 100;
  }

  private setSavingsAssetMap(savingsAssetMap: Array<{ asset: Asset, percentage: number }>): void {
    // check all assets have startYear <= this.startYear
    for (const { asset, percentage } of savingsAssetMap) {
      if (this.startYear < asset.initYear) {
        // TODO: add error class
        throw new Error("Cannot distribute savings for an asset that has not started yet");
      }
    }

    // check sum of savings distribution is 100%
    const is100PercentMapped = SavingsDistribution.is100PercentMapped(savingsAssetMap);
    if (!is100PercentMapped) {
      throw new Error("Savings distribution must be 100% mapped");
    }

    this.savingsAssetMap = savingsAssetMap;
  }
}
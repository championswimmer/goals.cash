import { Asset } from ".";

export class SavingsDistribution {
  startYear: number;
  endYear: number;
  savingsAssetMap: Map<Asset, number> = new Map();

  constructor(startYear: number, endYear: number) {
    this.startYear = startYear;
    this.endYear = endYear;
  }

  private static is100PercentMapped(savingsAssetMap: Map<Asset, number>): boolean {
    const totalSavings = Array.from(savingsAssetMap.values()).reduce((acc, curr) => acc + curr, 0);
    return totalSavings === 100;
  }

  private validate(): void {
    if (!SavingsDistribution.is100PercentMapped(this.savingsAssetMap)) {
      throw new Error("Savings distribution must be 100% mapped");
    }
  }

  private setSavingsDistribution(savingsAssetMap: Map<Asset, number>): void {
    // check all assets have startYear <= this.startYear
    for (const asset of savingsAssetMap.keys()) {
      if (asset.initYear < this.startYear) {
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
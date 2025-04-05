import { Asset } from ".";

/**
 * This defines how surplus income (i.e. savings) is distributed across assets.
 * Since there can be multiple assets in the portfolio, the surplus income can be distributed among them.
 */
export class SavingsDistribution {
  startYear: number;
  endYear: number;
  private _savingsAssetMap!: Array<{ asset: Asset, percentage: number }>;

  public get savingsAssetMap(): Array<{ asset: Asset, percentage: number }> {
    return this._savingsAssetMap;
  }

  constructor(startYear: number, endYear: number, savingsAssetMap: Array<{ asset: Asset, percentage: number }>) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.setSavingsAssetMap(savingsAssetMap);
  }

  private static is100PercentMapped(savingsAssetMap: Array<{ asset: Asset, percentage: number }>): boolean {
    const totalSavings = savingsAssetMap.reduce((acc, curr) => acc + curr.percentage, 0);
    return totalSavings === 100;
  }

  private setSavingsAssetMap(savingsAssetMap: Array<{ asset: Asset, percentage: number }>): void {
    // check all assets have startYear <= this.startYear and are liquid
    for (const { asset, percentage } of savingsAssetMap) {
      if (this.startYear < asset.initYear) {
        // TODO: add error class
        throw new Error("Cannot distribute savings for an asset that has not started yet");
      }
      if (!asset.isLiquid) {
        // TODO: add error class
        throw new Error("Cannot distribute savings to an asset that is not liquid");
      }
    }

    // check sum of savings distribution is 100%
    const is100PercentMapped = SavingsDistribution.is100PercentMapped(savingsAssetMap);
    if (!is100PercentMapped) {
      throw new Error("Savings distribution must be 100% mapped");
    }

    this._savingsAssetMap = savingsAssetMap;
  }
}
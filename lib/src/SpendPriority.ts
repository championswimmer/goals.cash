import { Asset } from ".";

type SpendPriorityMap = Array<{ priority: number, asset: Asset }>

/**
 * This defines how deficit income is spent from assets
 * Since there can be multiple assets in the portfolio, 
 * the deficit income can be spent from them in a priority order 
 * 
 * - Lower priority spenders are spent first
 * - In first pass, spends are calculated from priority 0 -> max priority
 *  - Spending is done upto spendCutoff for each asset
 * - If the entire deficit is not spend, then a second pass is done again 0 -> max priority
 *  - This time spendCutoff is not considered
 */
export class SpendPriority {
  startYear: number;
  endYear: number; 
  spendPriorityMap!: SpendPriorityMap;

  constructor(startYear: number, endYear: number, spendPriorityMap: SpendPriorityMap) {
    this.startYear = startYear;
    this.endYear = endYear;
    this.setSpendPriorityMap(spendPriorityMap);
  }

  private setSpendPriorityMap(spendPriorityMap: SpendPriorityMap): void {
    // check all assets have startYear <= this.startYear and are liquid
    for (const { priority, asset } of spendPriorityMap) {
      if (this.startYear < asset.initYear) {
        // TODO: add error class
        throw new Error("Cannot spend from an asset that has not started yet");
      }
      if (!asset.isLiquid) {
        // TODO: add error class
        throw new Error("Cannot spend from an asset that is not liquid");
      }
    }

    // check all priorities are unique
    const priorities = spendPriorityMap.map(({ priority }) => priority);
    const uniquePriorities = new Set(priorities);
    if (uniquePriorities.size !== spendPriorityMap.length) {
      throw new Error("All priorities must be unique");
    }

    // sort spendPriorityMap by priority and save it 
    this.spendPriorityMap = spendPriorityMap.sort((a, b) => a.priority - b.priority);
  }
}
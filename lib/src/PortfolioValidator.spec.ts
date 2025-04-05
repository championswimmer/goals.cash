import { describe, it, expect } from "@jest/globals";
import {Asset,ErrorOutsidePortfolioBounds, ErrorSavingsDistributionGap, ErrorSavingsDistributionOverlap, ErrorSpendPriorityGap, ErrorSpendPriorityOverlap, Expense, Income, Liability, Portfolio, PortfolioValidator, SavingsDistribution, SpendPriority} from ".";
import { getRandomAssetColor, getRandomExpenseColor, getRandomIncomeColor, getRandomLiabilityColor } from "./commons/colors";

describe("PortfolioValidator", () => {
  it("should invalidate adding items outside portfolio bounds", () => {
    const pb = new Portfolio.Builder(
      2020,
      2075,
      2025,
      30
    )
    expect(() => {
      pb.addAsset(new Asset('Asset1', getRandomAssetColor(), 2019, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)

    expect(() => {
      pb.addLiability(new Liability('Liability1', getRandomLiabilityColor(), 2019, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)

    expect(() => {
      pb.addIncome(new Income('Income1', getRandomIncomeColor(), 2019, 2024, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)

    expect(() => {
      pb.addExpense(new Expense('Expense1', getRandomExpenseColor(), 2019, 2024, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)
  });

  describe("SavingsDistributions", () => {

    it("should invalidate adding savings distribution outside portfolio bounds", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2025, 2027, 100000, 0.05)
      pb.addIncome(income1)

      expect(() => {
        pb.addSavingsDistribution(new SavingsDistribution(
          2019,
          2027,
          [{
            asset: asset1,
            percentage: 100
          }]
        ))
      }).toThrow(Error)
    })

    it("should invalidate missing savings distribution", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2025, 2027, 100000, 0.05)
      pb.addIncome(income1)

      expect(() => {
        pb.build()
      }).toThrow(ErrorSavingsDistributionGap)
    })

    it("should invalidate savings distribution not at the beginning of the first asset", () => {

      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2025, 2027, 100000, 0.05)
      pb.addIncome(income1)

      // now add a valid savings distribution, but not at the beginning of the first asset
      pb.addSavingsDistribution(new SavingsDistribution(
        2026,
        2028,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))


      expect(() => {
        pb.build()
      }).toThrow("First savings distribution must start at beginning of first asset")
    })

    it("should invalidate savings distribution not upto end of portfolio", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2025, 2027, 100000, 0.05)
      pb.addIncome(income1)

      // now add a valid savings distribution, but not at the beginning of the first asset
      pb.addSavingsDistribution(new SavingsDistribution(
        2027,
        2029,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution at the beginning of the first asset
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2026,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      expect(() => {
        pb.build()
      }).toThrow("Last savings distribution must end at portfolio end year")
    })

    it("should invalidate savings distribution with gaps", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2025, 2027, 100000, 0.05)
      pb.addIncome(income1)

      // now add a valid savings distribution, but not at the beginning of the first asset
      pb.addSavingsDistribution(new SavingsDistribution(
        2027,
        2029,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution at the beginning of the first asset
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2026,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution that ends at the end of the portfolio
      pb.addSavingsDistribution(new SavingsDistribution(
        2032,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      expect(() => {
        pb.build()
      }).toThrow(ErrorSavingsDistributionGap)
    })

    it("should invalidate savings distribution with overlaps", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2025, 2027, 100000, 0.05)
      pb.addIncome(income1)

      // now add a valid savings distribution, but not at the beginning of the first asset
      pb.addSavingsDistribution(new SavingsDistribution(
        2027,
        2029,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution at the beginning of the first asset
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2026,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution that ends at the end of the portfolio
      pb.addSavingsDistribution(new SavingsDistribution(
        2028,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      expect(() => {
        pb.build()
      }).toThrow(ErrorSavingsDistributionOverlap)
    })

  })

  describe("SpendPriorities", () => {

    it("should invalidate adding spend priority outside portfolio bounds", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)

      expect(() => {
        pb.addSpendPriority(new SpendPriority(
          2019,
          2025,
          [{
            priority: 0,
            asset: asset1
          }]
        ))
      }).toThrow(Error)
    })

    it("should invalidate missing spend priority", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))
      expect(() => {
        pb.build()
      }).toThrow(ErrorSpendPriorityGap)
    })

    it("should invalidate spend priority not at the beginning of the first asset", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid spend priority, but not at the beginning of the first asset
      pb.addSpendPriority(new SpendPriority(
        2026,
        2028,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      expect(() => {
        pb.build()
      }).toThrow("First spend priority must start at beginning of first asset")
    })

    it("should invalidate spend priority not upto end of portfolio", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid spend priority, but not at the beginning of the first asset
      pb.addSpendPriority(new SpendPriority(
        2027,
        2029,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      // now add a valid spend priority at the beginning of the first asset
      pb.addSpendPriority(new SpendPriority(
        2025,
        2026,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      expect(() => {
        pb.build()
      }).toThrow("Last spend priority must end at portfolio end year")
    })

    it("should invalidate spend priority with gaps", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid spend priority, but not at the beginning of the first asset
      pb.addSpendPriority(new SpendPriority(
        2027,
        2029,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      // now add a valid spend priority at the beginning of the first asset
      pb.addSpendPriority(new SpendPriority(
        2020,
        2021,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      // now add a valid spend priority that ends at the end of the portfolio
      pb.addSpendPriority(new SpendPriority(
        2031,
        2075,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      expect(() => {
        pb.build()
      }).toThrow(ErrorSpendPriorityGap)
    })

    it("should invalidate spend priority with overlaps", () => {
      const pb = new Portfolio.Builder(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2025, 100000, 0.05)
      pb.addAsset(asset1)
      pb.addSavingsDistribution(new SavingsDistribution(
        2025,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid spend priority, but not at the beginning of the first asset
      pb.addSpendPriority(new SpendPriority(
        2027,
        2075,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      // now add a valid spend priority at the beginning of the first asset
      pb.addSpendPriority(new SpendPriority(
        2025,
        2026,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      // now add a valid spend priority that ends at the end of the portfolio
      pb.addSpendPriority(new SpendPriority(
        2028,
        2075,
        [{
          priority: 0,
          asset: asset1
        }]
      ))

      expect(() => {
        pb.build()
      }).toThrow(ErrorSpendPriorityOverlap)
    })

  })

});
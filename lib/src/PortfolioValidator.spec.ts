import { describe, it, expect } from "@jest/globals";
import { Asset, ErrorOutsidePortfolioBounds, ErrorSavingsDistributionGap, ErrorSavingsDistributionOverlap, Expense, Income, Liability, Portfolio, PortfolioValidator, SavingsDistribution } from ".";
import { getRandomAssetColor, getRandomExpenseColor, getRandomIncomeColor, getRandomLiabilityColor } from "./colors";

describe("PortfolioValidator", () => {
  it("should invalidate adding items outside portfolio bounds", () => {
    const portfolio = new Portfolio(
      2020,
      2075,
      2025,
      30
    )
    const validator = new PortfolioValidator(portfolio)
    expect(() => {
      portfolio.addAsset(new Asset('Asset1', getRandomAssetColor(), 2019, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)

    expect(() => {
      portfolio.addLiability(new Liability('Liability1', getRandomLiabilityColor(), 2019, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)

    expect(() => {
      portfolio.addIncome(new Income('Income1', getRandomIncomeColor(), 2019, 2024, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)

    expect(() => {
      portfolio.addExpense(new Expense('Expense1', getRandomExpenseColor(), 2019, 2024, 100000, 0.05))
    }).toThrow(ErrorOutsidePortfolioBounds)
  });

  describe("SavingsDistributions", () => {

    it("should invalidate adding savings distribution outside portfolio bounds", () => {
      const portfolio = new Portfolio(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2020, 100000, 0.05)
      portfolio.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2020, 2024, 100000, 0.05)
      portfolio.addIncome(income1)

      const validator = new PortfolioValidator(portfolio)
      expect(() => {
        portfolio.addSavingsDistribution(new SavingsDistribution(
          2019,
          2025,
          [{
            asset: asset1,
            percentage: 100
          }]
        ))
      }).toThrow(Error)
    })

    it("should invalidate missing savings distribution", () => {
      const portfolio = new Portfolio(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2020, 100000, 0.05)
      portfolio.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2020, 2024, 100000, 0.05)
      portfolio.addIncome(income1)

      const validator = new PortfolioValidator(portfolio)


      expect(() => {
        validator.validateSavingsDistributions()
      }).toThrow(ErrorSavingsDistributionGap)
    })

    it("should invalidate savings distribution not at the beginning of the first asset", () => {

      const portfolio = new Portfolio(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2020, 100000, 0.05)
      portfolio.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2020, 2024, 100000, 0.05)
      portfolio.addIncome(income1)

      const validator = new PortfolioValidator(portfolio)

      // now add a valid savings distribution, but not at the beginning of the first asset
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2022,
        2025,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))


      expect(() => {
        validator.validateSavingsDistributions()
      }).toThrow("First savings distribution must start at beginning of first asset")
    })

    it("should invalidate savings distribution not upto end of portfolio", () => {
      const portfolio = new Portfolio(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2020, 100000, 0.05)
      portfolio.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2020, 2024, 100000, 0.05)
      portfolio.addIncome(income1)

      const validator = new PortfolioValidator(portfolio)

      // now add a valid savings distribution, but not at the beginning of the first asset
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2022,
        2025,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution at the beginning of the first asset
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2020,
        2021,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      expect(() => {
        validator.validateSavingsDistributions()
      }).toThrow("Last savings distribution must end at portfolio end year")
    })

    it("should invalidate savings distribution with gaps", () => {
      const portfolio = new Portfolio(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2020, 100000, 0.05)
      portfolio.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2020, 2024, 100000, 0.05)
      portfolio.addIncome(income1)

      const validator = new PortfolioValidator(portfolio)

      // now add a valid savings distribution, but not at the beginning of the first asset
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2022,
        2025,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution at the beginning of the first asset
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2020,
        2021,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution that ends at the end of the portfolio
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2027,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      expect(() => {
        validator.validateSavingsDistributions()
      }).toThrow(ErrorSavingsDistributionGap)
    })

    it("should invalidate savings distribution with overlaps", () => {
      const portfolio = new Portfolio(
        2020,
        2075,
        2025,
        30
      )
      const asset1 = new Asset('Asset1', getRandomAssetColor(), 2020, 100000, 0.05)
      portfolio.addAsset(asset1)
      const income1 = new Income('Income1', getRandomIncomeColor(), 2020, 2024, 100000, 0.05)
      portfolio.addIncome(income1)

      const validator = new PortfolioValidator(portfolio)

      // now add a valid savings distribution, but not at the beginning of the first asset
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2022,
        2025,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution at the beginning of the first asset
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2020,
        2021,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      // now add a valid savings distribution that ends at the end of the portfolio
      portfolio.addSavingsDistribution(new SavingsDistribution(
        2025,
        2075,
        [{
          asset: asset1,
          percentage: 100
        }]
      ))

      expect(() => {
        validator.validateSavingsDistributions()
      }).toThrow(ErrorSavingsDistributionOverlap)
    })

  })

});
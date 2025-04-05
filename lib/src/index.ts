import { getRandomAssetColor, getRandomExpenseColor, getRandomIncomeColor, getRandomLiabilityColor } from "./commons/colors"

export {
  MoneyPool,
  MoneyStream,
  MoneyPlottable,
  PlotPoint,
} from "./commons/types"

export { Asset } from "./money/Asset"
export { Liability } from "./money/Liability"
export { Income } from "./money/Income"
export { Expense } from "./money/Expense"
export { Goal } from "./Goal"
export { Portfolio } from "./Portfolio"
export { SavingsDistribution } from "./SavingsDistribution"
export { SpendPriority } from "./SpendPriority"
export {
  PortfolioValidator,
} from "./PortfolioValidator"
export { PortfolioSimulator } from "./PortfolioSimulator"

export {
  ErrorOutsidePortfolioBounds,
  ErrorSavingsDistributionGap,
  ErrorSavingsDistributionOverlap,
  ErrorSpendPriorityGap,
  ErrorSpendPriorityOverlap
} from "./commons/errors"


export const colors = {
  getRandomAssetColor,
  getRandomExpenseColor,
  getRandomIncomeColor,
  getRandomLiabilityColor,
}
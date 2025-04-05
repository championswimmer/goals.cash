export class ErrorUnsupportedExtrapolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_NO_EXTRAPOLATE";
  }
}

export class ErrorOutsidePortfolioBounds extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_PORTFOLIO_BOUNDS";
  }
}
export class ErrorSavingsDistributionGap extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_SAVINGS_DISTRIBUTION_GAP";
  }
}

export class ErrorSavingsDistributionOverlap extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_SAVINGS_DISTRIBUTION_OVERLAP";
  }
}

export class ErrorSpendPriorityGap extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_SPEND_PRIORITY_GAP";
  }
}

export class ErrorSpendPriorityOverlap extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_SPEND_PRIORITY_OVERLAP";
  }
}

export class ErrorPortfolioSimulationIncomplete extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_PORTFOLIO_SIMULATION_INCOMPLETE";
  }
}

export class ErrorDeficitExceedsAssets extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_DEFICIT_EXCEEDS_ASSETS";
  }
}
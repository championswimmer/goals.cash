

### TODO 

- [ ] If a goal buys something like a house, the house is an asset, but the money used to buy the house is a liability.
  - [ ] Generate assets from goals as well 
  - [ ] Differentiate between liquid and non-liquid assets

## Documentation 

### Class Diagram 

```mermaid 
classDiagram
    class MoneyPlottable {
        <<interface>>
        +String name
        +String type
        +String chart
        +String color
        +Number initYear
        +Number initValue
        +Number growthRate
        +getPlotPoint(year)
        +getPlotPoints(startYear, endYear)
        +extrapolateFromStart(startYear, startValue)
        +populatePastValues(...values)
    }

    class MoneyPool {
        <<interface>>
        +String type = "pool"
        +String chart = "area"
        +String poolType
    }

    class MoneyStream {
        <<interface>>
        +String type = "stream"
        +String chart = "bar"
        +String streamType
        +Number endYear
    }

    class Asset {
        +Boolean isLiquid
        +Number spendCutoff
        +String poolType = "asset"
        -Map _plotPoints
        +calculatePlotPoints(startYear, endYear)
    }

    class Liability {
        +String poolType = "liability"
        -Map _plotPoints
        +calculatePlotPoints(startYear, endYear)
    }

    class Income {
        +String streamType = "income"
        -Map _plotPoints
        +calculatePlotPoints(startYear, endYear)
    }

    class Expense {
        +String streamType = "expense"
        -Map _plotPoints
        +calculatePlotPoints(startYear, endYear)
    }

    class Portfolio {
        +Number startYear
        +Number endYear
        +Number currentYear
        +Number currentAge
        +Asset[] assets
        +Liability[] liabilities
        +Income[] incomes
        +Expense[] expenses
        +SavingsDistribution[] savingsDistributions
        +SpendPriority[] spendPriorities
        +getSavingsDistribution(year)
        +getSpendPriority(year)
    }

    class PortfolioValidator {
        -Portfolio portfolio
        +validate()
        +validateAsset(asset)
        +validateLiability(liability)
        +validateIncome(income)
        +validateExpense(expense)
        +validateSavingsDistribution(sd)
        +validateSpendPriority(sp)
    }

    class SavingsDistribution {
        +Number startYear
        +Number endYear
        +Map<String, Number> distribution
    }

    class SpendPriority {
        +Number startYear
        +Number endYear
        +String[] priority
    }

    MoneyPlottable <|-- MoneyPool
    MoneyPlottable <|-- MoneyStream
    MoneyPool <|-- Asset
    MoneyPool <|-- Liability
    MoneyStream <|-- Income
    MoneyStream <|-- Expense
    Portfolio "1" *-- "*" Asset
    Portfolio "1" *-- "*" Liability
    Portfolio "1" *-- "*" Income
    Portfolio "1" *-- "*" Expense
    Portfolio "1" *-- "*" SavingsDistribution
    Portfolio "1" *-- "*" SpendPriority
    PortfolioValidator "1" --> "1" Portfolio
```
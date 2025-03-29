import {describe, test, expect} from "@jest/globals";
import { Asset, Portfolio } from ".";
import { PortfolioYearBoundsError } from "./errors";

describe('Portfolio', () => {
    test('create portfolio', () => {
        const portfolio = new Portfolio(2015, 2075, 2025, 30);
        expect(portfolio.startYear).toBe(2015);
    })

    test('fail to add asset before start year', () => {
        const portfolio = new Portfolio(2015, 2075, 2025, 30);
        expect(() => {
            portfolio.addAsset(
                Asset.create('Savings', 2010, 100000, 0.05, false)
            );
        }).toThrowError(PortfolioYearBoundsError);
    })
})
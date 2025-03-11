import MajorExpense  from './MajorExpense';

describe('MajorExpense', () => {

  describe('calculateAnnualPayment', () => {
    it('should calculate the annual payment for a 1 year loan', () => {
      const annualPayment = MajorExpense.calculateAnnualPayment(100000, 5, 1, 0);
      expect(annualPayment).toBeCloseTo(105000, 2);
    })

    it('should calculate the annual payment for a 2 year loan with a 5% interest rate and a 20% down payment', () => {
      const annualPayment = MajorExpense.calculateAnnualPayment(100000, 5, 2, 20000);
      const repayableAmount = (100000 - 20000) * (1 + 5 / 100) ** 2;
      expect(annualPayment * 2).toBeCloseTo(repayableAmount, 2);
    })
  });
});
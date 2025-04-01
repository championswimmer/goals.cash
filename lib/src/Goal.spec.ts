import { getRandomExpenseColor } from './colors';
import { Goal } from './Goal';

describe('Goal', () => {
  it('should create a one-time expense when term is 0', () => {
    const goal = new Goal('Home Purchase', getRandomExpenseColor(), 2025, 500000, 0, 0);
    
    // Check that the expense is created correctly
    const expense = goal.getExpense();
    expect(expense).toBeDefined();
    expect(expense.name).toBe('Home Purchase');
    expect(expense.initYear).toBe(2025);
    expect(expense.endYear).toBe(2025);
    expect(expense.initValue).toBe(500000);
    
    // Check that there is no liability
    const liability = goal.getLiability();
    expect(liability).toBeNull();
  });
  
  it('should create both an expense and liability when term > 0', () => {
    const goal = new Goal('Home Mortgage', getRandomExpenseColor(), 2025, 500000, 0.04, 30);
    
    // Check that the expense is created correctly
    const expense = goal.getExpense();
    expect(expense).toBeDefined();
    expect(expense.name).toBe('Home Mortgage Payment');
    expect(expense.initYear).toBe(2025);
    expect(expense.endYear).toBe(2055); // 2025 + 30
    expect(expense.initValue).toBeGreaterThan(0);
    expect(expense.growthRate).toBe(0);
    
    // Check that the liability is created correctly
    const liability = goal.getLiability();
    expect(liability).toBeDefined();
    expect(liability?.name).toBe('Home Mortgage Loan');
    expect(liability?.initYear).toBe(2025);
    expect(liability?.initValue).toBe(500000);
    expect(liability?.growthRate).toBe(0.04);

  });
  
  it('should calculate correct payments for a loan with interest', () => {
    const goal = new Goal('Car Loan', getRandomExpenseColor(), 2025, 40000, 0.05, 5);
    
    // Get the expense and check payment amount
    const expense = goal.getExpense();
    
    // The monthly payment formula for a 40k loan at 5% for 5 years gives ~9238.99 per year
    // We allow for small rounding differences
    expect(expense.initValue).toBeCloseTo(9238.99, 0);

    // Check that the liability is created correctly
    const liability = goal.getLiability();
    expect(liability?.initValue).toBeCloseTo(40000, 0);

  });

  it("should create a loan with a down payment", () => {
    const goal = new Goal("Car Loan", getRandomExpenseColor(), 2025, 40000, 0.05, 4, 10000);

    const expense = goal.getExpense();
    expect(expense.initValue).toBeCloseTo(8460.35, 0);

    const liability = goal.getLiability();
    expect(liability?.initValue).toBeCloseTo(30000, 0);

  });
  
  it('should calculate correct payments for a 0% interest loan', () => {
    const goal = new Goal('Interest-free Loan', getRandomExpenseColor(), 2025, 10000, 0, 4);
    
    // Get the expense and check payment amount
    const expense = goal.getExpense();
    
    // For 0% interest, should be simple division
    expect(expense.initValue).toBe(2500); // 10000 / 4
  });
}); 
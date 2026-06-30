import { formatCurrency, calculateDiscountedPrice } from '../../src/shared/utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats a round number correctly', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats to 2 decimal places', () => {
    expect(formatCurrency(19.9)).toBe('$19.90');
    expect(formatCurrency(19.99)).toBe('$19.99');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles large numbers', () => {
    expect(formatCurrency(1999.99)).toBe('$1,999.99');
  });

  it('returns $0.00 for non-finite values', () => {
    expect(formatCurrency(Infinity)).toBe('$0.00');
    expect(formatCurrency(NaN)).toBe('$0.00');
  });
});

describe('calculateDiscountedPrice', () => {
  it('applies discount correctly', () => {
    expect(calculateDiscountedPrice(100, 10)).toBeCloseTo(90);
    expect(calculateDiscountedPrice(200, 25)).toBeCloseTo(150);
  });

  it('returns full price when discount is 0', () => {
    expect(calculateDiscountedPrice(100, 0)).toBe(100);
  });

  it('clamps to 0 for 100% discount', () => {
    expect(calculateDiscountedPrice(100, 100)).toBe(0);
  });

  it('never returns negative', () => {
    expect(calculateDiscountedPrice(50, 200)).toBe(0);
  });
});

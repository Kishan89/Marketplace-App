/**
 * Format a number as a currency string.
 * @example formatCurrency(1999.9) → "$1,999.90"
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  if (!isFinite(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate discounted price.
 */
export const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
  return Math.max(0, price - (price * discountPercentage) / 100);
};

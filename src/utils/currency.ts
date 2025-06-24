/**
 * Enhanced currency formatting utilities
 * Consolidates all currency-related formatting logic with backward compatibility
 */

// Keep existing function for backward compatibility
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Enhanced version with more options
export const formatCurrencyAdvanced = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies
    return `${amount.toFixed(2)}`;
  }
};

export const parseCurrency = (currencyString: string): number => {
  // Remove currency symbols and convert to number
  const cleaned = currencyString.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
};

export const formatCompactCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  try {
    if (amount >= 1000000) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(amount);
    }

    return formatCurrencyAdvanced(amount, currency, locale);
  } catch (error) {
    // Fallback
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return `${amount.toFixed(2)}`;
  }
};

export const calculateBudgetPercentage = (
  spent: number,
  budget: number
): number => {
  if (budget <= 0) return 0;
  return Math.round((spent / budget) * 100);
};

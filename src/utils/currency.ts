/**
 * Currency formatting utilities
 * Consolidates all currency-related formatting logic
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyWithCents = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]+/g, "");
  return parseFloat(cleaned) || 0;
};

export const calculateBudgetPercentage = (
  spent: number,
  budget: number
): number => {
  if (budget <= 0) return 0;
  return Math.round((spent / budget) * 100);
};

export const getBudgetStatus = (
  spent: number,
  budget: number
): "under" | "near" | "over" => {
  if (budget <= 0) return "under";
  const percentage = spent / budget;
  if (percentage >= 1) return "over";
  if (percentage >= 0.9) return "near";
  return "under";
};

export const formatBudgetRange = (min: number, max: number): string => {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateBudgetPercentage = (
  spent: number,
  budget: number
): number => {
  if (budget <= 0) return 0;
  return Math.round((spent / budget) * 100);
};

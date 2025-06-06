import { Component, Show } from "solid-js";
import ProgressBar from "../common/ProgressBar";

interface BudgetBreakdownProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

const BudgetBreakdown: Component<BudgetBreakdownProps> = (props) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const budgetUsedPercentage =
    props.totalBudget > 0 ? (props.totalSpent / props.totalBudget) * 100 : 0;

  return (
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
            <span class="text-sm text-gray-700">Total Budget</span>
          </div>
          <span class="text-sm font-semibold text-gray-900">
            {formatCurrency(props.totalBudget)}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
            <span class="text-sm text-gray-700">Total Spent</span>
          </div>
          <span class="text-sm font-semibold text-gray-900">
            {formatCurrency(props.totalSpent)}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class={`w-4 h-4 rounded-full mr-3 ${
                props.remainingBudget < 0 ? "bg-red-500" : "bg-green-500"
              }`}
            ></div>
            <span class="text-sm text-gray-700">Remaining</span>
          </div>
          <span
            class={`text-sm font-semibold ${
              props.remainingBudget < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatCurrency(props.remainingBudget)}
          </span>
        </div>

        <Show when={props.totalBudget > 0}>
          <ProgressBar
            progress={budgetUsedPercentage}
            label="Budget Used"
            showPercentage={true}
            color={
              props.totalSpent > props.totalBudget
                ? "red"
                : props.totalSpent > props.totalBudget * 0.9
                ? "yellow"
                : "green"
            }
          />
          <Show when={props.totalSpent > props.totalBudget}>
            <p class="text-xs text-red-600 mt-1 font-medium">
              ⚠️ Over budget by{" "}
              {formatCurrency(props.totalSpent - props.totalBudget)}
            </p>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default BudgetBreakdown;

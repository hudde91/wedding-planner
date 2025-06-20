import { Component, Show } from "solid-js";
import { BudgetSummary } from "../../types";
import {
  formatCurrency,
  calculateBudgetPercentage,
} from "../../utils/currency";

interface BudgetOverviewCardProps {
  stats: BudgetSummary;
}

const BudgetOverviewCard: Component<BudgetOverviewCardProps> = (props) => {
  return (
    <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-medium text-gray-900">Budget Overview</h3>
          <p class="text-sm text-gray-500 font-light">
            Financial planning summary
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Total Budget</span>
          </div>
          <span class="text-lg font-medium text-gray-900">
            {formatCurrency(props.stats.totalBudget)}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Total Spent</span>
          </div>
          <span class="text-lg font-medium text-gray-900">
            {formatCurrency(props.stats.totalSpent)}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class={`w-3 h-3 rounded-full ${
                props.stats.remainingBudget < 0
                  ? "bg-red-400"
                  : "bg-emerald-400"
              }`}
            ></div>
            <span class="text-sm font-medium text-gray-700">Remaining</span>
          </div>
          <span
            class={`text-lg font-medium ${
              props.stats.remainingBudget < 0
                ? "text-red-600"
                : "text-emerald-600"
            }`}
          >
            {formatCurrency(props.stats.remainingBudget)}
          </span>
        </div>

        <Show when={props.stats.totalBudget > 0}>
          <div class="mt-6">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Budget Used</span>
              <span>
                {calculateBudgetPercentage(
                  props.stats.totalSpent,
                  props.stats.totalBudget
                )}
                %
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class={`h-2 rounded-full transition-all duration-1000 ${
                  props.stats.totalSpent > props.stats.totalBudget
                    ? "bg-gradient-to-r from-red-400 to-red-500"
                    : props.stats.totalSpent > props.stats.totalBudget * 0.9
                    ? "bg-gradient-to-r from-amber-400 to-orange-400"
                    : "bg-gradient-to-r from-emerald-400 to-green-400"
                }`}
                style={`width: ${Math.min(
                  calculateBudgetPercentage(
                    props.stats.totalSpent,
                    props.stats.totalBudget
                  ),
                  100
                )}%`}
              ></div>
            </div>
            <Show when={props.stats.totalSpent > props.stats.totalBudget}>
              <p class="text-xs text-red-600 mt-2 font-medium">
                Over budget by{" "}
                {formatCurrency(
                  props.stats.totalSpent - props.stats.totalBudget
                )}
              </p>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default BudgetOverviewCard;

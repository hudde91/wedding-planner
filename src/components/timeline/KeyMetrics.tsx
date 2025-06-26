import { Component } from "solid-js";
import { formatCurrency } from "../../utils/currency";

interface KeyMetricsProps {
  overallProgress: number;
  budgetUtilization: number;
  totalBudget: number;
  totalGuests: number;
  attendingGuests: number;
  remainingTasks: number;
  totalTasks: number;
}

const KeyMetrics: Component<KeyMetricsProps> = (props) => {
  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80)
      return "bg-gradient-to-r from-green-400 to-emerald-500";
    if (percentage >= 60) return "bg-gradient-to-r from-blue-400 to-cyan-500";
    if (percentage >= 40)
      return "bg-gradient-to-r from-orange-400 to-amber-500";
    return "bg-gradient-to-r from-red-400 to-rose-500";
  };

  return (
    <div class="animate-fade-in-up-delay-400 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {/* Overall Progress */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="text-2xl font-light text-blue-600 mb-1">
          {props.overallProgress}%
        </div>
        <div class="text-sm text-gray-600 font-light">Overall Progress</div>
        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div
            class={`h-1.5 rounded-full transition-all duration-1000 ${getProgressBarColor(
              props.overallProgress
            )}`}
            style={`width: ${props.overallProgress}%`}
          ></div>
        </div>
      </div>

      {/* Budget Used */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <svg
              class="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
        </div>
        <div class="text-2xl font-light text-green-600 mb-1">
          {props.budgetUtilization}%
        </div>
        <div class="text-sm text-gray-600 font-light">Budget Used</div>
        <div class="text-xs text-gray-500 mt-1">
          {formatCurrency(props.totalBudget)} total
        </div>
      </div>

      {/* Total Guests */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <svg
              class="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
        <div class="text-2xl font-light text-purple-600 mb-1">
          {props.totalGuests}
        </div>
        <div class="text-sm text-gray-600 font-light">Total Guests</div>
        <div class="text-xs text-gray-500 mt-1">
          {props.attendingGuests} attending
        </div>
      </div>

      {/* Tasks Remaining */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
            <svg
              class="w-5 h-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5 0h6a2 2 0 002-2V7a2 2 0 00-2-2h-6m1-5v4m0 0v4m0-4h4m-4 0H9m0 0v4"
              />
            </svg>
          </div>
        </div>
        <div class="text-2xl font-light text-orange-600 mb-1">
          {props.remainingTasks}
        </div>
        <div class="text-sm text-gray-600 font-light">Tasks Remaining</div>
        <div class="text-xs text-gray-500 mt-1">
          of {props.totalTasks} total
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;

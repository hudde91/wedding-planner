import { Component } from "solid-js";
import { BudgetSummary } from "../../types";
import { formatCurrency } from "../../utils/currency";
import { getWeddingCountdown } from "../../utils/date";

interface StatsGridProps {
  stats: BudgetSummary;
}

const StatsGrid: Component<StatsGridProps> = (props) => {
  const countdown = () => getWeddingCountdown(props.stats.weddingDate);

  return (
    <div class="animate-fade-in-up-delay-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Days Until Wedding */}
      <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 lg:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
        <div class="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 lg:mb-4">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-xs lg:text-sm font-medium text-gray-600 tracking-wide">
              Days Until Wedding
            </p>
            <p class={`text-2xl lg:text-3xl font-light ${countdown().color}`}>
              {props.stats.daysUntilWedding !== null
                ? props.stats.daysUntilWedding
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Total Attendees */}
      <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 lg:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 lg:mb-4">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-xs lg:text-sm font-medium text-gray-600 tracking-wide">
              Total Attendees
            </p>
            <p class="text-2xl lg:text-3xl font-light text-blue-600">
              {props.stats.totalAttendees}
            </p>
            <p class="text-xs text-gray-500 font-light">
              {props.stats.totalGuests} invited
            </p>
          </div>
        </div>
      </div>

      {/* Budget Status */}
      <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 lg:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 lg:mb-4">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6 text-white"
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
          <div class="space-y-1">
            <p class="text-xs lg:text-sm font-medium text-gray-600 tracking-wide">
              Budget Remaining
            </p>
            <p
              class={`text-2xl lg:text-3xl font-light ${
                props.stats.remainingBudget < 0
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {formatCurrency(props.stats.remainingBudget)}
            </p>
            <p class="text-xs text-gray-500 font-light">
              {formatCurrency(props.stats.totalSpent)} of{" "}
              {formatCurrency(props.stats.totalBudget)} spent
            </p>
          </div>
        </div>
      </div>

      {/* Planning Progress */}
      <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 lg:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 lg:mb-4">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6 text-white"
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
          <div class="space-y-2 lg:space-y-3">
            <div class="space-y-1">
              <p class="text-xs lg:text-sm font-medium text-gray-600 tracking-wide">
                Planning Progress
              </p>
              <p class="text-2xl lg:text-3xl font-light text-purple-600">
                {Math.round(props.stats.todoProgress)}%
              </p>
              <p class="text-xs text-gray-500 font-light">
                {props.stats.completedTodos} of {props.stats.totalTodos} tasks
              </p>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-purple-400 to-violet-400 h-2 rounded-full transition-all duration-1000"
                style={`width: ${Math.min(props.stats.todoProgress, 100)}%`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;

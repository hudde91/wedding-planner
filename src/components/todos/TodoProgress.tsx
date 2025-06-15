import { Component, createMemo } from "solid-js";
import { formatCurrency } from "../../utils/currency";
import {
  getProgressColorClass,
  getProgressMessage,
} from "../../utils/progress";

interface TodoProgressProps {
  completedCount: number;
  totalCount: number;
  totalSpent: number;
}

const TodoProgress: Component<TodoProgressProps> = (props) => {
  const progressPercentage = createMemo(() =>
    props.totalCount > 0 ? (props.completedCount / props.totalCount) * 100 : 0
  );

  const getProgressColor = () => getProgressColorClass(progressPercentage());
  const _getProgressMessage = () => getProgressMessage(progressPercentage());

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Progress Card */}
      <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-white"
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
            <div>
              <h2 class="text-xl font-medium text-gray-900">
                Planning Progress
              </h2>
              <p class="text-sm text-gray-500 font-light">
                Track your wedding preparation
              </p>
            </div>
          </div>

          <div class="text-right">
            <div class="text-3xl font-light text-gray-900">
              {Math.round(progressPercentage())}%
            </div>
            <div class="text-sm text-gray-500 font-light">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div class="space-y-3">
          <div class="flex justify-between text-sm text-gray-600">
            <span class="font-medium">
              {props.completedCount} of {props.totalCount} tasks completed
            </span>
            <span class="font-light">{_getProgressMessage()}</span>
          </div>

          <div class="relative">
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class={`bg-gradient-to-r ${getProgressColor()} h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                style={`width: ${Math.min(progressPercentage(), 100)}%`}
              >
                {/* Animated shine effect */}
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Progress milestones */}
          <div class="flex justify-between text-xs text-gray-400 font-light">
            <span>Started</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Tip */}
        <div class="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg border border-blue-100/50">
          <p class="text-sm text-gray-700 font-light">
            <span class="font-medium">💡 Pro tip:</span> Click on any task to
            add vendor details, costs, and inspiration notes. Completing
            detailed information automatically marks tasks as done.
          </p>
        </div>
      </div>

      {/* Budget Summary Card */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Task Spending</h3>
            <p class="text-sm text-gray-500 font-light">Vendor costs tracked</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="text-center p-6 bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-lg border border-purple-100/50">
            <div class="text-3xl font-light text-purple-600 mb-1">
              {formatCurrency(props.totalSpent)}
            </div>
            <div class="text-sm text-gray-600 font-light">Total Allocated</div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">
                Tasks with costs
              </span>
              <span class="text-sm text-gray-600">
                {props.totalCount > 0
                  ? `${Math.round(
                      (props.completedCount / props.totalCount) * 100
                    )}%`
                  : "0%"}
              </span>
            </div>

            <div class="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">
                Avg per task
              </span>
              <span class="text-sm text-gray-600">
                {props.completedCount > 0
                  ? formatCurrency(props.totalSpent / props.completedCount)
                  : formatCurrency(0)}
              </span>
            </div>
          </div>

          <div class="text-xs text-gray-500 font-light text-center mt-4 p-3 bg-yellow-50/50 rounded-lg border border-yellow-100/50">
            <span class="font-medium">Note:</span> Add vendor details to tasks
            to track your actual wedding costs
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoProgress;

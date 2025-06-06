import { Component } from "solid-js";
import ProgressBar from "../common/ProgressBar";

interface TodoProgressProps {
  completedCount: number;
  totalCount: number;
  totalSpent: number;
}

const TodoProgress: Component<TodoProgressProps> = (props) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const progressPercentage =
    props.totalCount > 0 ? (props.completedCount / props.totalCount) * 100 : 0;

  {
    console.log("Progress percentage:", progressPercentage);
  }
  return (
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Wedding Checklist</h2>
        <div class="text-right">
          <div class="text-sm text-gray-600">Total Spent</div>
          <div class="text-lg font-bold text-purple-600">
            {formatCurrency(props.totalSpent)}
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">
            Planning Progress
          </span>
          <span class="text-sm text-gray-600">
            {props.completedCount} / {props.totalCount} completed
          </span>
        </div>
        <ProgressBar progress={progressPercentage} color="purple" />
        <div class="mt-2 text-xs text-gray-600">
          Click on any task to add vendor details, costs, and notes
        </div>
      </div>
    </div>
  );
};

export default TodoProgress;

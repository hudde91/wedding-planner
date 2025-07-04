import { Component, Show, For } from "solid-js";
import { TodoItem } from "../../types";
import { pluralize } from "../../utils/validation";
import TimelineTodoItem from "./TimelineTodoItem";

interface PlanningPhaseData {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  priority: "critical" | "high" | "medium" | "low";
  tasks: TodoItem[];
  completionRate: number;
  isActive: boolean;
  isOverdue: boolean;
}

interface PlanningPhaseProps {
  phase: PlanningPhaseData;
  isExpanded: boolean;
  onToggle: () => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const PlanningPhase: Component<PlanningPhaseProps> = (props) => {
  const getPhaseStatusColor = (phase: PlanningPhaseData) => {
    if (phase.isOverdue) return "border-red-300 bg-red-50";
    if (phase.isActive) return "border-blue-300 bg-blue-50";
    if (phase.completionRate === 100) return "border-green-300 bg-green-50";
    return "border-gray-200 bg-white";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80)
      return "bg-gradient-to-r from-green-400 to-emerald-500";
    if (percentage >= 60) return "bg-gradient-to-r from-blue-400 to-cyan-500";
    if (percentage >= 40)
      return "bg-gradient-to-r from-orange-400 to-amber-500";
    return "bg-gradient-to-r from-red-400 to-rose-500";
  };

  return (
    <div
      class={`rounded-xl border shadow-lg transition-all duration-500 ${getPhaseStatusColor(
        props.phase
      )}`}
    >
      {/* Phase Header */}
      <div
        class="p-4 sm:p-6 cursor-pointer hover:bg-black/5 transition-colors touch-manipulation tap-highlight-transparent"
        onClick={props.onToggle}
      >
        <div class="flex items-start space-x-3 sm:space-x-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
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

          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div class="flex-1 min-w-0 mb-2 sm:mb-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">
                    {props.phase.name}
                  </h3>
                  <Show when={props.phase.isActive}>
                    <span class="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Active
                    </span>
                  </Show>
                  <Show when={props.phase.isOverdue}>
                    <span class="inline-flex px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      Overdue
                    </span>
                  </Show>
                  <Show when={props.phase.completionRate === 100}>
                    <span class="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Complete
                    </span>
                  </Show>
                </div>
                <p class="text-sm text-gray-600 font-light mb-1">
                  {props.phase.description}
                </p>
                <p class="text-xs text-gray-500">{props.phase.timeframe}</p>
              </div>

              <div class="flex items-center justify-between sm:justify-end sm:space-x-6">
                <div class="text-left sm:text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {pluralize(props.phase.tasks.length, "task")}
                  </div>
                  <div class="text-xs text-gray-500 font-light">
                    {props.phase.completionRate}% complete
                  </div>
                </div>
                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    class={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                      props.isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            class={`h-2 rounded-full transition-all duration-1000 ${getProgressBarColor(
              props.phase.completionRate
            )}`}
            style={`width: ${props.phase.completionRate}%`}
          ></div>
        </div>
      </div>

      {/* Expanded Content */}
      <Show when={props.isExpanded}>
        <div class="border-t border-gray-100 bg-gray-50/50">
          <Show
            when={props.phase.tasks.length > 0}
            fallback={
              <div class="p-8 sm:p-12 text-center">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5 0h6a2 2 0 002-2V7a2 2 0 00-2-2h-6m1-5v4m0 0v4m0-4h4m-4 0H9m0 0v4"
                    />
                  </svg>
                </div>
                <h4 class="text-lg font-medium text-gray-900 mb-2">
                  No tasks in this phase
                </h4>
                <p class="text-gray-600 font-light">
                  Add tasks to get started with this planning phase
                </p>
              </div>
            }
          >
            <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <For each={props.phase.tasks}>
                {(todo) => (
                  <TimelineTodoItem
                    todo={todo}
                    onToggle={props.onToggleTodo}
                    onDelete={props.onDeleteTodo}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default PlanningPhase;

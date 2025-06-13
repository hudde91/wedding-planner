import { Component, For, Show, createSignal } from "solid-js";
import { TimelinePhase } from "../../api/TimelineService";
import { TodoItem } from "../../types";

interface TimelinePhaseDetailProps {
  phase: TimelinePhase;
  todos: TodoItem[];
  monthsUntilWedding: number;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const TimelinePhaseDetail: Component<TimelinePhaseDetailProps> = (props) => {
  const [expanded, setExpanded] = createSignal(false);

  const getPhaseStatus = () => {
    if (props.monthsUntilWedding > props.phase.startMonths) return "upcoming";
    if (props.monthsUntilWedding >= props.phase.endMonths) return "current";
    if (props.monthsUntilWedding >= 0) return "past";
    return "overdue";
  };

  const getProgressPercentage = () => {
    if (props.todos.length === 0) return 0;
    const completed = props.todos.filter((todo) => todo.completed).length;
    return Math.round((completed / props.todos.length) * 100);
  };

  const getStatusBadge = () => {
    const status = getPhaseStatus();
    const badges = {
      upcoming: "bg-gray-100 text-gray-600 border-gray-300",
      current:
        "bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-200 shadow-sm",
      past: "bg-green-100 text-green-700 border-green-300",
      overdue: "bg-red-100 text-red-700 border-red-300 ring-2 ring-red-200",
    };
    return badges[status];
  };

  const toggleExpanded = () => {
    setExpanded(!expanded());
  };

  const handleToggleTodo = (todoId: number, e: Event) => {
    e.stopPropagation();
    props.onToggleTodo(todoId);
  };

  const handleDeleteTodo = (todoId: number, e: MouseEvent) => {
    e.stopPropagation();
    props.onDeleteTodo(todoId);
  };

  return (
    <div
      class={`group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl border shadow-lg hover:shadow-xl transition-all duration-500 ${getStatusBadge()}`}
    >
      {/* Background gradient overlay */}
      <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Phase Header - Clickable to expand/collapse */}
      <div
        class="relative z-10 p-6 cursor-pointer hover:bg-black/5 transition-colors select-none"
        onClick={toggleExpanded}
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl">{props.phase.icon}</span>
            </div>
            <div>
              <h3 class="text-xl font-medium flex items-center space-x-3 mb-1">
                <span>{props.phase.name}</span>
                <div class="flex items-center">
                  {getPhaseStatus() === "current" && (
                    <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                  {getPhaseStatus() === "overdue" && (
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  {getPhaseStatus() === "past" && (
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                  {getPhaseStatus() === "upcoming" && (
                    <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <Show when={getPhaseStatus() === "current"}>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium flex items-center">
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Current Phase
                  </span>
                </Show>
                <Show when={getPhaseStatus() === "overdue"}>
                  <span class="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium flex items-center">
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <polygon points="4,0 8,8 0,8" />
                    </svg>
                    Overdue
                  </span>
                </Show>
              </h3>
              <p class="text-sm text-gray-600 font-light">
                {props.phase.description}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">
                {props.todos.length} tasks
              </div>
              <div class="text-xs text-gray-500 font-light">
                {getProgressPercentage()}% complete
              </div>
            </div>
            {/* Expand/Collapse Icon */}
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
              <svg
                class={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                  expanded() ? "rotate-180" : ""
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
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div class="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div
            class="bg-gradient-to-r from-indigo-400 to-purple-400 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
            style={`width: ${getProgressPercentage()}%`}
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <Show when={expanded()}>
        <div class="border-t border-gray-100/80 bg-gradient-to-br from-gray-50/30 to-white/60 backdrop-blur-sm">
          <Show
            when={props.todos.length > 0}
            fallback={
              <div class="p-12 text-center">
                <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    class="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h4 class="text-lg font-medium text-gray-900 mb-2">
                  No tasks in this phase yet
                </h4>
                <p class="text-gray-600 font-light">
                  Add tasks or get suggestions to populate this phase!
                </p>
              </div>
            }
          >
            <div class="p-6 space-y-4">
              <For each={props.todos}>
                {(todo, index) => (
                  <div
                    class="group/todo bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300"
                    style={`animation-delay: ${index() * 50}ms`}
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4 flex-1">
                        <div class="relative">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={(e) => handleToggleTodo(todo.id, e)}
                            class="sr-only"
                          />
                          <div
                            class={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                              todo.completed
                                ? "bg-gradient-to-r from-emerald-400 to-green-400 border-emerald-400"
                                : "border-gray-300 hover:border-emerald-400 bg-white"
                            }`}
                            onClick={(e) => handleToggleTodo(todo.id, e)}
                          >
                            {todo.completed && (
                              <svg
                                class="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div class="flex-1">
                          <span
                            class={`font-medium transition-all duration-300 ${
                              todo.completed
                                ? "line-through text-gray-500"
                                : "text-gray-800"
                            }`}
                          >
                            {todo.text}
                          </span>

                          {/* Additional info */}
                          <Show when={todo.cost || todo.vendor_name}>
                            <div class="flex items-center space-x-2 mt-2">
                              <Show when={todo.vendor_name}>
                                <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                                  <svg
                                    class="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  {todo.vendor_name}
                                </span>
                              </Show>
                              <Show when={todo.cost}>
                                <span class="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                                  <svg
                                    class="w-3 h-3 mr-1"
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
                                  ${todo.cost}
                                </span>
                              </Show>
                            </div>
                          </Show>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div class="flex items-center space-x-2 opacity-0 group-hover/todo:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => handleDeleteTodo(todo.id, e)}
                          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300"
                          title="Delete task"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* Phase Tips */}
          <Show when={props.phase.tips && props.phase.tips.length > 0}>
            <div class="border-t border-gray-100/80 p-6 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
              <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                Phase Tips
              </h4>
              <div class="space-y-3">
                <For each={props.phase.tips}>
                  {(tip) => (
                    <div class="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                      <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span class="text-sm text-gray-700 font-light leading-relaxed">
                        {tip}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default TimelinePhaseDetail;

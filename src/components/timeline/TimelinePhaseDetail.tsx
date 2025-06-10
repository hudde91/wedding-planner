import { Component, For, Show, createSignal } from "solid-js";
import { TimelinePhase } from "../../api/TimelineService";
import { TodoItem } from "../../types";

interface TimelinePhaseDetailProps {
  phase: TimelinePhase;
  todos: TodoItem[];
  monthsUntilWedding: number;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onEditTodo: (todo: TodoItem) => void;
}

const TimelinePhaseDetail: Component<TimelinePhaseDetailProps> = (props) => {
  // ✅ Each component instance has its own expanded state
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

  const getStatusIcon = () => {
    const status = getPhaseStatus();
    return {
      upcoming: "⏳",
      current: "🎯",
      past: "✅",
      overdue: "⚠️",
    }[status];
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

  // ✅ Simplified click handler - just toggle, no event handling needed for simple clicks
  const toggleExpanded = () => {
    console.log(
      `Toggling ${props.phase.name}: ${expanded()} -> ${!expanded()}`
    ); // Debug log
    setExpanded(!expanded());
  };

  // ✅ Event handlers for todo actions
  const handleToggleTodo = (todoId: number, e: Event) => {
    e.stopPropagation(); // Prevent triggering the expand
    props.onToggleTodo(todoId);
  };

  const handleDeleteTodo = (todoId: number, e: MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the expand
    props.onDeleteTodo(todoId);
  };

  const handleEditTodo = (todo: TodoItem, e: MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the expand
    props.onEditTodo(todo);
  };

  return (
    <div
      class={`${
        props.phase.color
      } border rounded-lg overflow-hidden transition-all duration-200 ${getStatusBadge()}`}
    >
      {/* Phase Header - Clickable to expand/collapse */}
      <div
        class="p-4 cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors select-none"
        onClick={toggleExpanded}
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">{props.phase.icon}</span>
            <div>
              <h3 class="font-semibold text-lg flex items-center space-x-2">
                <span>{props.phase.name}</span>
                <span class="text-lg">{getStatusIcon()}</span>
                <Show when={getPhaseStatus() === "current"}>
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    🎯 Current Phase
                  </span>
                </Show>
                <Show when={getPhaseStatus() === "overdue"}>
                  <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                    ⚠️ Overdue
                  </span>
                </Show>
              </h3>
              <p class="text-sm opacity-75">{props.phase.description}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="text-sm font-medium">{props.todos.length} tasks</div>
              <div class="text-xs opacity-75">
                {getProgressPercentage()}% complete
              </div>
            </div>
            {/* Expand/Collapse Icon */}
            <svg
              class={`w-5 h-5 transition-transform duration-200 ${
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

        {/* Progress Bar */}
        <div class="w-full bg-white bg-opacity-50 rounded-full h-2 mt-3">
          <div
            class="bg-current h-2 rounded-full transition-all duration-300"
            style={`width: ${getProgressPercentage()}%; opacity: 0.8;`}
          ></div>
        </div>
      </div>

      {/* Expanded Content */}
      <Show when={expanded()}>
        <div class="border-t border-white border-opacity-30 bg-white bg-opacity-10">
          <Show
            when={props.todos.length > 0}
            fallback={
              <div class="p-6 text-center text-sm opacity-75">
                <div class="text-3xl mb-2">📝</div>
                <p>No tasks in this phase yet.</p>
                <p>Add tasks or get suggestions to populate this phase!</p>
              </div>
            }
          >
            <div class="p-4 space-y-3">
              <For each={props.todos}>
                {(todo) => (
                  <div class="bg-white bg-opacity-80 rounded-lg p-3 flex items-center justify-between group hover:bg-opacity-90 transition-colors">
                    <div class="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => handleToggleTodo(todo.id, e)}
                        class="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span
                        class={`flex-1 ${
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>

                      {/* Show additional info if available */}
                      <Show when={todo.cost || todo.vendor_name}>
                        <div class="flex items-center space-x-2 text-xs">
                          <Show when={todo.vendor_name}>
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              👤 {todo.vendor_name}
                            </span>
                          </Show>
                          <Show when={todo.cost}>
                            <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              💰 ${todo.cost}
                            </span>
                          </Show>
                        </div>
                      </Show>
                    </div>

                    {/* Action buttons */}
                    <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditTodo(todo, e)}
                        class="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit task"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteTodo(todo.id, e)}
                        class="text-red-600 hover:text-red-800 p-1 rounded"
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
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* Phase Tips */}
          <Show when={props.phase.tips && props.phase.tips.length > 0}>
            <div class="border-t border-white border-opacity-30 p-4">
              <h4 class="font-semibold mb-2 text-sm">💡 Phase Tips:</h4>
              <div class="space-y-1 text-sm opacity-90">
                <For each={props.phase.tips}>
                  {(tip) => (
                    <div class="flex items-start space-x-2">
                      <span class="text-yellow-400 mt-0.5 text-xs">⭐</span>
                      <span class="text-xs leading-relaxed">{tip}</span>
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

import { Component, Show } from "solid-js";
import { TodoItem } from "../../types";
import { formatCurrency } from "../../utils/currency";

interface TimelineTodoItemProps {
  todo: TodoItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TimelineTodoItem: Component<TimelineTodoItemProps> = (props) => {
  return (
    <div class="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 flex-1">
          <div class="relative">
            <input
              type="checkbox"
              checked={props.todo.completed}
              onChange={() => props.onToggle(props.todo.id)}
              class="sr-only"
            />
            <div
              class={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                props.todo.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 hover:border-green-400 bg-white"
              }`}
              onClick={() => props.onToggle(props.todo.id)}
            >
              {props.todo.completed && (
                <svg
                  class="w-3 h-3 text-white"
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
                props.todo.completed
                  ? "line-through text-gray-500"
                  : "text-gray-800"
              }`}
            >
              {props.todo.text}
            </span>
            <Show when={props.todo.cost || props.todo.vendor_name}>
              <div class="flex items-center space-x-2 mt-1">
                <Show when={props.todo.vendor_name}>
                  <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {props.todo.vendor_name}
                  </span>
                </Show>
                <Show when={props.todo.cost}>
                  <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {formatCurrency(props.todo.cost ?? 0)}
                  </span>
                </Show>
              </div>
            </Show>
          </div>
        </div>
        <button
          onClick={() => props.onDelete(props.todo.id)}
          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
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
  );
};

export default TimelineTodoItem;

import { Component, Show } from "solid-js";
import { TodoItem as TodoItemType } from "../../types";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (todo: TodoItemType) => void;
}

const TodoItem: Component<TodoItemProps> = (props) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTodoCostDisplay = (todo: TodoItemType): string => {
    if (typeof todo.cost === "number" && todo.cost > 0) {
      return formatCurrency(todo.cost);
    }
    return "";
  };

  return (
    <div class="group bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
      <div
        // TODO: onClick on the checkbox should not trigger the item click
        onClick={() => props.onClick(props.todo)}
        class="flex items-center justify-between p-4 cursor-pointer"
      >
        <div class="flex items-center space-x-3 flex-1">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={props.todo.completed}
              onChange={(e) => {
                e.stopPropagation();
                props.onToggle(props.todo.id);
              }}
              class="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </div>
          <div class="flex-1">
            <span
              class={`text-gray-800 font-medium ${
                props.todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {props.todo.text}
            </span>
            <Show when={props.todo.vendor_name || props.todo.cost}>
              <div class="text-sm text-gray-600 mt-1">
                <Show when={props.todo.vendor_name}>
                  <span class="inline-flex items-center mr-3">
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
                      ></path>
                    </svg>
                    {props.todo.vendor_name}
                  </span>
                </Show>
                <Show when={props.todo.cost}>
                  <span class="inline-flex items-center text-green-600 font-medium">
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
                      ></path>
                    </svg>
                    {getTodoCostDisplay(props.todo)}
                  </span>
                </Show>
              </div>
            </Show>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Show when={props.todo.completed && props.todo.completion_date}>
            <span class="text-xs text-gray-500">
              {new Date(props.todo.completion_date!).toLocaleDateString()}
            </span>
          </Show>
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete(props.todo.id);
            }}
            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded transition-all duration-200"
            title="Delete task"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <div class="text-gray-400">
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
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;

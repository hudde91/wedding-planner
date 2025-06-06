// 1. Updated TodoItem.tsx - Add expansion state and details view
import { Component, Show, createSignal, createEffect } from "solid-js";
import { TodoItem as TodoItemType, TodoFormData } from "../../types";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isExpanded: boolean;
  onToggleExpanded: (id: number) => void;
  onUpdateDetails: (id: number, todoData: TodoFormData) => void;
}

const TodoItem: Component<TodoItemProps> = (props) => {
  const [todoFormData, setTodoFormData] = createSignal<TodoFormData>({
    cost: props.todo.cost,
    vendor_name: props.todo.vendor_name || "",
    vendor_contact: props.todo.vendor_contact || "",
    vendor_email: props.todo.vendor_email || "",
    vendor_phone: props.todo.vendor_phone || "",
    notes: props.todo.notes || "",
  });

  // Auto-save effect with debouncing
  let saveTimeout: ReturnType<typeof setTimeout>;
  createEffect(() => {
    const currentData = todoFormData();

    // Only auto-save if expanded and data has actually changed from initial state
    if (props.isExpanded) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      saveTimeout = setTimeout(() => {
        props.onUpdateDetails(props.todo.id, currentData);
      }, 500);
    }
  });

  // Update form data when todo changes
  createEffect(() => {
    setTodoFormData({
      cost: props.todo.cost,
      vendor_name: props.todo.vendor_name || "",
      vendor_contact: props.todo.vendor_contact || "",
      vendor_email: props.todo.vendor_email || "",
      vendor_phone: props.todo.vendor_phone || "",
      notes: props.todo.notes || "",
    });
  });

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

  const updateFormField = <K extends keyof TodoFormData>(
    field: K,
    value: TodoFormData[K]
  ): void => {
    setTodoFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div class="group bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-3 flex-1">
          <div
            class="flex items-center space-x-2"
            onClick={(e) => e.stopPropagation()}
          >
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
          <div
            class="flex-1 cursor-pointer"
            onClick={() => props.onToggleExpanded(props.todo.id)}
          >
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

          {/* Expand/Collapse Indicator */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.onToggleExpanded(props.todo.id);
            }}
            class="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            title={props.isExpanded ? "Collapse details" : "Expand details"}
          >
            <svg
              class={`w-4 h-4 transition-transform duration-200 ${
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
              ></path>
            </svg>
          </button>

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
        </div>
      </div>

      {/* Expandable Details Section */}
      <Show when={props.isExpanded}>
        <div class="border-t border-gray-200 p-4 bg-gray-50">
          <div class="space-y-6">
            {/* Vendor Section */}
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 class="text-lg font-medium text-blue-800 mb-3">
                👤 Vendor Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={todoFormData().vendor_name || ""}
                    onInput={(e) =>
                      updateFormField(
                        "vendor_name",
                        (e.target as HTMLInputElement).value
                      )
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Vendor name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={todoFormData().vendor_phone || ""}
                    onInput={(e) =>
                      updateFormField(
                        "vendor_phone",
                        (e.target as HTMLInputElement).value
                      )
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={todoFormData().vendor_email || ""}
                    onInput={(e) =>
                      updateFormField(
                        "vendor_email",
                        (e.target as HTMLInputElement).value
                      )
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="vendor@example.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={todoFormData().vendor_contact || ""}
                    onInput={(e) =>
                      updateFormField(
                        "vendor_contact",
                        (e.target as HTMLInputElement).value
                      )
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact person name"
                  />
                </div>
              </div>
            </div>

            {/* Cost Section */}
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 class="text-lg font-medium text-green-800 mb-3">
                💰 Cost Information
              </h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Total Cost
                </label>
                <input
                  type="number"
                  min="0"
                  value={todoFormData().cost || ""}
                  onInput={(e) =>
                    updateFormField(
                      "cost",
                      parseFloat((e.target as HTMLInputElement).value) ||
                        undefined
                    )
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Notes Section */}
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 class="text-lg font-medium text-purple-800 mb-3">
                📝 Additional Notes
              </h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Notes & Details
                </label>
                <textarea
                  value={todoFormData().notes || ""}
                  onInput={(e) =>
                    updateFormField(
                      "notes",
                      (e.target as HTMLTextAreaElement).value
                    )
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Any additional details, preferences, or important information..."
                ></textarea>
              </div>
            </div>

            {/* Auto-save indicator */}
            <div class="text-center text-xs text-gray-500">
              <span class="inline-flex items-center">
                <svg
                  class="w-3 h-3 mr-1 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Changes saved automatically
              </span>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default TodoItem;

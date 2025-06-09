// Fixed TodoItem.tsx - Smart auto-save that doesn't interfere with modal
import {
  Component,
  Show,
  createSignal,
  createEffect,
  onCleanup,
} from "solid-js";
import { TodoItem as TodoItemType, TodoFormData } from "../../types";
import PinterestInspirations from "./PinterestInspirations";
import type { PinterestPin } from "../../types";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isExpanded: boolean;
  onToggleExpanded: (id: number) => void;
  onUpdateDetails: (id: number, todoData: TodoFormData) => void;
}

const TodoItem: Component<TodoItemProps> = (props) => {
  // Initialize form data from props
  const [todoFormData, setTodoFormData] = createSignal<TodoFormData>({
    cost: props.todo.cost,
    vendor_name: props.todo.vendor_name || "",
    vendor_contact: props.todo.vendor_contact || "",
    vendor_email: props.todo.vendor_email || "",
    vendor_phone: props.todo.vendor_phone || "",
    notes: props.todo.notes || "",
  });

  const [showInspirations, setShowInspirations] = createSignal(false);

  // Track if we've made any changes since last save
  const [hasUnsavedChanges, setHasUnsavedChanges] = createSignal(false);

  // Track initial form data to compare against
  const [initialFormData, setInitialFormData] = createSignal<TodoFormData>({
    cost: props.todo.cost,
    vendor_name: props.todo.vendor_name || "",
    vendor_contact: props.todo.vendor_contact || "",
    vendor_email: props.todo.vendor_email || "",
    vendor_phone: props.todo.vendor_phone || "",
    notes: props.todo.notes || "",
  });

  let saveTimeoutRef: ReturnType<typeof setTimeout> | undefined;

  // FIX: Only update form data when the actual todo props change from outside
  createEffect(() => {
    const currentTodo = props.todo;
    const newFormData = {
      cost: currentTodo.cost,
      vendor_name: currentTodo.vendor_name || "",
      vendor_contact: currentTodo.vendor_contact || "",
      vendor_email: currentTodo.vendor_email || "",
      vendor_phone: currentTodo.vendor_phone || "",
      notes: currentTodo.notes || "",
    };

    setTodoFormData(newFormData);
    setInitialFormData(newFormData);
    setHasUnsavedChanges(false);
  });

  // FIX: Smart auto-save that only triggers on actual user changes
  createEffect(() => {
    const currentData = todoFormData();
    const initial = initialFormData();
    const isExpanded = props.isExpanded;

    // Check if data has actually changed from initial state
    const hasChanged = JSON.stringify(currentData) !== JSON.stringify(initial);

    // Only auto-save if:
    // 1. Component is expanded
    // 2. Data has actually changed from initial state
    // 3. We have unsaved changes (user initiated)
    if (isExpanded && hasChanged && hasUnsavedChanges()) {
      // Clear previous timeout
      if (saveTimeoutRef) {
        clearTimeout(saveTimeoutRef);
      }

      // Set new timeout
      saveTimeoutRef = setTimeout(() => {
        try {
          props.onUpdateDetails(props.todo.id, currentData);
          setHasUnsavedChanges(false);
          setInitialFormData(currentData); // Update baseline
        } catch (error) {
          console.error("Error saving todo details:", error);
        }
      }, 1500); // Longer debounce for safety
    }
  });

  // Cleanup timeout on component unmount
  onCleanup(() => {
    if (saveTimeoutRef) {
      clearTimeout(saveTimeoutRef);
    }
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

  // FIX: Update form field and mark as having unsaved changes
  const updateFormField = <K extends keyof TodoFormData>(
    field: K,
    value: TodoFormData[K]
  ): void => {
    setTodoFormData((prev) => {
      if (prev[field] === value) {
        return prev; // No change, no update
      }

      // Mark as having unsaved changes (user initiated change)
      setHasUnsavedChanges(true);

      return { ...prev, [field]: value };
    });
  };

  // FIX: Stable event handlers
  const handleGetInspiration = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    setShowInspirations(true);
  };

  const handleCloseInspirations = (): void => {
    setShowInspirations(false);
  };

  const handleInspirationSelect = (pin: PinterestPin): void => {
    // Add selected inspiration to notes
    const currentNotes = todoFormData().notes || "";
    const inspirationNote = `\n\n💡 Inspiration: ${pin.title}\n${pin.description}\nSaved from: ${pin.link}`;
    const updatedNotes = currentNotes + inspirationNote;

    updateFormField("notes", updatedNotes);
    setShowInspirations(false);
  };

  const handleToggleExpanded = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    props.onToggleExpanded(props.todo.id);
  };

  const handleToggleComplete = (e: Event): void => {
    e.stopPropagation();
    props.onToggle(props.todo.id);
  };

  const handleDelete = (e: MouseEvent): void => {
    e.stopPropagation();
    props.onDelete(props.todo.id);
  };

  return (
    <>
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
                onChange={handleToggleComplete}
                class="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </div>
            <div class="flex-1 cursor-pointer" onClick={handleToggleExpanded}>
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
              type="button"
              onClick={handleToggleExpanded}
              class="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors focus:outline-none"
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
              type="button"
              onClick={handleDelete}
              class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded transition-all duration-200 focus:outline-none"
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
              {/* Pinterest Inspiration Button */}
              <div class="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-lg font-medium text-pink-800 mb-1">
                      💡 Get Inspiration
                    </h4>
                    <p class="text-sm text-pink-600">
                      Find ideas and inspiration for "{props.todo.text}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetInspiration}
                    class="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.996.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                    <span>Browse Ideas</span>
                  </button>
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
                    rows="4"
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
                  <Show when={hasUnsavedChanges()}>
                    <span class="ml-1 text-orange-500">• Saving...</span>
                  </Show>
                </span>
              </div>
            </div>
          </div>
        </Show>
      </div>

      {/* Pinterest Inspirations Modal */}
      <Show when={showInspirations()}>
        <PinterestInspirations
          searchQuery={props.todo.text}
          onClose={handleCloseInspirations}
          onSelectInspiration={handleInspirationSelect}
        />
      </Show>
    </>
  );
};

export default TodoItem;

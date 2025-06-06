import { createSignal, Component, createEffect } from "solid-js";
import { TodoItem, TodoFormData } from "../../types";

interface TodoDetailsModalProps {
  todo: TodoItem;
  onSubmit: (todoData: TodoFormData) => void;
  onCancel: () => void;
}

const TodoDetailsModal: Component<TodoDetailsModalProps> = (props) => {
  const [todoFormData, setTodoFormData] = createSignal<TodoFormData>({
    cost: props.todo.cost,
    vendor_name: props.todo.vendor_name || "",
    vendor_contact: props.todo.vendor_contact || "",
    vendor_email: props.todo.vendor_email || "",
    vendor_phone: props.todo.vendor_phone || "",
    notes: props.todo.notes || "",
  });

  // Auto-save effect - debounced to avoid too many saves
  let saveTimeout: ReturnType<typeof setTimeout>;
  createEffect(() => {
    const currentData = todoFormData();

    // Clear previous timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout for auto-save (500ms debounce)
    saveTimeout = setTimeout(() => {
      props.onSubmit(currentData);
    }, 500);
  });

  const updateFormField = <K extends keyof TodoFormData>(
    field: K,
    value: TodoFormData[K]
  ): void => {
    setTodoFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900">
              Task Details: {props.todo.text}
            </h3>
            <button
              onClick={props.onCancel}
              class="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="space-y-6">
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
            <div class="text-center text-sm text-gray-500">
              <span class="inline-flex items-center">
                <svg
                  class="w-4 h-4 mr-1 text-green-500"
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
      </div>
    </div>
  );
};

export default TodoDetailsModal;

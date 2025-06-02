import { createSignal, Component, For, Show } from "solid-js";
import { TodoItem, TodoFormData } from "../types";

interface TodoListProps {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, todoData: TodoFormData) => void;
}

const TodoList: Component<TodoListProps> = (props) => {
  const [newTodoText, setNewTodoText] = createSignal("");
  const [editingTodo, setEditingTodo] = createSignal<TodoItem | null>(null);
  const [showDetailsForm, setShowDetailsForm] = createSignal(false);
  const [todoFormData, setTodoFormData] = createSignal<TodoFormData>({
    cost: undefined,
    vendor_name: "",
    vendor_contact: "",
    vendor_email: "",
    vendor_phone: "",
    notes: "",
  });

  const handleAddTodo = (e: Event): void => {
    e.preventDefault();
    const text = newTodoText().trim();
    if (text) {
      props.addTodo(text);
      setNewTodoText("");
    }
  };

  const handleTodoClick = (todo: TodoItem): void => {
    setEditingTodo(todo);
    setTodoFormData({
      cost: todo.cost,
      vendor_name: todo.vendor_name || "",
      vendor_contact: todo.vendor_contact || "",
      vendor_email: todo.vendor_email || "",
      vendor_phone: todo.vendor_phone || "",
      notes: todo.notes || "",
    });
    setShowDetailsForm(true);
  };

  const handleDetailsSubmit = (e: Event): void => {
    e.preventDefault();
    const todo = editingTodo();
    if (!todo) return;

    const formData = todoFormData();
    props.updateTodo(todo.id, formData);

    // If todo wasn't completed and has cost info, mark as completed
    if (
      !todo.completed &&
      (formData.cost || formData.vendor_name || formData.notes)
    ) {
      props.toggleTodo(todo.id);
    }

    resetForm();
  };

  const resetForm = (): void => {
    setEditingTodo(null);
    setShowDetailsForm(false);
    setTodoFormData({
      cost: undefined,
      vendor_name: "",
      vendor_contact: "",
      vendor_email: "",
      vendor_phone: "",
      notes: "",
    });
  };

  const updateFormField = <K extends keyof TodoFormData>(
    field: K,
    value: TodoFormData[K]
  ): void => {
    setTodoFormData((prev) => ({ ...prev, [field]: value }));
  };

  const completedCount = (): number =>
    props.todos.filter((todo) => todo.completed).length;
  const totalCount = (): number => props.todos.length;

  const totalSpent = (): number =>
    props.todos.reduce((sum, todo) => sum + (todo.cost || 0), 0);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTodoCostDisplay = (todo: TodoItem): string => {
    if (todo.cost) return formatCurrency(todo.cost);
    return "";
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Wedding Checklist</h2>
        <div class="text-right">
          <div class="text-sm text-gray-600">Total Spent</div>
          <div class="text-lg font-bold text-purple-600">
            {formatCurrency(totalSpent())}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">
            Planning Progress
          </span>
          <span class="text-sm text-gray-600">
            {completedCount()} / {totalCount()} completed
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={`width: ${
              totalCount() > 0 ? (completedCount() / totalCount()) * 100 : 0
            }%`}
          ></div>
        </div>
        <div class="mt-2 text-xs text-gray-600">
          Click on any task to add vendor details, costs, and notes
        </div>
      </div>

      {/* Add New Todo */}
      <form onSubmit={handleAddTodo} class="flex mb-6">
        <input
          type="text"
          value={newTodoText()}
          onInput={(e) => setNewTodoText((e.target as HTMLInputElement).value)}
          placeholder="Add a new wedding task..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          class="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition duration-200"
        >
          Add Task
        </button>
      </form>

      {/* Todo List */}
      <div class="space-y-3">
        <For each={props.todos}>
          {(todo) => (
            <div class="group bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
              <div
                onClick={() => handleTodoClick(todo)}
                class="flex items-center justify-between p-4 cursor-pointer"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <div class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => {
                        e.stopPropagation();
                        props.toggleTodo(todo.id);
                      }}
                      class="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </div>
                  <div class="flex-1">
                    <span
                      class={`text-gray-800 font-medium ${
                        todo.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                    {/* Vendor info preview */}
                    <Show when={todo.vendor_name || todo.cost}>
                      <div class="text-sm text-gray-600 mt-1">
                        <Show when={todo.vendor_name}>
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
                            {todo.vendor_name}
                          </span>
                        </Show>
                        <Show when={todo.cost}>
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
                            {getTodoCostDisplay(todo)}
                          </span>
                        </Show>
                      </div>
                    </Show>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Show when={todo.completed && todo.completion_date}>
                    <span class="text-xs text-gray-500">
                      {new Date(todo.completion_date!).toLocaleDateString()}
                    </span>
                  </Show>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      props.deleteTodo(todo.id);
                    }}
                    class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded transition-all duration-200"
                    title="Delete task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
          )}
        </For>
      </div>

      {/* No todos state */}
      <Show when={props.todos.length === 0}>
        <div class="text-center py-12 text-gray-500">
          <div class="text-4xl mb-4">📋</div>
          <p class="text-lg font-medium mb-2">No tasks added yet</p>
          <p>Add your first wedding planning task above!</p>
        </div>
      </Show>

      {/* Todo Details Modal */}
      <Show when={showDetailsForm() && editingTodo()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-gray-900">
                  Task Details: {editingTodo()!.text}
                </h3>
                <button
                  onClick={resetForm}
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

              <form onSubmit={handleDetailsSubmit} class="space-y-6">
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
                      step="0.01"
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
                      placeholder="0.00"
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
                        Vendor/Company Name
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
                        placeholder="e.g., Elegant Flowers Co."
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
                        placeholder="e.g., Sarah Johnson"
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
                        placeholder="vendor@email.com"
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

                {/* Action Buttons */}
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default TodoList;

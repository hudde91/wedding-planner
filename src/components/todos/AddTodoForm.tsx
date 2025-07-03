import { createSignal, Component, createMemo } from "solid-js";
import { TodoItem } from "../../types";

interface AddTodoFormProps {
  onAdd: (text: string) => void;
  todos: TodoItem[];
}

const AddTodoForm: Component<AddTodoFormProps> = (props) => {
  const [newTodoText, setNewTodoText] = createSignal("");
  const [isFocused, setIsFocused] = createSignal(false);

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const text = newTodoText().trim();
    if (text) {
      props.onAdd(text);
      setNewTodoText("");
    }
  };

  const commonTasks = [
    "Book wedding venue",
    "Hire wedding photographer",
    "Order wedding dress",
    "Choose wedding flowers",
    "Book wedding caterer",
    "Send wedding invitations",
    "Plan honeymoon",
    "Buy wedding rings",
  ];

  // Filter out tasks that already exist in the wedding plan
  const availableTasks = createMemo(() => {
    const existingTasksLower = props.todos.map((todo) =>
      todo.text.toLowerCase().trim()
    );
    return commonTasks.filter(
      (task) => !existingTasksLower.includes(task.toLowerCase().trim())
    );
  });

  const handleQuickAdd = (task: string) => {
    props.onAdd(task);
  };

  return (
    <div class="bg-white/80 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-lg">
      <div class="flex items-center space-x-3 mb-4 lg:mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-base lg:text-lg font-medium text-gray-900">
            Add New Task
          </h3>
          <p class="text-sm text-gray-500 font-light">
            Keep track of your wedding planning progress
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} class="space-y-4 lg:space-y-6">
        <div class="relative">
          <input
            type="text"
            value={newTodoText()}
            onInput={(e) =>
              setNewTodoText((e.target as HTMLInputElement).value)
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Add a new wedding planning task..."
            class={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white/80 backdrop-blur-sm border rounded-lg lg:rounded-xl focus:outline-none transition-all duration-300 font-light text-gray-800 placeholder:text-gray-400 pr-20 lg:pr-24 text-mobile-readable ${
              isFocused()
                ? "border-blue-300 ring-4 ring-blue-100/50 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
          <button
            type="submit"
            disabled={!newTodoText().trim()}
            class={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 lg:px-6 lg:py-2 rounded-md lg:rounded-lg font-medium transition-all duration-300 text-sm lg:text-base min-h-[44px] touch-manipulation ${
              newTodoText().trim()
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add
          </button>
        </div>

        <div class="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z" />
          </svg>
          <span class="font-light">
            Expand any task to add vendor details, costs, and inspiration!
          </span>
        </div>
      </form>

      {/* Quick Add Section */}
      {availableTasks().length > 0 && (
        <div class="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-100">
          <h4 class="text-sm font-medium text-gray-700 mb-3 lg:mb-4">
            Quick Add Common Tasks
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            {availableTasks().map((task) => (
              <button
                onClick={() => handleQuickAdd(task)}
                class="group p-3 lg:p-3 text-left bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 min-h-[60px] touch-manipulation"
              >
                <div class="flex items-start space-x-2">
                  <div class="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors duration-300 mt-2 flex-shrink-0"></div>
                  <span class="text-xs lg:text-sm text-gray-700 group-hover:text-blue-700 font-light leading-relaxed">
                    {task}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div class="mt-3 text-xs text-gray-500 font-light text-center">
            Click any suggestion to add it to your checklist
          </div>
        </div>
      )}

      {/* No More Suggestions Message */}
      {availableTasks().length === 0 && (
        <div class="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-100">
          <div class="text-center p-4 lg:p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-lg lg:rounded-xl border border-green-200/50">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6 text-white"
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
            </div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              All Common Tasks Added! 🎉
            </h4>
            <p class="text-xs text-gray-600 font-light">
              You've covered all the essential wedding planning tasks. Add any
              custom tasks above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTodoForm;

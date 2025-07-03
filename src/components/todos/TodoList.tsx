import {
  createSignal,
  Component,
  For,
  Show,
  createMemo,
  createEffect,
} from "solid-js";
import { TodoItem as TodoItemType, TodoFormData } from "../../types";
import TodoProgress from "./TodoProgress";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import { calculateTodoProgress } from "../../utils/progress";

interface TodoListProps {
  todos: TodoItemType[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, todoData: TodoFormData) => void;
}

const TodoList: Component<TodoListProps> = (props) => {
  const [expandedTodoId, setExpandedTodoId] = createSignal<number | null>(null);
  const [newlyAddedTodoId, setNewlyAddedTodoId] = createSignal<number | null>(
    null
  );

  // Track when a new todo is added and auto-expand it
  let previousTodoCount = props.todos.length;
  createEffect(() => {
    const currentTodos = props.todos;

    if (currentTodos.length > previousTodoCount && currentTodos.length > 0) {
      const newestTodo = currentTodos[0];
      setExpandedTodoId(newestTodo.id);
      setNewlyAddedTodoId(newestTodo.id);
      // Clear the newly added flag after a short delay
      setTimeout(() => setNewlyAddedTodoId(null), 1000);
    }
    previousTodoCount = currentTodos.length;
  });

  const progress = calculateTodoProgress(props.todos);
  const completedCount = () => progress.completed;
  const totalCount = () => progress.total;

  const totalSpent = createMemo(() =>
    props.todos.reduce((sum, todo) => sum + (todo.cost || 0), 0)
  );

  const handleToggleExpanded = (todoId: number): void => {
    setExpandedTodoId((prev) => (prev === todoId ? null : todoId));
  };

  const handleUpdateDetails = (id: number, todoData: TodoFormData): void => {
    // Simply update the todo details without auto-completion
    // Users should manually check the checkbox when they want to mark it as done
    props.updateTodo(id, todoData);
  };

  return (
    <div class="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header with Background */}
      <div class="animate-fade-in-up relative overflow-hidden rounded-lg lg:rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-teal-100 border border-emerald-200/50 shadow-lg lg:shadow-xl">
        <div class="absolute inset-0 opacity-5 lg:opacity-10">
          <img
            src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&h=400&fit=crop&auto=format"
            alt="Wedding planning"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 p-4 sm:p-6 lg:p-8">
          <div class="max-w-3xl">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 mb-2 lg:mb-4 tracking-wide">
              Planning Checklist
            </h1>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 font-light leading-relaxed">
              Stay organized with your wedding tasks. Track progress, manage
              vendors, and ensure nothing is forgotten for your perfect day.
            </p>
          </div>
        </div>

        <div class="absolute top-2 right-2 lg:top-4 lg:right-4 w-16 h-16 lg:w-32 lg:h-32 opacity-5">
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            class="text-emerald-300"
          >
            <path d="M20 30 L40 50 L80 10 M20 50 L40 70 L80 30 M20 70 L40 90 L80 50" />
          </svg>
        </div>
      </div>

      {/* Progress Section */}
      <div class="animate-fade-in-up-delay-200">
        <TodoProgress
          completedCount={completedCount()}
          totalCount={totalCount()}
          totalSpent={totalSpent()}
        />
      </div>

      {/* Add Todo Form */}
      <div class="animate-fade-in-up-delay-400">
        <AddTodoForm onAdd={props.addTodo} todos={props.todos} />
      </div>

      {/* Todo Items */}
      <div class="animate-fade-in-up-delay-600 space-y-3 lg:space-y-4">
        <For each={props.todos}>
          {(todo, index) => (
            <div
              class={`transition-all duration-500`}
              style={`animation-delay: ${index() * 100}ms`}
            >
              <TodoItem
                todo={todo}
                onToggle={props.toggleTodo}
                onDelete={props.deleteTodo}
                isExpanded={expandedTodoId() === todo.id}
                onToggleExpanded={handleToggleExpanded}
                onUpdateDetails={handleUpdateDetails}
                focusOnExpand={newlyAddedTodoId() === todo.id}
              />
            </div>
          )}
        </For>
      </div>

      <Show when={props.todos.length === 0}>
        <div class="animate-fade-in-up-delay-800 text-center py-12 lg:py-16">
          <div class="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-8 lg:p-12 border border-gray-100 shadow-lg max-w-md mx-auto">
            <div class="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <svg
                class="w-8 h-8 lg:w-12 lg:h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg lg:text-xl font-medium text-gray-900 mb-2">
              No tasks yet
            </h3>
            <p class="text-sm lg:text-base text-gray-600 font-light">
              Add your first wedding planning task above to get started!
            </p>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default TodoList;

import {
  createSignal,
  Component,
  For,
  Show,
  createMemo,
  onMount,
} from "solid-js";
import { TodoItem as TodoItemType, TodoFormData } from "../../types";
import TodoProgress from "./TodoProgress";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: TodoItemType[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, todoData: TodoFormData) => void;
}

const TodoList: Component<TodoListProps> = (props) => {
  const [expandedTodoId, setExpandedTodoId] = createSignal<number | null>(null);
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  const completedCount = createMemo(
    () => props.todos.filter((todo) => todo.completed).length
  );

  const totalCount = createMemo(() => props.todos.length);

  const totalSpent = createMemo(() =>
    props.todos.reduce((sum, todo) => sum + (todo.cost || 0), 0)
  );

  const handleToggleExpanded = (todoId: number): void => {
    setExpandedTodoId((prev) => (prev === todoId ? null : todoId));
  };

  const handleUpdateDetails = (id: number, todoData: TodoFormData): void => {
    const todo = props.todos.find((t) => t.id === id);
    if (!todo) return;

    props.updateTodo(id, todoData);

    if (
      !todo.completed &&
      (todoData.cost || todoData.vendor_name || todoData.notes)
    ) {
      props.toggleTodo(id);
    }
  };

  return (
    <div class="space-y-8">
      {/* Header with Background */}
      <div
        class={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-teal-100 border border-emerald-200/50 shadow-xl transition-all duration-1000 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&h=400&fit=crop&auto=format"
            alt="Wedding planning"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 p-8">
          <div class="max-w-3xl">
            <h1 class="text-4xl font-light text-gray-800 mb-4 tracking-wide">
              Planning Checklist
            </h1>
            <p class="text-lg text-gray-600 font-light leading-relaxed">
              Stay organized with your wedding tasks. Track progress, manage
              vendors, and ensure nothing is forgotten for your perfect day.
            </p>
          </div>
        </div>

        <div class="absolute top-4 right-4 w-32 h-32 opacity-5">
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
      <div
        class={`transition-all duration-1000 delay-200 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <TodoProgress
          completedCount={completedCount()}
          totalCount={totalCount()}
          totalSpent={totalSpent()}
        />
      </div>

      {/* Add Todo Form */}
      <div
        class={`transition-all duration-1000 delay-400 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <AddTodoForm onAdd={props.addTodo} todos={props.todos} />
      </div>

      {/* Todo Items */}
      <div
        class={`space-y-4 transition-all duration-1000 delay-600 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
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
              />
            </div>
          )}
        </For>
      </div>

      <Show when={props.todos.length === 0}>
        <div
          class={`text-center py-16 transition-all duration-1000 delay-800 ${
            isLoaded()
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-100 shadow-lg max-w-md mx-auto">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                class="w-12 h-12 text-gray-400"
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
            <h3 class="text-xl font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p class="text-gray-600 font-light">
              Add your first wedding planning task above to get started!
            </p>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default TodoList;

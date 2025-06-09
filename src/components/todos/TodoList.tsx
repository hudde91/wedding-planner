// Fixed TodoList.tsx - Complete file with proper TypeScript interfaces
import { createSignal, Component, For, Show, createMemo } from "solid-js";
import { TodoItem as TodoItemType, TodoFormData } from "../../types";
import TodoProgress from "./TodoProgress";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";

// Remove PinterestInspirations import since we moved it to TodoItem
// import PinterestInspirations from "./PinterestInspirations";

interface TodoListProps {
  todos: TodoItemType[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, todoData: TodoFormData) => void;
}

const TodoList: Component<TodoListProps> = (props) => {
  const [expandedTodoId, setExpandedTodoId] = createSignal<number | null>(null);

  // Make these reactive using createMemo
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

    // If todo wasn't completed and has cost info, mark as completed
    if (
      !todo.completed &&
      (todoData.cost || todoData.vendor_name || todoData.notes)
    ) {
      props.toggleTodo(id);
    }
  };

  return (
    <div class="space-y-6">
      <TodoProgress
        completedCount={completedCount()}
        totalCount={totalCount()}
        totalSpent={totalSpent()}
      />

      <AddTodoForm onAdd={props.addTodo} />

      <div class="space-y-3">
        <For each={props.todos}>
          {(todo) => (
            <TodoItem
              todo={todo}
              onToggle={props.toggleTodo}
              onDelete={props.deleteTodo}
              isExpanded={expandedTodoId() === todo.id}
              onToggleExpanded={handleToggleExpanded}
              onUpdateDetails={handleUpdateDetails}
            />
          )}
        </For>
      </div>

      <Show when={props.todos.length === 0}>
        <div class="text-center py-12 text-gray-500">
          <div class="text-4xl mb-4">📋</div>
          <p class="text-lg font-medium mb-2">No tasks added yet</p>
          <p>Add your first wedding planning task above!</p>
        </div>
      </Show>
    </div>
  );
};

export default TodoList;

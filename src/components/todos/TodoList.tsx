import { createSignal, Component, For, Show } from "solid-js";
import { TodoItem as TodoItemType, TodoFormData } from "../../types";
import TodoProgress from "./TodoProgress";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import TodoDetailsModal from "./TodoDetailsModal";

interface TodoListProps {
  todos: TodoItemType[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, todoData: TodoFormData) => void;
}

const TodoList: Component<TodoListProps> = (props) => {
  const [editingTodo, setEditingTodo] = createSignal<TodoItemType | null>(null);
  const [showDetailsForm, setShowDetailsForm] = createSignal(false);

  const completedCount = (): number =>
    props.todos.filter((todo) => todo.completed).length;

  const totalCount = (): number => props.todos.length;

  const totalSpent = (): number =>
    props.todos.reduce((sum, todo) => sum + (todo.cost || 0), 0);

  const handleTodoClick = (todo: TodoItemType): void => {
    setEditingTodo(todo);
    setShowDetailsForm(true);
  };

  const handleDetailsSubmit = (todoData: TodoFormData): void => {
    const todo = editingTodo();
    if (!todo) return;

    props.updateTodo(todo.id, todoData);

    // If todo wasn't completed and has cost info, mark as completed
    if (
      !todo.completed &&
      (todoData.cost || todoData.vendor_name || todoData.notes)
    ) {
      props.toggleTodo(todo.id);
    }

    resetForm();
  };

  const resetForm = (): void => {
    setEditingTodo(null);
    setShowDetailsForm(false);
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
              onClick={handleTodoClick}
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

      <Show when={showDetailsForm() && editingTodo()}>
        <TodoDetailsModal
          todo={editingTodo()!}
          onSubmit={handleDetailsSubmit}
          onCancel={resetForm}
        />
      </Show>
    </div>
  );
};

export default TodoList;

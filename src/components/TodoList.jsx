import { createSignal } from "solid-js";

function TodoList(props) {
  const [newTodoText, setNewTodoText] = createSignal("");

  const handleAddTodo = (e) => {
    e.preventDefault();
    const text = newTodoText().trim();
    if (text) {
      props.addTodo(text);
      setNewTodoText("");
    }
  };

  const completedCount = () =>
    props.todos.filter((todo) => todo.completed).length;
  const totalCount = () => props.todos.length;

  return (
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        Wedding Checklist
      </h2>

      <form onSubmit={handleAddTodo} class="flex mb-6">
        <input
          type="text"
          value={newTodoText()}
          onInput={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          class="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition duration-200"
        >
          Add
        </button>
      </form>

      <div class="space-y-2">
        {props.todos.map((todo) => (
          <div
            key={todo.id}
            class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <div class="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => props.toggleTodo(todo.id)}
                class="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span
                class={`text-gray-800 ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => props.deleteTodo(todo.id)}
              class="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
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
        ))}
      </div>

      <div class="mt-4 text-gray-600 text-sm">
        <p>
          {completedCount()} of {totalCount()} tasks completed
        </p>
      </div>
    </div>
  );
}

export default TodoList;

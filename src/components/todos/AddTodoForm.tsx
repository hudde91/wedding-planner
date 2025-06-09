// Fixed AddTodoForm.tsx - Clean version without Pinterest integration
import { createSignal, Component } from "solid-js";

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

const AddTodoForm: Component<AddTodoFormProps> = (props) => {
  const [newTodoText, setNewTodoText] = createSignal("");

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const text = newTodoText().trim();
    if (text) {
      props.onAdd(text);
      setNewTodoText("");
    }
  };

  return (
    <div class="space-y-3">
      <form onSubmit={handleSubmit} class="flex">
        <input
          type="text"
          value={newTodoText()}
          onInput={(e) => setNewTodoText((e.target as HTMLInputElement).value)}
          placeholder="Add a new wedding task..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          class="bg-purple-600 text-white px-6 py-2 rounded-r-md hover:bg-purple-700 transition duration-200"
        >
          Add Task
        </button>
      </form>

      <div class="text-xs text-gray-500 flex items-center">
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z" />
        </svg>
        💡 Expand any task to get Pinterest inspiration and add details!
      </div>
    </div>
  );
};

export default AddTodoForm;

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
    <form onSubmit={handleSubmit} class="flex mb-6">
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
  );
};

export default AddTodoForm;

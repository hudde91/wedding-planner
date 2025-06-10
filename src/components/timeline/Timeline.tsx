import { Component, createSignal, Show, For } from "solid-js";
import { WeddingPlan, TodoItem, TodoFormData } from "../../types";
import TimelineOverview from "./TimelineOverview";
import TimelinePhaseDetail from "./TimelinePhaseDetail";
import TaskSuggestions from "./TaskSuggestions";
import TimelineService from "../../api/TimelineService";

interface TimelineProps {
  weddingPlan: WeddingPlan;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, todoData: TodoFormData) => void;
  onAddTodo: (text: string) => void;
}

const Timeline: Component<TimelineProps> = (props) => {
  const [view, setView] = createSignal<"overview" | "detailed">("overview");
  const [showSuggestions, setShowSuggestions] = createSignal(false);
  const [editingTodo, setEditingTodo] = createSignal<TodoItem | null>(null);

  const monthsUntilWedding = () => {
    if (!props.weddingPlan.wedding_date) return 0;
    return TimelineService.calculateMonthsUntilWedding(
      props.weddingPlan.wedding_date
    );
  };

  const categorizedTodos = () =>
    TimelineService.categorizeExistingTodos(props.weddingPlan.todos);

  const handleAddSuggestedTask = (task: TodoItem) => {
    props.onAddTodo(task.text);
  };

  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    // You can expand this to open a proper edit modal
    console.log("Edit todo:", todo);
  };

  return (
    <div class="space-y-6">
      {/* View Toggle */}
      <div class="flex justify-between items-center">
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("overview")}
            class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view() === "overview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setView("detailed")}
            class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view() === "detailed"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📋 Detailed View
          </button>
        </div>

        <button
          onClick={() => setShowSuggestions(true)}
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span>Get Suggestions</span>
        </button>
      </div>

      {/* Content */}
      <Show when={view() === "overview"}>
        <TimelineOverview weddingPlan={props.weddingPlan} />
      </Show>

      <Show when={view() === "detailed"}>
        <div class="space-y-4">
          <For each={TimelineService.getPhases()}>
            {(phase) => (
              <TimelinePhaseDetail
                phase={phase}
                todos={categorizedTodos().get(phase.id) || []}
                monthsUntilWedding={monthsUntilWedding()}
                onToggleTodo={props.onToggleTodo}
                onDeleteTodo={props.onDeleteTodo}
                onEditTodo={handleEditTodo}
              />
            )}
          </For>
        </div>
      </Show>

      {/* Task Suggestions Modal */}
      <Show when={showSuggestions()}>
        <TaskSuggestions
          weddingDate={props.weddingPlan.wedding_date}
          existingTodos={props.weddingPlan.todos}
          onAddSuggestedTask={handleAddSuggestedTask}
          onClose={() => setShowSuggestions(false)}
        />
      </Show>
    </div>
  );
};

export default Timeline;

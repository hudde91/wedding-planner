import { Component, createSignal, Show, For, onMount } from "solid-js";
import { WeddingPlan, TodoItem, TodoFormData } from "../../types";
import TimelineOverview from "./TimelineOverview";
import TimelinePhaseDetail from "./TimelinePhaseDetail";
import TaskSuggestions from "./TaskSuggestions";
import SmartTimelineService from "../../api/TimelineService";

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
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  const monthsUntilWedding = () => {
    if (!props.weddingPlan.wedding_date) return 0;
    return SmartTimelineService.calculateMonthsUntilWedding
      ? SmartTimelineService.calculateMonthsUntilWedding(
          props.weddingPlan.wedding_date
        )
      : 0;
  };

  const adaptivePhases = () =>
    SmartTimelineService.generateAdaptiveTimeline(
      props.weddingPlan.wedding_date,
      props.weddingPlan.todos
    );

  const categorizedTodos = () =>
    SmartTimelineService.categorizeExistingTodos(props.weddingPlan.todos);

  const handleAddSuggestedTask = (task: TodoItem) => {
    props.onAddTodo(task.text);
  };

  // Quick Actions callbacks
  const handleSwitchToDetailed = () => {
    setView("detailed");
  };

  const handleOpenSuggestions = () => {
    setShowSuggestions(true);
  };

  return (
    <div class="space-y-8">
      {/* Header with Background */}
      <div
        class={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 via-white to-purple-100 border border-indigo-200/50 shadow-xl transition-all duration-1000 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format"
            alt="Wedding timeline planning"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 p-8">
          <div class="flex justify-between items-center">
            <div class="max-w-3xl">
              <h1 class="text-4xl font-light text-gray-800 mb-4 tracking-wide">
                Wedding Timeline
              </h1>
              <p class="text-lg text-gray-600 font-light leading-relaxed">
                Navigate your wedding planning journey with our comprehensive
                timeline. From early planning to your big day, stay organized
                and stress-free.
              </p>
            </div>

            <div class="flex items-center space-x-4">
              <button
                onClick={() => setShowSuggestions(true)}
                class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <svg
                  class="w-5 h-5"
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
                <span>Get Suggestions</span>
              </button>
            </div>
          </div>
        </div>

        <div class="absolute top-4 right-4 w-32 h-32 opacity-5">
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            class="text-indigo-300"
          >
            <circle cx="20" cy="20" r="3" />
            <circle cx="50" cy="10" r="3" />
            <circle cx="80" cy="20" r="3" />
            <circle cx="20" cy="40" r="3" />
            <circle cx="50" cy="30" r="3" />
            <circle cx="80" cy="40" r="3" />
            <circle cx="20" cy="60" r="3" />
            <circle cx="50" cy="50" r="3" />
            <circle cx="80" cy="60" r="3" />
            <circle cx="20" cy="80" r="3" />
            <circle cx="50" cy="70" r="3" />
            <circle cx="80" cy="80" r="3" />
          </svg>
        </div>
      </div>

      {/* View Toggle */}
      <div
        class={`transition-all duration-1000 delay-200 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-gray-100 shadow-lg inline-flex">
          <button
            onClick={() => setView("overview")}
            class={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
              view() === "overview"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Overview</span>
          </button>
          <button
            onClick={() => setView("detailed")}
            class={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
              view() === "detailed"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
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
                d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5 0h6a2 2 0 002-2V7a2 2 0 00-2-2h-6m1-5v4m0 0v4m0-4h4m-4 0H9m0 0v4"
              />
            </svg>
            <span>Detailed View</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        class={`transition-all duration-1000 delay-400 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <Show when={view() === "overview"}>
          <TimelineOverview
            weddingPlan={props.weddingPlan}
            onSwitchToDetailed={handleSwitchToDetailed}
            onOpenSuggestions={handleOpenSuggestions}
          />
        </Show>

        <Show when={view() === "detailed"}>
          <div class="space-y-6">
            <For each={adaptivePhases()}>
              {(phase, index) => (
                <div
                  class="transition-all duration-500"
                  style={`animation-delay: ${index() * 100}ms`}
                >
                  <TimelinePhaseDetail
                    phase={phase}
                    todos={categorizedTodos().get(phase.id) || []}
                    monthsUntilWedding={monthsUntilWedding()}
                    onToggleTodo={props.onToggleTodo}
                    onDeleteTodo={props.onDeleteTodo}
                  />
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

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

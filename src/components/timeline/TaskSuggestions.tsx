import { Component, For, Show, createSignal, createMemo } from "solid-js";
import TimelineService, { TimelineTodo } from "../../api/TimelineService";
import { TodoItem } from "../../types";

interface TaskSuggestionsProps {
  weddingDate: string;
  existingTodos: TodoItem[];
  onAddSuggestedTask: (task: TimelineTodo) => void;
  onClose: () => void;
}
// TODO: Replace any emoji icons with better more elegant/luxurious SVG icons
const TaskSuggestions: Component<TaskSuggestionsProps> = (props) => {
  const [selectedTasks, setSelectedTasks] = createSignal<Set<number>>(
    new Set()
  );
  const [isLoaded, setIsLoaded] = createSignal(false);

  setTimeout(() => setIsLoaded(true), 100);

  const suggestedTasks = createMemo(() =>
    TimelineService.generateSuggestedTodos(
      props.weddingDate,
      props.existingTodos
    )
  );

  const monthsUntilWedding = createMemo(() =>
    TimelineService.calculateMonthsUntilWedding(props.weddingDate)
  );

  const groupedSuggestions = createMemo(() => {
    const groups = new Map<string, TimelineTodo[]>();
    const phases = TimelineService.getPhases();

    phases.forEach((phase) => {
      groups.set(phase.id, []);
    });

    suggestedTasks().forEach((task) => {
      if (task.timelinePhase) {
        const existing = groups.get(task.timelinePhase) || [];
        groups.set(task.timelinePhase, [...existing, task]);
      }
    });

    return groups;
  });

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // TODO: Should not be possible to add tasks that are already in the wedding plan
  // Solution: Once a task is added, it should be removed from the suggestions
  const addSelectedTasks = () => {
    suggestedTasks().forEach((task) => {
      if (selectedTasks().has(task.id)) {
        props.onAddSuggestedTask(task);
      }
    });
    setSelectedTasks(new Set<number>());
    props.onClose();
  };

  const getPhaseRelevance = (
    phaseId: string
  ): "current" | "upcoming" | "past" => {
    const phase = TimelineService.getPhaseById(phaseId);
    if (!phase) return "upcoming";

    const months = monthsUntilWedding();
    if (months >= phase.endMonths && months <= phase.startMonths)
      return "current";
    if (months > phase.startMonths) return "upcoming";
    return "past";
  };

  const handleBackdropClick = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const handleModalContentClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  const togglePhaseSelection = (phaseId: string) => {
    const phaseTasks = groupedSuggestions().get(phaseId) || [];
    const allSelected = phaseTasks.every((task) =>
      selectedTasks().has(task.id)
    );

    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      phaseTasks.forEach((task) => {
        if (allSelected) {
          newSet.delete(task.id);
        } else {
          newSet.add(task.id);
        }
      });
      return newSet;
    });
  };

  return (
    <div
      class={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500 ${
        isLoaded() ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        class={`bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-white/20 transition-all duration-700 ${
          isLoaded()
            ? "transform translate-y-0 scale-100"
            : "transform translate-y-8 scale-95"
        }`}
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div class="relative p-8 border-b border-gray-100/80 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div class="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=200&fit=crop&auto=format"
              alt="Wedding planning inspiration"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="relative z-10 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-medium text-gray-900 tracking-wide">
                  Suggested Wedding Tasks
                </h3>
                <p class="text-lg text-gray-600 font-light mt-1">
                  Personalized recommendations based on your wedding date
                </p>
                <Show when={!props.weddingDate}>
                  <div class="inline-flex items-center mt-2 px-3 py-1 bg-orange-100/80 backdrop-blur-sm text-orange-700 rounded-full text-sm border border-orange-200/50">
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Set your wedding date to get personalized suggestions
                  </div>
                </Show>
              </div>
            </div>
            <button
              onClick={props.onClose}
              class="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-300 backdrop-blur-sm"
              title="Close modal"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div class="p-8 overflow-y-auto max-h-[60vh] bg-gradient-to-b from-white/80 to-gray-50/40">
          <Show when={suggestedTasks().length === 0}>
            <div class="text-center py-20">
              <div class="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  class="w-12 h-12 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-2xl font-medium text-gray-900 mb-2">
                You're all caught up!
              </h3>
              <p class="text-lg text-gray-600 font-light">
                You already have all the essential wedding planning tasks.
              </p>
            </div>
          </Show>

          <Show when={suggestedTasks().length > 0}>
            <div class="space-y-8">
              <For each={TimelineService.getPhases()}>
                {(phase, index) => {
                  const phaseTasks = groupedSuggestions().get(phase.id) || [];
                  if (phaseTasks.length === 0) return null;

                  const relevance = getPhaseRelevance(phase.id);
                  const relevanceStyles = {
                    current: "ring-2 ring-blue-200 bg-blue-50/50",
                    upcoming: "bg-gray-50/50",
                    past: "bg-orange-50/50 opacity-90",
                  };

                  const allPhaseTasksSelected = phaseTasks.every((task) =>
                    selectedTasks().has(task.id)
                  );

                  return (
                    <div
                      class={`relative overflow-hidden rounded-xl p-6 border transition-all duration-500 ${phase.color} ${relevanceStyles[relevance]}`}
                      style={`animation-delay: ${index() * 100}ms`}
                    >
                      <div class="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

                      <div class="relative z-10">
                        <div class="flex items-center justify-between mb-6">
                          <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <span class="text-2xl">{phase.icon}</span>
                            </div>
                            <div>
                              <h4 class="text-xl font-medium">{phase.name}</h4>
                              <p class="text-sm opacity-90 font-light">
                                {phase.description}
                              </p>
                            </div>
                          </div>
                          <div class="flex items-center space-x-3">
                            <Show when={relevance === "current"}>
                              <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                                🎯 Current Priority
                              </span>
                            </Show>
                            <Show when={relevance === "past"}>
                              <span class="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
                                ⚠️ Overdue
                              </span>
                            </Show>
                            <button
                              onClick={() => togglePhaseSelection(phase.id)}
                              class="px-4 py-2 text-sm font-medium bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all duration-300"
                            >
                              {allPhaseTasksSelected
                                ? "Deselect All"
                                : "Select All"}
                            </button>
                          </div>
                        </div>

                        <div class="space-y-3">
                          <For each={phaseTasks}>
                            {(task, taskIndex) => (
                              <div
                                class="bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white/90 transition-all duration-300 border border-white/50"
                                style={`animation-delay: ${
                                  index() * 100 + taskIndex() * 50
                                }ms`}
                              >
                                <div class="flex items-center space-x-4">
                                  <div class="relative">
                                    <input
                                      type="checkbox"
                                      checked={selectedTasks().has(task.id)}
                                      onChange={() =>
                                        toggleTaskSelection(task.id)
                                      }
                                      class="sr-only"
                                    />
                                    <div
                                      class={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                                        selectedTasks().has(task.id)
                                          ? "bg-gradient-to-r from-indigo-400 to-purple-400 border-indigo-400"
                                          : "border-gray-300 hover:border-indigo-400 bg-white"
                                      }`}
                                      onClick={() =>
                                        toggleTaskSelection(task.id)
                                      }
                                    >
                                      {selectedTasks().has(task.id) && (
                                        <svg
                                          class="w-3 h-3 text-white"
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
                                      )}
                                    </div>
                                  </div>
                                  <div class="flex-1">
                                    <span class="text-gray-800 font-medium">
                                      {task.text}
                                    </span>
                                    <Show
                                      when={
                                        task.recommendedMonths !== undefined
                                      }
                                    >
                                      <div class="text-xs text-gray-600 mt-1 font-light">
                                        Recommended:{" "}
                                        {task.recommendedMonths === 0
                                          ? "Wedding week"
                                          : `${task.recommendedMonths} month${
                                              task.recommendedMonths === 1
                                                ? ""
                                                : "s"
                                            } before wedding`}
                                      </div>
                                    </Show>
                                    <Show when={task.urgency}>
                                      <div class="mt-2">
                                        <span
                                          class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            task.urgency === "critical"
                                              ? "bg-red-100 text-red-700"
                                              : task.urgency === "high"
                                              ? "bg-orange-100 text-orange-700"
                                              : task.urgency === "medium"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          {task.urgency} priority
                                        </span>
                                      </div>
                                    </Show>
                                  </div>
                                  <div class="text-lg flex items-center">
                                    {relevance === "current" && (
                                      <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    )}
                                    {relevance === "upcoming" && (
                                      <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    )}
                                    {relevance === "past" && (
                                      <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>

        {/* Footer */}
        <div class="p-8 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/80 via-white/60 to-gray-50/80 backdrop-blur-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <span class="text-lg font-medium text-indigo-600">
                  {selectedTasks().size}
                </span>
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {selectedTasks().size} task
                  {selectedTasks().size === 1 ? "" : "s"} selected
                </div>
                <div class="text-sm text-gray-600 font-light">
                  Ready to add to your planning checklist
                </div>
              </div>
            </div>
            <div class="flex space-x-4">
              <button
                onClick={props.onClose}
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addSelectedTasks}
                disabled={selectedTasks().size === 0}
                class={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTasks().size === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                Add {selectedTasks().size} Task
                {selectedTasks().size === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSuggestions;

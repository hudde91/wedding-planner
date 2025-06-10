import { Component, For, Show, createSignal, createMemo } from "solid-js";
import TimelineService, { TimelineTodo } from "../../api/TimelineService";
import { TodoItem } from "../../types"; // ✅ Import TodoItem for proper typing

interface TaskSuggestionsProps {
  weddingDate: string;
  existingTodos: TodoItem[]; // ✅ Fixed: Use TodoItem instead of TimelineTodo
  onAddSuggestedTask: (task: TimelineTodo) => void;
  onClose: () => void;
}

const TaskSuggestions: Component<TaskSuggestionsProps> = (props) => {
  const [selectedTasks, setSelectedTasks] = createSignal<Set<number>>(
    new Set()
  );

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

  // ✅ Fixed: Proper event handling for backdrop clicks
  const handleBackdropClick = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const handleModalContentClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  // ✅ Fixed: Toggle all tasks in a phase
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={handleModalContentClick}
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                💡 Suggested Wedding Tasks
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Based on your wedding date, here are recommended tasks to add to
                your timeline
              </p>
              <Show when={!props.weddingDate}>
                <p class="text-sm text-orange-600 mt-1">
                  ⚠️ Set your wedding date to get personalized suggestions
                </p>
              </Show>
            </div>
            <button
              onClick={props.onClose}
              class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <Show when={suggestedTasks().length === 0}>
            <div class="text-center py-12 text-gray-500">
              <div class="text-4xl mb-4">✨</div>
              <p class="text-lg font-medium mb-2">You're all caught up!</p>
              <p>You already have all the essential wedding planning tasks.</p>
            </div>
          </Show>

          <Show when={suggestedTasks().length > 0}>
            <div class="space-y-6">
              <For each={TimelineService.getPhases()}>
                {(phase) => {
                  const phaseTasks = groupedSuggestions().get(phase.id) || [];
                  if (phaseTasks.length === 0) return null;

                  const relevance = getPhaseRelevance(phase.id);
                  const relevanceStyles = {
                    current: "ring-2 ring-blue-200 bg-blue-50",
                    upcoming: "bg-gray-50",
                    past: "bg-orange-50 opacity-75",
                  };

                  // ✅ Check if all tasks in phase are selected
                  const allPhaseTasksSelected = phaseTasks.every((task) =>
                    selectedTasks().has(task.id)
                  );

                  return (
                    <div
                      class={`${phase.color} border rounded-lg p-4 ${relevanceStyles[relevance]}`}
                    >
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-3">
                          <span class="text-xl">{phase.icon}</span>
                          <div>
                            <h4 class="font-semibold text-lg">{phase.name}</h4>
                            <p class="text-sm opacity-75">
                              {phase.description}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <Show when={relevance === "current"}>
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              🎯 Current Priority
                            </span>
                          </Show>
                          <Show when={relevance === "past"}>
                            <span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                              ⚠️ Overdue
                            </span>
                          </Show>
                          <button
                            onClick={() => togglePhaseSelection(phase.id)}
                            class="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-100"
                          >
                            {allPhaseTasksSelected
                              ? "Deselect All"
                              : "Select All"}
                          </button>
                        </div>
                      </div>

                      <div class="space-y-2">
                        <For each={phaseTasks}>
                          {(task) => (
                            <div class="bg-white bg-opacity-80 rounded-lg p-3 flex items-center space-x-3 hover:bg-opacity-90 transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedTasks().has(task.id)}
                                onChange={() => toggleTaskSelection(task.id)}
                                class="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div class="flex-1">
                                <span class="text-gray-800 font-medium">
                                  {task.text}
                                </span>
                                <Show
                                  when={task.recommendedMonths !== undefined}
                                >
                                  <div class="text-xs text-gray-600 mt-1">
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
                                  <div class="text-xs mt-1">
                                    <span
                                      class={`px-2 py-1 rounded-full text-xs font-medium ${
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
                              <div class="text-xs text-gray-500">
                                {relevance === "current" && "🎯"}
                                {relevance === "upcoming" && "⏳"}
                                {relevance === "past" && "⚠️"}
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>

        <div class="p-6 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{selectedTasks().size}</span> task
              {selectedTasks().size === 1 ? "" : "s"} selected
            </div>
            <div class="flex space-x-3">
              <button
                onClick={props.onClose}
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addSelectedTasks}
                disabled={selectedTasks().size === 0}
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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

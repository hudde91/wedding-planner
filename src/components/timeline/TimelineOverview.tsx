import { Component, createMemo, For, Show, createSignal } from "solid-js";
import { WeddingPlan } from "../../types";
import SmartTimelineService from "../../api/TimelineService";
import {
  calculateMonthsUntilWedding,
  getWeddingCountdown,
  formatShortDate,
} from "../../utils/date";
import {
  calculateTodoProgress,
  calculateTaskVelocity,
} from "../../utils/progress";
import {
  getPhaseStatusStyle,
  getProgressColor,
  getStatusMessage,
  getStatusIcon,
} from "../../utils/status";
import { pluralize } from "../../utils/validation";

interface TimelineOverviewProps {
  weddingPlan: WeddingPlan;
  onSwitchToDetailed?: () => void;
  onOpenSuggestions?: () => void;
  onToggleFocusMode?: () => void;
}

const TimelineOverview: Component<TimelineOverviewProps> = (props) => {
  const [focusMode, setFocusMode] = createSignal(false);

  const monthsUntilWedding = createMemo(() => {
    if (!props.weddingPlan.wedding_date) return 0;
    return calculateMonthsUntilWedding(props.weddingPlan.wedding_date);
  });

  const adaptivePhases = createMemo(() =>
    SmartTimelineService.generateAdaptiveTimeline(
      props.weddingPlan.wedding_date,
      props.weddingPlan.todos
    )
  );

  const categorizedTodos = createMemo(() =>
    SmartTimelineService.categorizeExistingTodos(props.weddingPlan.todos)
  );

  const timelineInsights = createMemo(() =>
    SmartTimelineService.generateTimelineInsights(
      props.weddingPlan.todos,
      props.weddingPlan.wedding_date,
      adaptivePhases()
    )
  );

  const milestones = createMemo(() => {
    // Generate milestones based on adaptive phases instead of fixed timeline
    const phases = adaptivePhases();
    return phases.map((phase) => ({
      date: phase.adaptedStartDate.toISOString().split("T")[0],
      milestone: phase.name,
      description: phase.description,
      importance: phase.priority as "high" | "medium" | "low",
    }));
  });

  const completionEstimate = createMemo(() => {
    const incompleteTasks = props.weddingPlan.todos.filter((t) => !t.completed);
    return calculateTaskVelocity(incompleteTasks, monthsUntilWedding());
  });

  const getPhaseProgress = (phaseId: string) => {
    const phaseTodos = categorizedTodos().get(phaseId) || [];
    return calculateTodoProgress(phaseTodos).percentage;
  };

  const getStatusBadge = (phase: any) => {
    const now = new Date();
    let status = "upcoming";

    if (now >= phase.adaptedStartDate && now <= phase.adaptedEndDate) {
      status = "current";
    } else if (now > phase.adaptedEndDate) {
      status = "past";
    } else if (phase.compressionLevel > 0.5) {
      status = "compressed";
    }

    return getPhaseStatusStyle(status as any).containerClass;
  };

  const getCurrentPhaseInfo = () => {
    const current = timelineInsights().currentPhase;
    if (!current) return null;

    const phaseTodos = categorizedTodos().get(current.id) || [];
    const progress = calculateTodoProgress(phaseTodos);

    return {
      phase: current,
      totalTasks: progress.total,
      completedTasks: progress.completed,
      incompleteTasks: progress.remaining,
      progress: progress.percentage,
    };
  };

  const getNextMilestone = () => {
    const now = new Date();
    return milestones().find((milestone) => new Date(milestone.date) > now);
  };

  const filteredPhases = createMemo(() => {
    const allPhases = SmartTimelineService.getPhases();
    if (!focusMode()) return allPhases;

    // In focus mode, only show current and overdue phases with incomplete tasks
    return allPhases.filter((phase) => {
      const status = SmartTimelineService.getPhaseStatus(
        phase,
        monthsUntilWedding()
      );
      const phaseTodos = categorizedTodos().get(phase.id) || [];
      const hasIncompleteTasks = phaseTodos.some((todo) => !todo.completed);

      return (
        (status === "current" || status === "overdue") && hasIncompleteTasks
      );
    });
  });

  const countdown = getWeddingCountdown(props.weddingPlan.wedding_date || "");
  const currentPhaseInfo = getCurrentPhaseInfo();
  const nextMilestone = getNextMilestone();

  return (
    <div class="space-y-8">
      {/* Wedding Countdown Header */}
      <div class="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-2xl">
        <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div class="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=400&fit=crop&auto=format"
            alt="Wedding celebration"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 text-center space-y-6">
          <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 class="text-3xl font-light mb-4 tracking-wide">
            Wedding Timeline
          </h1>

          <Show
            when={props.weddingPlan.wedding_date}
            fallback={
              <div class="space-y-4">
                <p class="text-xl text-white/90 mb-2">
                  Set your wedding date to see your personalized timeline
                </p>
                <div class="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div class="flex items-center justify-center space-x-2">
                    <svg
                      class="w-4 h-4 text-white/90"
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
                    <p class="text-sm text-white/90 font-light">
                      Once you add your wedding date, we'll show you exactly
                      what to do when!
                    </p>
                  </div>
                </div>
              </div>
            }
          >
            <div class="space-y-4">
              <div class="flex items-center justify-center space-x-3">
                <p class={`text-2xl font-light text-white/95`}>
                  {countdown.text}
                </p>
                <Show when={countdown.showCelebration}>
                  <svg
                    class="w-6 h-6 text-yellow-300 animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </Show>
              </div>
              <p class="text-lg text-white/90 mb-2">
                {formatShortDate(props.weddingPlan.wedding_date)}
              </p>
              <p class="text-sm text-white/80 font-light">
                {countdown.subtext}
              </p>

              <Show when={completionEstimate().tasksPerWeek > 0}>
                <div class="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div class="flex items-center space-x-3 mb-2">
                    <svg
                      class="w-4 h-4 text-white/90"
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
                    <p class="text-sm text-white/90 font-light">
                      {pluralize(completionEstimate().tasksPerWeek, "task")} per
                      week to complete everything on time
                    </p>
                  </div>
                  <Show when={!completionEstimate().isOnTrack}>
                    <div class="flex items-center space-x-2">
                      <svg
                        class="w-3 h-3 text-yellow-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <p class="text-xs text-yellow-200 font-light">
                        Consider getting help to stay on track
                      </p>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
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
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Tasks Completed
              </p>
              <p class="text-3xl font-light text-blue-600">
                {props.weddingPlan.todos.filter((t) => t.completed).length}
              </p>
              <p class="text-xs text-gray-500 font-light">
                of {props.weddingPlan.todos.length} total
              </p>
            </div>
          </div>
        </div>

        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Overdue Tasks
              </p>
              <p class="text-3xl font-light text-orange-600">
                {timelineInsights().overdueTasks.length}
              </p>
              <p class="text-xs text-gray-500 font-light">
                {timelineInsights().overdueTasks.length === 0
                  ? "All caught up"
                  : "Need attention"}
              </p>
            </div>
          </div>
        </div>

        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
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
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Overall Progress
              </p>
              <p class="text-3xl font-light text-green-600">
                {Math.round(timelineInsights().overallProgress)}%
              </p>
              <p class="text-xs text-gray-500 font-light">
                {timelineInsights().overallProgress >= 75
                  ? "Almost there!"
                  : timelineInsights().overallProgress >= 50
                  ? "Great progress!"
                  : timelineInsights().overallProgress >= 25
                  ? "Good start!"
                  : "Just getting started"}
              </p>
            </div>
          </div>
        </div>

        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Priority Tasks
              </p>
              <p class="text-3xl font-light text-purple-600">
                {timelineInsights().priorityTasks.length}
              </p>
              <p class="text-xs text-gray-500 font-light">Current focus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Phase Spotlight */}
      <Show when={currentPhaseInfo}>
        <div
          class={`relative overflow-hidden rounded-2xl ${
            currentPhaseInfo!.phase.color
          } border shadow-xl`}
        >
          <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div class="relative z-10 p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span class="text-3xl">{currentPhaseInfo!.phase.icon}</span>
                </div>
                <div>
                  <h3 class="text-2xl font-medium flex items-center space-x-3">
                    <span>{currentPhaseInfo!.phase.name}</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium flex items-center">
                      <svg
                        class="w-3 h-3 mr-1"
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
                      Current Phase
                    </span>
                  </h3>
                  <p class="text-sm opacity-90 font-light mt-1">
                    {currentPhaseInfo!.phase.description}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-light">
                  {currentPhaseInfo!.progress}%
                </div>
                <div class="text-sm opacity-90 font-light">Complete</div>
              </div>
            </div>

            <div class="w-full bg-white/30 rounded-full h-3 mb-6">
              <div
                class="bg-white/80 h-3 rounded-full transition-all duration-1000"
                style={`width: ${currentPhaseInfo!.progress}%`}
              ></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div class="font-medium text-lg">
                  {currentPhaseInfo!.totalTasks}
                </div>
                <div class="opacity-90 font-light">Total Tasks</div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div class="font-medium text-lg text-green-100">
                  {currentPhaseInfo!.completedTasks}
                </div>
                <div class="opacity-90 font-light">Completed</div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div class="font-medium text-lg text-orange-100">
                  {currentPhaseInfo!.incompleteTasks}
                </div>
                <div class="opacity-90 font-light">Remaining</div>
              </div>
            </div>

            <Show
              when={
                currentPhaseInfo!.phase.tips &&
                currentPhaseInfo!.phase.tips!.length > 0
              }
            >
              <div class="mt-6 pt-6 border-t border-white/20">
                <h4 class="font-medium mb-3 flex items-center">
                  <svg
                    class="w-5 h-5 mr-2"
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
                  Phase Tips
                </h4>
                <div class="space-y-2 text-sm">
                  <For each={currentPhaseInfo!.phase.tips!.slice(0, 2)}>
                    {(tip) => (
                      <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-white/60 rounded-full mt-2 flex-shrink-0"></div>
                        <span class="opacity-90 font-light">{tip}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      {/* Timeline Phases Overview */}
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-medium text-gray-900">
            {focusMode() ? "Priority Phases" : "Planning Phases"}
          </h2>
          <div class="flex items-center space-x-4">
            <Show when={focusMode()}>
              <div class="text-sm text-purple-600 font-medium">
                Showing {pluralize(filteredPhases().length, "priority phase")}
              </div>
            </Show>
            <div class="text-sm text-gray-500 font-light">
              Click phases to view details in Detailed View
            </div>
          </div>
        </div>

        <Show when={focusMode() && filteredPhases().length === 0}>
          <div class="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-2">
              No priority tasks right now!
            </h3>
            <p class="text-gray-600 font-light">
              You're on track with your current planning phase.
            </p>
          </div>
        </Show>

        <For each={filteredPhases()}>
          {(phase, index) => {
            const phaseTodos = categorizedTodos().get(phase.id) || [];
            const progress = getPhaseProgress(phase.id);
            const status = SmartTimelineService.getPhaseStatus(
              phase,
              monthsUntilWedding()
            );

            return (
              <div
                class={`group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl border shadow-lg hover:shadow-xl transition-all duration-500 ${getStatusBadge(
                  phase
                )}`}
                style={`animation-delay: ${index() * 100}ms`}
              >
                <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="relative z-10 p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span class="text-2xl">{phase.icon}</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-medium flex items-center space-x-3">
                          <span>{phase.name}</span>
                          <Show when={status === "current"}>
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center">
                              <svg
                                class="w-2 h-2 mr-1"
                                fill="currentColor"
                                viewBox="0 0 8 8"
                              >
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                              Current
                            </span>
                          </Show>
                          <Show when={status === "overdue"}>
                            <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center">
                              <svg
                                class="w-2 h-2 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              Overdue
                            </span>
                          </Show>
                        </h3>
                        <p class="text-sm text-gray-600 font-light">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium text-gray-900">
                        {pluralize(phaseTodos.length, "task")}
                      </div>
                      <div class="text-xs text-gray-500 font-light">
                        {progress}% complete
                      </div>
                    </div>
                  </div>

                  <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      class={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(
                        progress
                      )}`}
                      style={`width: ${progress}%`}
                    ></div>
                  </div>

                  <div class="flex items-center justify-between text-xs">
                    <span
                      class={`px-3 py-1 rounded-full font-medium flex items-center ${
                        status === "current"
                          ? "bg-blue-100 text-blue-700"
                          : status === "past"
                          ? "bg-green-100 text-green-700"
                          : status === "upcoming"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d={getStatusIcon(status as any)}
                        />
                      </svg>
                      {getStatusMessage(status as any)}
                    </span>
                    <div class="text-gray-500 font-light">
                      {phase.startMonths > 0 &&
                        `${phase.endMonths}-${phase.startMonths} months before`}
                      {phase.startMonths === 0 && "Wedding time!"}
                    </div>
                  </div>

                  <Show
                    when={
                      (status === "current" || status === "overdue") &&
                      phaseTodos.length > 0
                    }
                  >
                    <div class="mt-4 pt-4 border-t border-gray-100">
                      <div class="text-xs text-gray-600 font-light mb-2">
                        {status === "current"
                          ? "Focus on these tasks:"
                          : "Overdue tasks:"}
                      </div>
                      <div class="space-y-1">
                        <For
                          each={phaseTodos
                            .filter((todo) => !todo.completed)
                            .slice(0, 3)}
                        >
                          {(todo) => (
                            <div class="flex items-center space-x-2 text-xs bg-gray-50/80 rounded-lg px-3 py-2">
                              <div class="w-2 h-2 border border-gray-400 rounded-full"></div>
                              <span class="flex-1 font-light">{todo.text}</span>
                            </div>
                          )}
                        </For>
                        <Show
                          when={
                            phaseTodos.filter((todo) => !todo.completed)
                              .length > 3
                          }
                        >
                          <div class="text-xs text-gray-500 text-center py-1 font-light">
                            +
                            {phaseTodos.filter((todo) => !todo.completed)
                              .length - 3}{" "}
                            more tasks...
                          </div>
                        </Show>
                      </div>
                    </div>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      {/* Next Milestone */}
      <Show when={nextMilestone}>
        <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl border border-blue-200/50 shadow-lg">
          <div class="absolute inset-0 opacity-5">
            <img
              src="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=200&fit=crop&auto=format"
              alt="Milestone"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="relative z-10 p-6">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-medium text-gray-900 mb-1">
                  Next Milestone
                </h3>
                <p class="text-lg text-gray-700 font-light">
                  {nextMilestone!.milestone}
                </p>
                <p class="text-sm text-gray-600 font-light">
                  {nextMilestone!.description}
                </p>
              </div>
              <div class="text-right">
                <div class="text-lg font-medium text-blue-600">
                  {formatShortDate(nextMilestone!.date)}
                </div>
                <div class="text-sm text-gray-500 font-light">
                  {Math.ceil(
                    (new Date(nextMilestone!.date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Recommendations */}
      <Show when={timelineInsights().recommendations.length > 0}>
        <div class="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-xl border border-amber-200/50 shadow-lg">
          <div class="absolute inset-0 opacity-5">
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=200&fit=crop&auto=format"
              alt="Wedding advice"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="relative z-10 p-6">
            <h3 class="text-xl font-medium text-gray-900 mb-4 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mr-3">
                <svg
                  class="w-5 h-5 text-white"
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
              Recommendations
            </h3>
            <div class="space-y-3">
              <For each={timelineInsights().recommendations}>
                {(recommendation) => (
                  <div class="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <div class="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span class="text-sm text-gray-700 font-light">
                      {recommendation}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>

      {/* Quick Actions */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-medium text-gray-900 flex items-center">
            <div class="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            Quick Actions
          </h3>
          <Show when={focusMode()}>
            <div class="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              <span class="font-medium">Focus Mode Active</span>
            </div>
          </Show>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => props.onSwitchToDetailed?.()}
            class="group p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-300 text-left"
          >
            <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                class="w-6 h-6 text-purple-600"
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
            </div>
            <div class="font-medium text-gray-900 mb-1">
              View Detailed Timeline
            </div>
            <div class="text-sm text-gray-600 font-light">
              See all phases and tasks in detail
            </div>
          </button>

          <button
            onClick={() => props.onOpenSuggestions?.()}
            class="group p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 text-left"
          >
            <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                class="w-6 h-6 text-blue-600"
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
            <div class="font-medium text-gray-900 mb-1">
              Get Task Suggestions
            </div>
            <div class="text-sm text-gray-600 font-light">
              Add recommended tasks to your plan
            </div>
          </button>

          <button
            onClick={() => setFocusMode(!focusMode())}
            class={`group p-6 bg-gradient-to-br border rounded-xl transition-all duration-300 text-left ${
              focusMode()
                ? "from-green-50 to-emerald-50 border-green-300 bg-green-50/50"
                : "from-gray-50 to-white border-gray-200 hover:border-green-300 hover:bg-green-50/50"
            }`}
          >
            <div
              class={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                focusMode()
                  ? "bg-gradient-to-br from-green-400 to-emerald-500"
                  : "bg-gradient-to-br from-green-100 to-emerald-100"
              }`}
            >
              <svg
                class={`w-6 h-6 ${
                  focusMode() ? "text-white" : "text-green-600"
                }`}
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
            <div class="font-medium text-gray-900 mb-1">
              {focusMode() ? "Exit Focus Mode" : "Focus Mode"}
            </div>
            <div class="text-sm text-gray-600 font-light">
              {focusMode()
                ? "Show all phases again"
                : "Show priority tasks only"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineOverview;

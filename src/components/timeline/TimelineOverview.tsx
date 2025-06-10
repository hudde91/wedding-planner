import { Component, createMemo, For, Show } from "solid-js";
import { WeddingPlan } from "../../types";
import { useWeddingStats } from "../../hooks/useWeddingStats";
import TimelineService from "../../api/TimelineService";

interface TimelineOverviewProps {
  weddingPlan: WeddingPlan;
}

const TimelineOverview: Component<TimelineOverviewProps> = (props) => {
  const stats = useWeddingStats(() => props.weddingPlan);

  const monthsUntilWedding = createMemo(() => {
    if (!props.weddingPlan.wedding_date) return 0;
    return TimelineService.calculateMonthsUntilWedding(
      props.weddingPlan.wedding_date
    );
  });

  const phases = createMemo(() => TimelineService.getPhases());

  const categorizedTodos = createMemo(() =>
    TimelineService.categorizeExistingTodos(props.weddingPlan.todos)
  );

  const timelineInsights = createMemo(() =>
    TimelineService.generateTimelineInsights(
      props.weddingPlan.todos,
      props.weddingPlan.wedding_date
    )
  );

  const milestones = createMemo(() =>
    TimelineService.getMilestones(props.weddingPlan.wedding_date)
  );

  const completionEstimate = createMemo(() =>
    TimelineService.estimateCompletionDate(
      props.weddingPlan.todos,
      props.weddingPlan.wedding_date
    )
  );

  const getPhaseProgress = (phaseId: string) => {
    const phaseTodos = categorizedTodos().get(phaseId) || [];
    if (phaseTodos.length === 0) return 0;
    const completed = phaseTodos.filter((todo) => todo.completed).length;
    return Math.round((completed / phaseTodos.length) * 100);
  };

  const getStatusBadge = (phase: any) => {
    const status = TimelineService.getPhaseStatus(phase, monthsUntilWedding());
    const badges = {
      upcoming: "bg-gray-100 text-gray-600 border-gray-300",
      current:
        "bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-200 shadow-sm",
      past: "bg-green-100 text-green-700 border-green-300",
      overdue: "bg-red-100 text-red-700 border-red-300 ring-2 ring-red-200",
    };
    return badges[status];
  };

  const getWeddingCountdown = () => {
    const months = monthsUntilWedding();
    if (months <= 0) {
      return {
        text: "Your wedding has arrived! 🎉",
        subtext: "Congratulations on your special day!",
        color: "text-pink-600",
      };
    } else if (months < 1) {
      const days = Math.ceil(months * 30);
      return {
        text: `${days} days to go!`,
        subtext: "Final countdown - you've got this!",
        color: "text-red-600",
      };
    } else if (months < 2) {
      return {
        text: `${Math.ceil(months)} month to go!`,
        subtext: "Final preparations time!",
        color: "text-orange-600",
      };
    } else {
      return {
        text: `${Math.ceil(months)} months to go!`,
        subtext: "Plenty of time to plan perfectly",
        color: "text-purple-600",
      };
    }
  };

  const getCurrentPhaseInfo = () => {
    const current = timelineInsights().currentPhase;
    if (!current) return null;

    const phaseTodos = categorizedTodos().get(current.id) || [];
    const incompleteTasks = phaseTodos.filter((todo) => !todo.completed);

    return {
      phase: current,
      totalTasks: phaseTodos.length,
      completedTasks: phaseTodos.length - incompleteTasks.length,
      incompleteTasks: incompleteTasks.length,
      progress: getPhaseProgress(current.id),
    };
  };

  const getNextMilestone = () => {
    const now = new Date();
    return milestones().find((milestone) => new Date(milestone.date) > now);
  };

  const countdown = getWeddingCountdown();
  const currentPhaseInfo = getCurrentPhaseInfo();
  const nextMilestone = getNextMilestone();

  return (
    <div class="space-y-6">
      {/* Wedding Countdown Header */}
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-white opacity-10"></div>
        <div class="relative z-10 text-center">
          <div class="text-4xl mb-4">⏰</div>
          <h1 class="text-2xl font-bold mb-2">Wedding Timeline</h1>
          <Show
            when={props.weddingPlan.wedding_date}
            fallback={
              <div>
                <p class="text-xl text-purple-100 mb-2">
                  Set your wedding date to see your personalized timeline
                </p>
                <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                  <p class="text-sm text-purple-100">
                    💡 Once you add your wedding date, we'll show you exactly
                    what to do when!
                  </p>
                </div>
              </div>
            }
          >
            <p
              class={`text-2xl font-bold mb-2 ${countdown.color.replace(
                "text-",
                "text-white "
              )}`}
            >
              {countdown.text}
            </p>
            <p class="text-lg text-purple-100 mb-2">
              {new Date(props.weddingPlan.wedding_date).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
            <p class="text-sm text-purple-200">{countdown.subtext}</p>

            {/* Quick completion estimate */}
            <Show when={completionEstimate().tasksPerWeek > 0}>
              <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                <p class="text-sm text-purple-100">
                  📋 {completionEstimate().tasksPerWeek} tasks per week to
                  complete everything on time
                </p>
                <Show when={!completionEstimate().isOnTrack}>
                  <p class="text-xs text-yellow-200 mt-1">
                    ⚡ Consider getting help to stay on track
                  </p>
                </Show>
              </div>
            </Show>
          </Show>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div class="text-2xl font-bold text-blue-600">
            {props.weddingPlan.todos.filter((t) => t.completed).length}
          </div>
          <div class="text-sm text-blue-800">Tasks Completed</div>
          <div class="text-xs text-blue-600 mt-1">
            of {props.weddingPlan.todos.length} total
          </div>
        </div>

        <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div class="text-2xl font-bold text-orange-600">
            {timelineInsights().overdueTasks.length}
          </div>
          <div class="text-sm text-orange-800">Overdue Tasks</div>
          <Show when={timelineInsights().overdueTasks.length > 0}>
            <div class="text-xs text-orange-600 mt-1">Need attention!</div>
          </Show>
          <Show when={timelineInsights().overdueTasks.length === 0}>
            <div class="text-xs text-orange-600 mt-1">All caught up! 🎉</div>
          </Show>
        </div>

        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
          <div class="text-2xl font-bold text-green-600">
            {Math.round(timelineInsights().overallProgress)}%
          </div>
          <div class="text-sm text-green-800">Overall Progress</div>
          <div class="text-xs text-green-600 mt-1">
            {timelineInsights().overallProgress >= 75
              ? "Almost there!"
              : timelineInsights().overallProgress >= 50
              ? "Great progress!"
              : timelineInsights().overallProgress >= 25
              ? "Good start!"
              : "Just getting started"}
          </div>
        </div>

        <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div class="text-2xl font-bold text-purple-600">
            {timelineInsights().priorityTasks.length}
          </div>
          <div class="text-sm text-purple-800">Priority Tasks</div>
          <div class="text-xs text-purple-600 mt-1">Current focus</div>
        </div>
      </div>

      {/* Current Phase Spotlight */}
      <Show when={currentPhaseInfo}>
        <div class={`${currentPhaseInfo!.phase.color} border rounded-lg p-6`}>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">{currentPhaseInfo!.phase.icon}</span>
              <div>
                <h3 class="text-xl font-bold flex items-center space-x-2">
                  <span>{currentPhaseInfo!.phase.name}</span>
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    🎯 Current Phase
                  </span>
                </h3>
                <p class="text-sm opacity-75">
                  {currentPhaseInfo!.phase.description}
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold">
                {currentPhaseInfo!.progress}%
              </div>
              <div class="text-sm opacity-75">Complete</div>
            </div>
          </div>

          {/* Current Phase Progress */}
          <div class="w-full bg-white bg-opacity-50 rounded-full h-3 mb-4">
            <div
              class="bg-current h-3 rounded-full transition-all duration-500"
              style={`width: ${currentPhaseInfo!.progress}%; opacity: 0.8;`}
            ></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="bg-white bg-opacity-60 rounded-lg p-3 text-center">
              <div class="font-bold text-lg">
                {currentPhaseInfo!.totalTasks}
              </div>
              <div>Total Tasks</div>
            </div>
            <div class="bg-white bg-opacity-60 rounded-lg p-3 text-center">
              <div class="font-bold text-lg text-green-700">
                {currentPhaseInfo!.completedTasks}
              </div>
              <div>Completed</div>
            </div>
            <div class="bg-white bg-opacity-60 rounded-lg p-3 text-center">
              <div class="font-bold text-lg text-orange-700">
                {currentPhaseInfo!.incompleteTasks}
              </div>
              <div>Remaining</div>
            </div>
          </div>

          <Show
            when={
              currentPhaseInfo!.phase.tips &&
              currentPhaseInfo!.phase.tips!.length > 0
            }
          >
            <div class="mt-4 pt-4 border-t border-white border-opacity-30">
              <h4 class="font-semibold mb-2">💡 Phase Tips:</h4>
              <div class="space-y-1 text-sm">
                <For each={currentPhaseInfo!.phase.tips!.slice(0, 2)}>
                  {(tip) => (
                    <div class="flex items-start space-x-2">
                      <span class="text-yellow-400 mt-0.5">⭐</span>
                      <span class="opacity-90">{tip}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </Show>

      {/* Timeline Phases Overview */}
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">Planning Phases</h2>
          <div class="text-sm text-gray-600">
            Click phases to view details in Detailed View
          </div>
        </div>

        <For each={phases()}>
          {(phase) => {
            const phaseTodos = categorizedTodos().get(phase.id) || [];
            const progress = getPhaseProgress(phase.id);
            const status = TimelineService.getPhaseStatus(
              phase,
              monthsUntilWedding()
            );

            return (
              <div
                class={`${
                  phase.color
                } border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getStatusBadge(
                  phase
                )}`}
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">{phase.icon}</span>
                    <div>
                      <h3 class="font-semibold text-lg flex items-center space-x-2">
                        <span>{phase.name}</span>
                        <Show when={status === "current"}>
                          <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            🎯 Current
                          </span>
                        </Show>
                        <Show when={status === "overdue"}>
                          <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            ⚠️ Overdue
                          </span>
                        </Show>
                      </h3>
                      <p class="text-sm opacity-75">{phase.description}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium">
                      {phaseTodos.length} tasks
                    </div>
                    <div class="text-xs opacity-75">{progress}% complete</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div class="w-full bg-white bg-opacity-50 rounded-full h-2 mb-3">
                  <div
                    class="bg-current h-2 rounded-full transition-all duration-300"
                    style={`width: ${progress}%; opacity: 0.8;`}
                  ></div>
                </div>

                {/* Status and Timing Info */}
                <div class="flex items-center justify-between text-xs">
                  <span
                    class={`px-2 py-1 rounded-full font-medium capitalize ${
                      status === "current"
                        ? "bg-white bg-opacity-80"
                        : "bg-white bg-opacity-50"
                    }`}
                  >
                    {status === "current"
                      ? "🎯 Focus Here"
                      : status === "past"
                      ? "✅ Phase Complete"
                      : status === "upcoming"
                      ? "⏳ Coming Up"
                      : "⚠️ Behind Schedule"}
                  </span>
                  <div class="opacity-75">
                    {phase.startMonths > 0 &&
                      `${phase.endMonths}-${phase.startMonths} months before`}
                    {phase.startMonths === 0 && "Wedding time!"}
                  </div>
                </div>

                {/* Quick Task Preview for Current/Overdue Phases */}
                <Show
                  when={
                    (status === "current" || status === "overdue") &&
                    phaseTodos.length > 0
                  }
                >
                  <div class="mt-3 pt-3 border-t border-white border-opacity-30">
                    <div class="text-xs opacity-75 mb-2">
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
                          <div class="flex items-center space-x-2 text-xs bg-white bg-opacity-60 rounded px-2 py-1">
                            <span>⭕</span>
                            <span class="flex-1">{todo.text}</span>
                          </div>
                        )}
                      </For>
                      <Show
                        when={
                          phaseTodos.filter((todo) => !todo.completed).length >
                          3
                        }
                      >
                        <div class="text-xs opacity-50 text-center">
                          +
                          {phaseTodos.filter((todo) => !todo.completed).length -
                            3}{" "}
                          more tasks...
                        </div>
                      </Show>
                    </div>
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>

      {/* Next Milestone */}
      <Show when={nextMilestone}>
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🎯</span>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">Next Milestone</h3>
              <p class="text-sm text-gray-700">{nextMilestone!.milestone}</p>
              <p class="text-xs text-gray-600">{nextMilestone!.description}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-blue-600">
                {new Date(nextMilestone!.date).toLocaleDateString()}
              </div>
              <div class="text-xs text-gray-500">
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
      </Show>

      {/* Recommendations */}
      <Show when={timelineInsights().recommendations.length > 0}>
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span class="mr-2">💡</span>
            Recommendations
          </h3>
          <div class="space-y-2">
            <For each={timelineInsights().recommendations}>
              {(recommendation) => (
                <div class="flex items-start space-x-2 text-sm text-gray-700">
                  <span class="text-yellow-500 mt-0.5">⭐</span>
                  <span>{recommendation}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Quick Actions */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group">
            <div class="text-lg mb-1 group-hover:scale-110 transition-transform">
              📋
            </div>
            <div class="font-medium text-gray-900">View Detailed Timeline</div>
            <div class="text-sm text-gray-600">See all phases and tasks</div>
          </button>

          <button class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
            <div class="text-lg mb-1 group-hover:scale-110 transition-transform">
              💡
            </div>
            <div class="font-medium text-gray-900">Get Task Suggestions</div>
            <div class="text-sm text-gray-600">Add recommended tasks</div>
          </button>

          <button class="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group">
            <div class="text-lg mb-1 group-hover:scale-110 transition-transform">
              ✅
            </div>
            <div class="font-medium text-gray-900">Focus Mode</div>
            <div class="text-sm text-gray-600">Show priority tasks only</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineOverview;

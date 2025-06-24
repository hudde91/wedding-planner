import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  onMount,
  onCleanup,
  Show,
  For,
} from "solid-js";
import { WeddingPlan, TodoItem, TodoFormData } from "../../types";
import AIWeddingService from "../../api/AIWeddingService";
import {
  calculateMonthsUntilWedding,
  formatShortDate,
  getWeddingCountdown,
} from "../../utils/date";
import { formatCurrency } from "../../utils/currency";
import { pluralize } from "../../utils/validation";

interface TimelineProps {
  weddingPlan: WeddingPlan;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, todoData: TodoFormData) => void;
  onAddTodo: (text: string) => void;
}

interface AIInsight {
  type: "budget" | "timeline" | "priority" | "risk" | "optimization";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  actionable: boolean;
  suggestedActions?: string[];
}

interface PlanningPhase {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  priority: "critical" | "high" | "medium" | "low";
  tasks: TodoItem[];
  completionRate: number;
  isActive: boolean;
  isOverdue: boolean;
}

const UnifiedTimeline: Component<TimelineProps> = (props) => {
  const [aiAnalysis, setAiAnalysis] = createSignal<any>(null);
  const [planningPhases, setPlanningPhases] = createSignal<PlanningPhase[]>([]);
  const [expandedPhases, setExpandedPhases] = createSignal<Set<string>>(
    new Set()
  );
  const [isAnalyzing, setIsAnalyzing] = createSignal(false);
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [lastAnalysisData, setLastAnalysisData] = createSignal<string>("");

  // Debounced analysis timeout
  let analysisTimeout: NodeJS.Timeout;

  const monthsUntilWedding = createMemo(() => {
    if (!props.weddingPlan.wedding_date) return 0;
    return calculateMonthsUntilWedding(props.weddingPlan.wedding_date);
  });

  const countdown = createMemo(() =>
    getWeddingCountdown(props.weddingPlan.wedding_date || "")
  );

  const overallProgress = createMemo(() => {
    const total = props.weddingPlan.todos.length;
    if (total === 0) return 0;
    const completed = props.weddingPlan.todos.filter((t) => t.completed).length;
    return Math.round((completed / total) * 100);
  });

  const budgetUtilization = createMemo(() => {
    if (props.weddingPlan.budget === 0) return 0;
    const spent = props.weddingPlan.todos
      .filter((todo) => todo.cost)
      .reduce((sum, todo) => sum + (todo.cost || 0), 0);
    return Math.round((spent / props.weddingPlan.budget) * 100);
  });

  onMount(async () => {
    setTimeout(() => setIsLoaded(true), 100);

    // Trigger initial analysis when timeline page loads (if wedding date exists)
    if (props.weddingPlan.wedding_date) {
      const currentHash = weddingPlanHash();
      setLastAnalysisData(currentHash);
      await performAIAnalysis();
    }
  });

  onCleanup(() => {
    if (analysisTimeout) clearTimeout(analysisTimeout);
  });

  // Create a hash of the wedding plan data to detect changes
  const weddingPlanHash = createMemo(() => {
    const data = {
      wedding_date: props.weddingPlan.wedding_date,
      budget: props.weddingPlan.budget,
      todos: props.weddingPlan.todos.map((t) => ({
        id: t.id,
        text: t.text,
        completed: t.completed,
        cost: t.cost,
      })),
      guestCount: props.weddingPlan.guests.length,
    };
    return JSON.stringify(data);
  });

  // Only check for updates when component is visible and data has changed
  createEffect(() => {
    const currentHash = weddingPlanHash();
    const lastHash = lastAnalysisData();

    // Only analyze if:
    // 1. We have a wedding date
    // 2. Data has changed since last analysis
    // 3. We've done at least one analysis before (so this is an update, not initial load)
    if (
      props.weddingPlan.wedding_date &&
      currentHash !== lastHash &&
      lastHash !== ""
    ) {
      // Clear existing timeout
      if (analysisTimeout) clearTimeout(analysisTimeout);

      // Debounce analysis by 1 second
      analysisTimeout = setTimeout(() => {
        performAIAnalysis(currentHash);
      }, 1000);
    }
  });

  const performAIAnalysis = async (dataHash?: string) => {
    if (!props.weddingPlan.wedding_date) return;

    setIsAnalyzing(true);

    try {
      const analysis = await AIWeddingService.analyzeWeddingPlan({
        weddingPlan: props.weddingPlan,
        monthsUntilWedding: monthsUntilWedding(),
      });

      const phases = AIWeddingService.generatePlanningPhases(
        props.weddingPlan,
        monthsUntilWedding()
      );

      setAiAnalysis(analysis);
      setPlanningPhases(phases);

      // Update the hash to prevent unnecessary re-analysis
      if (dataHash) {
        setLastAnalysisData(dataHash);
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
    }
    setIsAnalyzing(false);
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getPhaseStatusColor = (phase: PlanningPhase) => {
    if (phase.isOverdue) return "border-red-300 bg-red-50";
    if (phase.isActive) return "border-blue-300 bg-blue-50";
    if (phase.completionRate === 100) return "border-green-300 bg-green-50";
    return "border-gray-200 bg-white";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80)
      return "bg-gradient-to-r from-green-400 to-emerald-500";
    if (percentage >= 60) return "bg-gradient-to-r from-blue-400 to-cyan-500";
    if (percentage >= 40)
      return "bg-gradient-to-r from-orange-400 to-amber-500";
    return "bg-gradient-to-r from-red-400 to-rose-500";
  };

  return (
    <div class="space-y-8">
      {/* Header Overview */}
      <div
        class={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-gray-50 border border-gray-200 shadow-xl transition-all duration-1000 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="relative z-10 p-8">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h1 class="text-3xl font-light text-gray-900 mb-2 tracking-wide">
                Wedding Planning Timeline
              </h1>
              <p class="text-lg text-gray-600 font-light">
                Your comprehensive planning journey with intelligent insights
              </p>
              <Show when={isAnalyzing()}>
                <div class="flex items-center space-x-2 mt-2 text-sm text-indigo-600">
                  <div class="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span class="font-light">
                    Analyzing your planning progress...
                  </span>
                </div>
              </Show>
            </div>
          </div>

          {/* Wedding Countdown */}
          <Show when={props.weddingPlan.wedding_date}>
            <div class="text-center mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <div class="text-2xl font-light text-gray-900 mb-2">
                {countdown().text}
              </div>
              <div class="text-sm text-gray-600 font-light mb-1">
                {formatShortDate(props.weddingPlan.wedding_date)}
              </div>
              <div class="text-xs text-gray-500">{countdown().subtext}</div>
            </div>
          </Show>

          {/* Key Metrics */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-blue-600"
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
              <div class="text-2xl font-light text-blue-600 mb-1">
                {overallProgress()}%
              </div>
              <div class="text-sm text-gray-600 font-light">
                Overall Progress
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  class={`h-1.5 rounded-full transition-all duration-1000 ${getProgressBarColor(
                    overallProgress()
                  )}`}
                  style={`width: ${overallProgress()}%`}
                ></div>
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-2xl font-light text-green-600 mb-1">
                {budgetUtilization()}%
              </div>
              <div class="text-sm text-gray-600 font-light">Budget Used</div>
              <div class="text-xs text-gray-500 mt-1">
                {formatCurrency(props.weddingPlan.budget)} total
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-2xl font-light text-purple-600 mb-1">
                {props.weddingPlan.guests.length}
              </div>
              <div class="text-sm text-gray-600 font-light">Total Guests</div>
              <div class="text-xs text-gray-500 mt-1">
                {
                  props.weddingPlan.guests.filter(
                    (g) => g.rsvp_status === "attending"
                  ).length
                }{" "}
                attending
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-orange-600"
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
              </div>
              <div class="text-2xl font-light text-orange-600 mb-1">
                {props.weddingPlan.todos.filter((t) => !t.completed).length}
              </div>
              <div class="text-sm text-gray-600 font-light">
                Tasks Remaining
              </div>
              <div class="text-xs text-gray-500 mt-1">
                of {props.weddingPlan.todos.length} total
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <Show when={aiAnalysis() && !isAnalyzing()}>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-5 h-5 text-indigo-600"
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
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">
                      Planning Analysis
                    </h3>
                    <p class="text-sm text-gray-600 font-light">
                      Personalized insights based on your current progress
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-light text-indigo-600">
                    {aiAnalysis()?.overallScore || 0}/100
                  </div>
                  <div class="text-xs text-gray-500 font-light">
                    Planning Score
                  </div>
                </div>
              </div>

              <Show when={aiAnalysis()?.insights?.length > 0}>
                <div class="space-y-3 mb-6">
                  <For each={aiAnalysis()?.insights?.slice(0, 3)}>
                    {(insight: AIInsight) => (
                      <div
                        class={`p-4 rounded-lg border ${getSeverityColor(
                          insight.severity
                        )}`}
                      >
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <h4 class="font-medium mb-1">{insight.title}</h4>
                            <p class="text-sm font-light">{insight.message}</p>
                          </div>
                          <div class="text-xs uppercase tracking-wide font-medium ml-4">
                            {insight.severity}
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>

              <Show when={aiAnalysis()?.recommendations?.length > 0}>
                <div class="border-t border-gray-100 pt-4">
                  <h4 class="font-medium text-gray-900 mb-3">
                    Top Recommendations
                  </h4>
                  <div class="space-y-2">
                    <For each={aiAnalysis()?.recommendations?.slice(0, 3)}>
                      {(recommendation: string) => (
                        <div class="flex items-start space-x-3 text-sm">
                          <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-gray-700 font-light">
                            {recommendation}
                          </span>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          {/* Loading state for analysis */}
          <Show when={isAnalyzing()}>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div class="flex items-center justify-center space-x-3 py-8">
                <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div class="text-gray-600 font-light">
                  Analyzing your wedding planning progress...
                </div>
              </div>
            </div>
          </Show>

          {/* No wedding date message */}
          <Show when={!props.weddingPlan.wedding_date && !isAnalyzing()}>
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-amber-600"
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
                </div>
                <div>
                  <h3 class="text-lg font-medium text-amber-800">
                    Set Your Wedding Date
                  </h3>
                  <p class="text-sm text-amber-700 font-light">
                    Add your wedding date in the Details section to get
                    personalized planning analysis and timeline recommendations.
                  </p>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* Planning Phases */}
      <div
        class={`space-y-6 transition-all duration-1000 delay-400 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-medium text-gray-900">Planning Phases</h2>
          <div class="text-sm text-gray-500 font-light">
            {pluralize(
              planningPhases().filter((p) => p.isActive).length,
              "active phase"
            )}
          </div>
        </div>

        <For each={planningPhases()}>
          {(phase, index) => (
            <div
              class={`rounded-xl border shadow-lg transition-all duration-500 ${getPhaseStatusColor(
                phase
              )}`}
              style={`animation-delay: ${index() * 100}ms`}
            >
              {/* Phase Header */}
              <div
                class="p-6 cursor-pointer hover:bg-black/5 transition-colors"
                onClick={() => togglePhase(phase.id)}
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <svg
                        class="w-6 h-6 text-gray-600"
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
                    <div>
                      <div class="flex items-center space-x-3 mb-1">
                        <h3 class="text-lg font-medium text-gray-900">
                          {phase.name}
                        </h3>
                        <Show when={phase.isActive}>
                          <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Active
                          </span>
                        </Show>
                        <Show when={phase.isOverdue}>
                          <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            Overdue
                          </span>
                        </Show>
                        <Show when={phase.completionRate === 100}>
                          <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Complete
                          </span>
                        </Show>
                      </div>
                      <p class="text-sm text-gray-600 font-light">
                        {phase.description}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {phase.timeframe}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="text-right">
                      <div class="text-sm font-medium text-gray-900">
                        {pluralize(phase.tasks.length, "task")}
                      </div>
                      <div class="text-xs text-gray-500 font-light">
                        {phase.completionRate}% complete
                      </div>
                    </div>
                    <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg
                        class={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                          expandedPhases().has(phase.id) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    class={`h-2 rounded-full transition-all duration-1000 ${getProgressBarColor(
                      phase.completionRate
                    )}`}
                    style={`width: ${phase.completionRate}%`}
                  ></div>
                </div>
              </div>

              {/* Expanded Content */}
              <Show when={expandedPhases().has(phase.id)}>
                <div class="border-t border-gray-100 bg-gray-50/50">
                  <Show
                    when={phase.tasks.length > 0}
                    fallback={
                      <div class="p-12 text-center">
                        <div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <svg
                            class="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5 0h6a2 2 0 002-2V7a2 2 0 00-2-2h-6m1-5v4m0 0v4m0-4h4m-4 0H9m0 0v4"
                            />
                          </svg>
                        </div>
                        <h4 class="text-lg font-medium text-gray-900 mb-2">
                          No tasks in this phase
                        </h4>
                        <p class="text-gray-600 font-light">
                          Add tasks to get started with this planning phase
                        </p>
                      </div>
                    }
                  >
                    <div class="p-6 space-y-4">
                      <For each={phase.tasks}>
                        {(todo) => (
                          <div class="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div class="flex items-center justify-between">
                              <div class="flex items-center space-x-4 flex-1">
                                <div class="relative">
                                  <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => props.onToggleTodo(todo.id)}
                                    class="sr-only"
                                  />
                                  <div
                                    class={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                                      todo.completed
                                        ? "bg-green-500 border-green-500"
                                        : "border-gray-300 hover:border-green-400 bg-white"
                                    }`}
                                    onClick={() => props.onToggleTodo(todo.id)}
                                  >
                                    {todo.completed && (
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
                                  <span
                                    class={`font-medium transition-all duration-300 ${
                                      todo.completed
                                        ? "line-through text-gray-500"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {todo.text}
                                  </span>
                                  <Show when={todo.cost || todo.vendor_name}>
                                    <div class="flex items-center space-x-2 mt-1">
                                      <Show when={todo.vendor_name}>
                                        <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                          {todo.vendor_name}
                                        </span>
                                      </Show>
                                      <Show when={todo.cost}>
                                        <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                          {formatCurrency(todo.cost ?? 0)}
                                        </span>
                                      </Show>
                                    </div>
                                  </Show>
                                </div>
                              </div>
                              <button
                                onClick={() => props.onDeleteTodo(todo.id)}
                                class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                title="Delete task"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default UnifiedTimeline;

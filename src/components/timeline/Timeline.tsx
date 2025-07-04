import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  onMount,
  onCleanup,
} from "solid-js";
import { WeddingPlan, TodoItem, TodoFormData } from "../../types";
import AIWeddingService from "../../api/AIWeddingService";
import {
  calculateMonthsUntilWedding,
  getWeddingCountdown,
} from "../../utils/date";
import TimelineHeader from "./TimelineHeader";
import WeddingCountdown from "./WeddingCountdown";
import KeyMetrics from "./KeyMetrics";
import AIInsights from "./AIInsights";
import AnalyzingState from "./AnalyzingState";
import NoWeddingDateMessage from "./NoWeddingDateMessage";
import PlanningPhasesList from "./PlanningPhasesList";

interface TimelineProps {
  weddingPlan: WeddingPlan;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, todoData: TodoFormData) => void;
  onAddTodo: (text: string) => void;
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

const Timeline: Component<TimelineProps> = (props) => {
  const [aiAnalysis, setAiAnalysis] = createSignal<any>(null);
  const [planningPhases, setPlanningPhases] = createSignal<PlanningPhase[]>([]);
  const [expandedPhases, setExpandedPhases] = createSignal<Set<string>>(
    new Set()
  );
  const [isAnalyzing, setIsAnalyzing] = createSignal(false);

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

  const attendingGuests = createMemo(
    () =>
      props.weddingPlan.guests.filter((g) => g.rsvp_status === "attending")
        .length
  );

  const remainingTasks = createMemo(
    () => props.weddingPlan.todos.filter((t) => !t.completed).length
  );

  onMount(async () => {
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

  return (
    <div class="space-y-6 sm:space-y-8">
      {/* Header Overview */}
      <div class="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-gray-50 border border-gray-200 shadow-xl">
        <div class="relative z-10 p-4 sm:p-6 lg:p-8">
          <TimelineHeader isAnalyzing={isAnalyzing()} />

          <WeddingCountdown
            weddingDate={props.weddingPlan.wedding_date}
            countdown={countdown()}
          />

          <KeyMetrics
            overallProgress={overallProgress()}
            budgetUtilization={budgetUtilization()}
            totalBudget={props.weddingPlan.budget}
            totalGuests={props.weddingPlan.guests.length}
            attendingGuests={attendingGuests()}
            remainingTasks={remainingTasks()}
            totalTasks={props.weddingPlan.todos.length}
          />

          <AIInsights analysis={aiAnalysis()} isAnalyzing={isAnalyzing()} />

          <AnalyzingState isAnalyzing={isAnalyzing()} />

          <NoWeddingDateMessage
            hasWeddingDate={!!props.weddingPlan.wedding_date}
            isAnalyzing={isAnalyzing()}
          />
        </div>
      </div>

      {/* Planning Phases */}
      <PlanningPhasesList
        phases={planningPhases()}
        expandedPhases={expandedPhases()}
        onTogglePhase={togglePhase}
        onToggleTodo={props.onToggleTodo}
        onDeleteTodo={props.onDeleteTodo}
      />
    </div>
  );
};

export default Timeline;

// AI Wedding Analysis Service
// Provides intelligent analysis and recommendations for wedding planning
// Can use OpenAI API or intelligent simulation for demo purposes

import { TodoItem, WeddingPlan } from "../types";

interface AIAnalysisRequest {
  weddingPlan: WeddingPlan;
  monthsUntilWedding: number;
}

interface AIInsight {
  type: "budget" | "timeline" | "priority" | "risk" | "optimization";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  actionable: boolean;
  suggestedActions?: string[];
}

interface AIAnalysisResponse {
  overallScore: number; // 0-100
  insights: AIInsight[];
  recommendations: string[];
  priorityTasks: string[];
  budgetAnalysis: {
    riskLevel: "low" | "medium" | "high";
    projectedTotal: number;
    savings: string[];
  };
  timelineAnalysis: {
    onTrack: boolean;
    criticalPath: string[];
    bufferDays: number;
  };
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

class AIWeddingService {
  private apiKey: string | null = null;
  private baseUrl = "https://api.openai.com/v1";

  constructor() {
    // In a real app, you'd get this from environment variables
    // For demo purposes, we'll simulate AI responses
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
  }

  /**
   * Analyze wedding plan using AI
   */
  async analyzeWeddingPlan(
    request: AIAnalysisRequest
  ): Promise<AIAnalysisResponse> {
    debugger;
    if (this.apiKey) {
      return this.performRealAIAnalysis(request);
    } else {
      // Fallback to intelligent simulation for demo
      return this.performIntelligentSimulation(request);
    }
  }

  /**
   * Real OpenAI API integration
   */
  private async performRealAIAnalysis(
    request: AIAnalysisRequest
  ): Promise<AIAnalysisResponse> {
    try {
      const prompt = this.buildAnalysisPrompt(request);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional wedding planning consultant with expertise in budget management, timeline optimization, and risk assessment. Provide specific, actionable advice.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      console.log("AI analysis response:", data);

      return await this.parseAIResponse(
        data.choices[0].message.content,
        request
      );
    } catch (error) {
      console.error("AI analysis failed, falling back to simulation:", error);
      return this.performIntelligentSimulation(request);
    }
  }

  /**
   * Intelligent simulation that provides realistic analysis
   */
  private performIntelligentSimulation(
    request: AIAnalysisRequest
  ): Promise<AIAnalysisResponse> {
    const { weddingPlan, monthsUntilWedding } = request;
    const insights: AIInsight[] = [];
    const recommendations: string[] = [];

    // Budget Analysis
    const totalBudgetUsed = weddingPlan.todos
      .filter((todo) => todo.cost)
      .reduce((sum, todo) => sum + (todo.cost || 0), 0);

    const budgetUtilization =
      weddingPlan.budget > 0 ? (totalBudgetUsed / weddingPlan.budget) * 100 : 0;

    if (budgetUtilization > 90) {
      insights.push({
        type: "budget",
        title: "Budget Alert",
        message: `You've allocated ${budgetUtilization.toFixed(
          0
        )}% of your budget. Consider reviewing remaining expenses.`,
        severity: "high",
        actionable: true,
        suggestedActions: [
          "Review remaining vendor contracts",
          "Look for cost optimization opportunities",
        ],
      });
    }

    // Timeline Analysis
    const totalTasks = weddingPlan.todos.length;
    const completedTasks = weddingPlan.todos.filter((t) => t.completed).length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const expectedCompletionRate = Math.max(
      0,
      ((12 - monthsUntilWedding) / 12) * 100
    );

    if (completionRate < expectedCompletionRate - 20) {
      insights.push({
        type: "timeline",
        title: "Timeline Concern",
        message: `Task completion is behind schedule. Expected ${expectedCompletionRate.toFixed(
          0
        )}%, actual ${completionRate.toFixed(0)}%.`,
        severity: monthsUntilWedding < 3 ? "critical" : "medium",
        actionable: true,
        suggestedActions: [
          "Prioritize critical tasks",
          "Consider hiring additional help",
        ],
      });
    }

    // Priority Analysis
    const criticalTasks = this.identifyCriticalTasks(weddingPlan.todos);
    const incompleteCriticalTasks = criticalTasks.filter(
      (task) => !task.completed
    );

    if (incompleteCriticalTasks.length > 0 && monthsUntilWedding < 6) {
      insights.push({
        type: "priority",
        title: "Critical Tasks Pending",
        message: `${incompleteCriticalTasks.length} high-priority tasks need immediate attention.`,
        severity: monthsUntilWedding < 2 ? "critical" : "high",
        actionable: true,
        suggestedActions: incompleteCriticalTasks
          .slice(0, 3)
          .map((task) => `Complete: ${task.text}`),
      });
    }

    // Generate recommendations
    if (monthsUntilWedding < 1) {
      recommendations.push("Focus only on essential tasks for the final month");
      recommendations.push("Delegate non-critical tasks to family and friends");
    } else if (monthsUntilWedding < 3) {
      recommendations.push("Finalize all vendor contracts and confirmations");
      recommendations.push("Begin detailed day-of timeline planning");
    } else if (monthsUntilWedding < 6) {
      recommendations.push("Book remaining vendors and confirm major details");
      recommendations.push("Start planning guest accommodations and logistics");
    }

    const overallScore = this.calculateOverallScore(
      weddingPlan,
      monthsUntilWedding
    );

    return Promise.resolve({
      overallScore,
      insights,
      recommendations,
      priorityTasks: incompleteCriticalTasks
        .slice(0, 5)
        .map((task) => task.text),
      budgetAnalysis: {
        riskLevel:
          budgetUtilization > 90
            ? "high"
            : budgetUtilization > 75
            ? "medium"
            : "low",
        projectedTotal: this.projectFinalBudget(weddingPlan),
        savings: this.generateSavingsSuggestions(weddingPlan),
      },
      timelineAnalysis: {
        onTrack: completionRate >= expectedCompletionRate - 10,
        criticalPath: this.identifyCriticalPath(
          weddingPlan.todos,
          monthsUntilWedding
        ),
        bufferDays: Math.max(
          0,
          monthsUntilWedding * 30 - incompleteCriticalTasks.length * 3
        ),
      },
    });
  }

  /**
   * Generate organized planning phases based on task completion, not time
   */
  generatePlanningPhases(
    weddingPlan: WeddingPlan,
    monthsUntilWedding: number
  ): PlanningPhase[] {
    const phases: PlanningPhase[] = [
      {
        id: "foundation",
        name: "Foundation & Major Bookings",
        description: "Essential decisions and major vendor bookings",
        timeframe: "8-12 months before",
        priority: "critical",
        tasks: [],
        completionRate: 0,
        isActive: false,
        isOverdue: false,
      },
      {
        id: "planning",
        name: "Detailed Planning",
        description: "Menu, decorations, and specific arrangements",
        timeframe: "4-8 months before",
        priority: "high",
        tasks: [],
        completionRate: 0,
        isActive: false,
        isOverdue: false,
      },
      {
        id: "coordination",
        name: "Coordination & Logistics",
        description: "Timeline, seating, and final confirmations",
        timeframe: "1-4 months before",
        priority: "high",
        tasks: [],
        completionRate: 0,
        isActive: false,
        isOverdue: false,
      },
      {
        id: "final",
        name: "Final Preparations",
        description: "Last-minute details and day-of preparation",
        timeframe: "Final month",
        priority: "critical",
        tasks: [],
        completionRate: 0,
        isActive: false,
        isOverdue: false,
      },
    ];

    // Categorize tasks into phases based on content and urgency
    weddingPlan.todos.forEach((todo) => {
      const phase = this.categorizeTask(todo, monthsUntilWedding);
      const phaseIndex = phases.findIndex((p) => p.id === phase);
      if (phaseIndex !== -1) {
        phases[phaseIndex].tasks.push(todo);
      }
    });

    // Calculate completion rates and active status
    phases.forEach((phase) => {
      if (phase.tasks.length > 0) {
        const completed = phase.tasks.filter((task) => task.completed).length;
        phase.completionRate = Math.round(
          (completed / phase.tasks.length) * 100
        );

        // A phase is active if it has incomplete tasks and should be worked on now
        const hasIncompleteTasks = phase.tasks.some((task) => !task.completed);
        phase.isActive =
          hasIncompleteTasks &&
          this.shouldPhaseBeActive(phase.id, monthsUntilWedding);

        // A phase is overdue if it should be complete but isn't
        phase.isOverdue =
          hasIncompleteTasks &&
          this.isPhaseOverdue(phase.id, monthsUntilWedding);
      }
    });

    return phases;
  }

  private buildAnalysisPrompt(request: AIAnalysisRequest): string {
    const { weddingPlan, monthsUntilWedding } = request;

    return `Analyze this wedding plan and provide specific recommendations:

Wedding Date: ${monthsUntilWedding} months away
Budget: $${weddingPlan.budget}
Total Tasks: ${weddingPlan.todos.length}
Completed Tasks: ${weddingPlan.todos.filter((t) => t.completed).length}
Guest Count: ${weddingPlan.guests.length}

Tasks:
${weddingPlan.todos
  .map(
    (todo) =>
      `- ${todo.text} (${todo.completed ? "DONE" : "PENDING"}${
        todo.cost ? `, $${todo.cost}` : ""
      })`
  )
  .join("\n")}

Please provide:
1. Overall planning score (0-100)
2. Top 3 priority concerns
3. Budget analysis and risk assessment
4. Timeline recommendations
5. Specific next steps

Format as JSON with clear, actionable advice.`;
  }

  private async parseAIResponse(
    content: string,
    request: AIAnalysisRequest
  ): Promise<AIAnalysisResponse> {
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // Fallback if AI doesn't return valid JSON
      return await this.performIntelligentSimulation(request);
    }
  }

  private identifyCriticalTasks(todos: TodoItem[]): TodoItem[] {
    const criticalKeywords = [
      "venue",
      "photographer",
      "catering",
      "dress",
      "suit",
      "license",
      "officiant",
    ];
    return todos.filter((todo) =>
      criticalKeywords.some((keyword) =>
        todo.text.toLowerCase().includes(keyword)
      )
    );
  }

  private calculateOverallScore(
    weddingPlan: WeddingPlan,
    monthsUntilWedding: number
  ): number {
    let score = 50; // Base score

    // Task completion score (40 points max)
    const completionRate =
      weddingPlan.todos.length > 0
        ? (weddingPlan.todos.filter((t) => t.completed).length /
            weddingPlan.todos.length) *
          100
        : 0;
    score += (completionRate / 100) * 40;

    // Timeline score (30 points max)
    const expectedProgress = Math.max(
      0,
      ((12 - monthsUntilWedding) / 12) * 100
    );
    const timelineScore = Math.min(
      100,
      (completionRate / Math.max(expectedProgress, 20)) * 100
    );
    score += (timelineScore / 100) * 30;

    // Budget score (20 points max)
    const budgetUsed = weddingPlan.todos.reduce(
      (sum, todo) => sum + (todo.cost || 0),
      0
    );
    const budgetScore =
      weddingPlan.budget > 0 && budgetUsed <= weddingPlan.budget ? 20 : 10;
    score += budgetScore;

    // Critical tasks score (10 points max)
    const criticalTasks = this.identifyCriticalTasks(weddingPlan.todos);
    const criticalCompleted = criticalTasks.filter((t) => t.completed).length;
    const criticalScore =
      criticalTasks.length > 0
        ? (criticalCompleted / criticalTasks.length) * 10
        : 10;
    score += criticalScore;

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private projectFinalBudget(weddingPlan: WeddingPlan): number {
    const currentSpent = weddingPlan.todos.reduce(
      (sum, todo) => sum + (todo.cost || 0),
      0
    );
    const incompleteTasks = weddingPlan.todos.filter(
      (todo) => !todo.completed && !todo.cost
    ).length;
    const averageTaskCost = 500; // Estimate for unpriced tasks

    return currentSpent + incompleteTasks * averageTaskCost;
  }

  private generateSavingsSuggestions(weddingPlan: WeddingPlan): string[] {
    const suggestions = [
      "Consider off-peak wedding dates for vendor discounts",
      "Bundle services with vendors for package pricing",
      "DIY decorations and favors where possible",
      "Limit bar service hours or offer signature cocktails only",
    ];

    return suggestions.slice(0, 3);
  }

  private identifyCriticalPath(
    todos: TodoItem[],
    monthsUntilWedding: number
  ): string[] {
    return this.identifyCriticalTasks(todos)
      .filter((task) => !task.completed)
      .slice(0, 5)
      .map((task) => task.text);
  }

  private categorizeTask(todo: TodoItem, monthsUntilWedding: number): string {
    const text = todo.text.toLowerCase();

    // Foundation phase - critical early tasks
    if (
      text.includes("venue") ||
      text.includes("photographer") ||
      text.includes("catering") ||
      text.includes("budget") ||
      text.includes("guest list")
    ) {
      return "foundation";
    }

    // Final phase - last minute tasks
    if (
      text.includes("license") ||
      text.includes("rehearsal") ||
      text.includes("pack") ||
      text.includes("confirm") ||
      text.includes("final")
    ) {
      return "final";
    }

    // Coordination phase - logistics and timeline
    if (
      text.includes("seating") ||
      text.includes("timeline") ||
      text.includes("transportation") ||
      text.includes("hotel") ||
      text.includes("coordinate")
    ) {
      return "coordination";
    }

    // Everything else goes to planning
    return "planning";
  }

  private shouldPhaseBeActive(
    phaseId: string,
    monthsUntilWedding: number
  ): boolean {
    switch (phaseId) {
      case "foundation":
        return monthsUntilWedding > 4;
      case "planning":
        return monthsUntilWedding > 2 && monthsUntilWedding <= 8;
      case "coordination":
        return monthsUntilWedding > 0.5 && monthsUntilWedding <= 4;
      case "final":
        return monthsUntilWedding <= 1;
      default:
        return false;
    }
  }

  private isPhaseOverdue(phaseId: string, monthsUntilWedding: number): boolean {
    switch (phaseId) {
      case "foundation":
        return monthsUntilWedding < 4;
      case "planning":
        return monthsUntilWedding < 2;
      case "coordination":
        return monthsUntilWedding < 0.5;
      case "final":
        return monthsUntilWedding < 0;
      default:
        return false;
    }
  }
}

export default new AIWeddingService();

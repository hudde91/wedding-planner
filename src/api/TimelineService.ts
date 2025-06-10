import { TodoItem } from "../types";

export interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  startMonths: number; // Months before wedding (12 = 12 months before)
  endMonths: number; // Months before wedding (6 = 6 months before)
  color: string;
  icon: string;
  priority: "high" | "medium" | "low";
  tips?: string[];
}

export interface TimelineTodo extends TodoItem {
  timelinePhase?: string; // Reference to TimelinePhase.id
  recommendedMonths?: number; // Recommended months before wedding
  isTimelineSuggestion?: boolean; // Auto-suggested vs user-created
  urgency?: "low" | "medium" | "high" | "critical";
}

interface DefaultTask {
  text: string;
  phase: string;
  months: number;
  urgency?: "low" | "medium" | "high" | "critical";
  tips?: string;
}

class TimelineService {
  // Wedding planning phases with detailed information
  private static phases: TimelinePhase[] = [
    {
      id: "planning-start",
      name: "12+ Months Before",
      description: "Big decisions and initial bookings",
      startMonths: 18,
      endMonths: 12,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      icon: "🎯",
      priority: "high",
      tips: [
        "Book your venue as early as possible - popular venues fill up fast",
        "Set your budget before making any major decisions",
        "Start your guest list to determine venue size needs",
      ],
    },
    {
      id: "major-planning",
      name: "6-12 Months Before",
      description: "Major vendors and key decisions",
      startMonths: 12,
      endMonths: 6,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "📋",
      priority: "high",
      tips: [
        "Book major vendors (photographer, caterer, florist)",
        "Order your wedding dress - alterations take time",
        "Send save-the-dates so guests can plan ahead",
      ],
    },
    {
      id: "detail-planning",
      name: "3-6 Months Before",
      description: "Detailed planning and smaller vendors",
      startMonths: 6,
      endMonths: 3,
      color: "bg-green-50 border-green-200 text-green-800",
      icon: "✅",
      priority: "medium",
      tips: [
        "Finalize menu and cake details",
        "Book honeymoon and plan time off work",
        "Order invitations and plan wording",
      ],
    },
    {
      id: "final-details",
      name: "1-3 Months Before",
      description: "Invitations and final confirmations",
      startMonths: 3,
      endMonths: 1,
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: "⚡",
      priority: "medium",
      tips: [
        "Send invitations 6-8 weeks before wedding",
        "Confirm details with all vendors",
        "Start final dress fittings",
      ],
    },
    {
      id: "final-countdown",
      name: "Final Month",
      description: "Last-minute preparations and confirmations",
      startMonths: 1,
      endMonths: 0.25,
      color: "bg-orange-50 border-orange-200 text-orange-800",
      icon: "🏃‍♀️",
      priority: "high",
      tips: [
        "Confirm final guest count with caterer",
        "Create detailed day-of timeline",
        "Delegate tasks to wedding party",
      ],
    },
    {
      id: "wedding-week",
      name: "Wedding Week",
      description: "Final preparations and day-of coordination",
      startMonths: 0.25,
      endMonths: -0.1,
      color: "bg-pink-50 border-pink-200 text-pink-800",
      icon: "💒",
      priority: "high",
      tips: [
        "Confirm all vendor arrival times",
        "Prepare wedding emergency kit",
        "Delegate day-of responsibilities",
      ],
    },
  ];

  // Comprehensive wedding planning tasks with detailed information
  private static defaultTasks: DefaultTask[] = [
    // 12+ Months Before - Foundation Phase
    {
      text: "Set wedding date and book venue",
      phase: "planning-start",
      months: 14,
      urgency: "critical",
      tips: "Popular venues book 12-18 months in advance. Have 2-3 backup dates ready.",
    },
    {
      text: "Determine overall wedding budget",
      phase: "planning-start",
      months: 14,
      urgency: "critical",
      tips: "Allocate: 40-50% venue/catering, 10-15% photography, 8-10% flowers/decor.",
    },
    {
      text: "Create preliminary guest list",
      phase: "planning-start",
      months: 13,
      urgency: "high",
      tips: "Start with immediate family and close friends. Venue capacity will determine final size.",
    },
    {
      text: "Book wedding photographer",
      phase: "planning-start",
      months: 12,
      urgency: "critical",
      tips: "Top photographers book earliest. View full wedding galleries, not just highlights.",
    },
    {
      text: "Book wedding videographer",
      phase: "planning-start",
      months: 12,
      urgency: "high",
      tips: "Many couples regret not having video. Book early for package deals with photographer.",
    },
    {
      text: "Choose wedding party",
      phase: "planning-start",
      months: 11,
      urgency: "medium",
      tips: "Consider logistics and costs for your wedding party. Smaller parties are easier to coordinate.",
    },
    {
      text: "Start dress shopping",
      phase: "planning-start",
      months: 11,
      urgency: "high",
      tips: "Dresses can take 6+ months to arrive, plus time for alterations.",
    },

    // 6-12 Months Before - Major Planning Phase
    {
      text: "Order wedding dress",
      phase: "major-planning",
      months: 9,
      urgency: "critical",
      tips: "Order by this deadline to allow time for shipping and alterations.",
    },
    {
      text: "Book caterer and finalize menu",
      phase: "major-planning",
      months: 8,
      urgency: "critical",
      tips: "Popular caterers book early. Schedule tastings and consider dietary restrictions.",
    },
    {
      text: "Book wedding florist",
      phase: "major-planning",
      months: 8,
      urgency: "high",
      tips: "Discuss seasonal flower availability and budget for ceremony vs reception flowers.",
    },
    {
      text: "Book wedding band or DJ",
      phase: "major-planning",
      months: 8,
      urgency: "high",
      tips: "Good entertainment books early. Ask for videos of actual weddings, not just demo reels.",
    },
    {
      text: "Send save-the-dates",
      phase: "major-planning",
      months: 7,
      urgency: "medium",
      tips: "Include wedding website URL. Send earlier for destination weddings (8-12 months).",
    },
    {
      text: "Book wedding transportation",
      phase: "major-planning",
      months: 7,
      urgency: "medium",
      tips: "Consider guest transportation from hotels. Book luxury cars early for popular dates.",
    },
    {
      text: "Choose and order wedding rings",
      phase: "major-planning",
      months: 6,
      urgency: "high",
      tips: "Custom rings need more time. Consider ring insurance and sizing.",
    },
    {
      text: "Book wedding officiant",
      phase: "major-planning",
      months: 6,
      urgency: "high",
      tips: "Popular officiants book early. Discuss ceremony style and any requirements.",
    },

    // 3-6 Months Before - Detail Planning Phase
    {
      text: "Order wedding cake",
      phase: "detail-planning",
      months: 5,
      urgency: "high",
      tips: "Schedule tastings. Consider groom's cake and dietary restrictions.",
    },
    {
      text: "Plan and book honeymoon",
      phase: "detail-planning",
      months: 5,
      urgency: "medium",
      tips: "Popular destinations book early. Check passport expiration dates.",
    },
    {
      text: "Register for wedding gifts",
      phase: "detail-planning",
      months: 4,
      urgency: "medium",
      tips: "Register at 2-3 stores with different price points. Include gift cards option.",
    },
    {
      text: "Order wedding invitations",
      phase: "detail-planning",
      months: 4,
      urgency: "high",
      tips: "Allow time for proofing and printing. Order 10-20% extra for keepsakes.",
    },
    {
      text: "Schedule engagement party",
      phase: "detail-planning",
      months: 4,
      urgency: "low",
      tips: "Optional celebration. Keep it simple if wedding planning is intensive.",
    },
    {
      text: "Book hair and makeup artists",
      phase: "detail-planning",
      months: 4,
      urgency: "high",
      tips: "Schedule trial runs. Consider timing for wedding party services.",
    },
    {
      text: "Plan bachelor/bachelorette parties",
      phase: "detail-planning",
      months: 3,
      urgency: "low",
      tips: "Coordinate with wedding party schedules. Plan 2-4 weeks before wedding.",
    },

    // 1-3 Months Before - Final Details Phase
    {
      text: "Send wedding invitations",
      phase: "final-details",
      months: 2,
      urgency: "critical",
      tips: "Mail 6-8 weeks before wedding. Include RSVP deadline 3-4 weeks before.",
    },
    {
      text: "Schedule dress fittings",
      phase: "final-details",
      months: 2,
      urgency: "high",
      tips: "Plan 2-3 fittings. Bring your actual wedding shoes and undergarments.",
    },
    {
      text: "Order wedding party attire",
      phase: "final-details",
      months: 2,
      urgency: "high",
      tips: "Coordinate colors and styles. Allow time for alterations.",
    },
    {
      text: "Plan rehearsal dinner",
      phase: "final-details",
      months: 2,
      urgency: "medium",
      tips: "Include wedding party, immediate family, and out-of-town guests.",
    },
    {
      text: "Apply for marriage license",
      phase: "final-details",
      months: 1,
      urgency: "critical",
      tips: "Check local requirements for timing and documentation needed.",
    },
    {
      text: "Finalize guest count with vendors",
      phase: "final-details",
      months: 1,
      urgency: "critical",
      tips: "Most vendors need final count 1-2 weeks before wedding.",
    },

    // Final Month - Countdown Phase
    {
      text: "Confirm all vendor details and timing",
      phase: "final-countdown",
      months: 0.75,
      urgency: "critical",
      tips: "Create detailed timeline and share with all vendors.",
    },
    {
      text: "Create final seating chart",
      phase: "final-countdown",
      months: 0.5,
      urgency: "high",
      tips: "Use your wedding planner app! Consider family dynamics and friendships.",
    },
    {
      text: "Prepare wedding favors",
      phase: "final-countdown",
      months: 0.5,
      urgency: "low",
      tips: "Optional. Simple and personal favors work best.",
    },
    {
      text: "Pack for honeymoon",
      phase: "final-countdown",
      months: 0.3,
      urgency: "medium",
      tips: "Check weather forecasts and activities. Pack essentials in carry-on.",
    },
    {
      text: "Prepare wedding emergency kit",
      phase: "final-countdown",
      months: 0.3,
      urgency: "medium",
      tips: "Include stain remover, safety pins, tissues, pain reliever, snacks.",
    },
    {
      text: "Write wedding vows",
      phase: "final-countdown",
      months: 0.25,
      urgency: "high",
      tips: "Keep them personal but not too long. Practice reading them aloud.",
    },

    // Wedding Week - Final Phase
    {
      text: "Rehearsal and rehearsal dinner",
      phase: "wedding-week",
      months: 0.15,
      urgency: "critical",
      tips: "Practice ceremony timing. Keep rehearsal dinner relaxed and fun.",
    },
    {
      text: "Final venue walkthrough",
      phase: "wedding-week",
      months: 0.1,
      urgency: "high",
      tips: "Confirm setup details and emergency plans with venue coordinator.",
    },
    {
      text: "Delegate day-of responsibilities",
      phase: "wedding-week",
      months: 0.05,
      urgency: "high",
      tips: "Assign specific people to handle vendor questions and timeline.",
    },
    {
      text: "Wedding day!",
      phase: "wedding-week",
      months: 0,
      urgency: "critical",
      tips: "Relax and enjoy your special day! Trust your planning and team.",
    },
  ];

  // Additional seasonal and style-specific tasks
  private static seasonalTasks: Record<string, DefaultTask[]> = {
    spring: [
      {
        text: "Consider allergy medications for outdoor ceremony",
        phase: "final-countdown",
        months: 0.5,
      },
      {
        text: "Plan for spring weather backup (rain plan)",
        phase: "detail-planning",
        months: 3,
      },
    ],
    summer: [
      {
        text: "Plan heat management (fans, shade, cold drinks)",
        phase: "detail-planning",
        months: 3,
      },
      {
        text: "Consider earlier ceremony time to avoid heat",
        phase: "major-planning",
        months: 6,
      },
    ],
    fall: [
      {
        text: "Book venues early - popular season",
        phase: "planning-start",
        months: 15,
      },
      {
        text: "Consider seasonal flowers and colors",
        phase: "major-planning",
        months: 8,
      },
    ],
    winter: [
      {
        text: "Plan for winter weather contingencies",
        phase: "detail-planning",
        months: 3,
      },
      {
        text: "Consider guest travel difficulties",
        phase: "final-details",
        months: 2,
      },
    ],
  };

  /**
   * Get all wedding planning phases
   */
  static getPhases(): TimelinePhase[] {
    return this.phases;
  }

  /**
   * Get a specific phase by ID
   */
  static getPhaseById(id: string): TimelinePhase | undefined {
    return this.phases.find((phase) => phase.id === id);
  }

  /**
   * Categorize existing todos into timeline phases
   */
  static categorizeExistingTodos(todos: TodoItem[]): Map<string, TodoItem[]> {
    const categorized = new Map<string, TodoItem[]>();

    // Initialize all phases with empty arrays
    this.phases.forEach((phase) => {
      categorized.set(phase.id, []);
    });

    // Add uncategorized phase for todos that don't fit
    categorized.set("uncategorized", []);

    todos.forEach((todo) => {
      const phase = this.suggestPhaseForTodo(todo.text);
      const existingTodos = categorized.get(phase.id) || [];
      categorized.set(phase.id, [...existingTodos, todo]);
    });

    return categorized;
  }

  /**
   * Suggest the most appropriate phase for a todo based on its text
   */
  static suggestPhaseForTodo(todoText: string): TimelinePhase {
    const text = todoText.toLowerCase().trim();

    // High-priority early tasks
    const planningStartKeywords = [
      "venue",
      "date",
      "budget",
      "photographer",
      "videographer",
      "guest list",
      "wedding party",
      "dress shopping",
      "location",
      "church",
      "hall",
    ];

    // Major vendor and planning tasks
    const majorPlanningKeywords = [
      "dress",
      "gown",
      "caterer",
      "catering",
      "menu",
      "florist",
      "flowers",
      "dj",
      "band",
      "music",
      "save the date",
      "transportation",
      "rings",
      "officiant",
      "priest",
      "minister",
      "pastor",
    ];

    // Detailed planning tasks
    const detailPlanningKeywords = [
      "cake",
      "honeymoon",
      "registry",
      "gifts",
      "invitation",
      "invitations",
      "engagement party",
      "hair",
      "makeup",
      "bachelor",
      "bachelorette",
    ];

    // Final preparation tasks
    const finalDetailsKeywords = [
      "send invitation",
      "mail invitation",
      "fitting",
      "alterations",
      "wedding party attire",
      "rehearsal dinner",
      "marriage license",
      "guest count",
      "rsvp",
      "final count",
    ];

    // Last-minute tasks
    const finalCountdownKeywords = [
      "confirm",
      "seating chart",
      "seating",
      "favors",
      "pack",
      "honeymoon pack",
      "emergency kit",
      "vows",
      "timeline",
      "day of",
    ];

    // Wedding week tasks
    const weddingWeekKeywords = [
      "rehearsal",
      "walkthrough",
      "wedding day",
      "ceremony",
      "reception",
      "delegate",
      "day-of",
      "final check",
    ];

    // Check each phase in order of specificity
    if (weddingWeekKeywords.some((keyword) => text.includes(keyword))) {
      return this.phases.find((p) => p.id === "wedding-week") || this.phases[0];
    }

    if (finalCountdownKeywords.some((keyword) => text.includes(keyword))) {
      return (
        this.phases.find((p) => p.id === "final-countdown") || this.phases[0]
      );
    }

    if (finalDetailsKeywords.some((keyword) => text.includes(keyword))) {
      return (
        this.phases.find((p) => p.id === "final-details") || this.phases[0]
      );
    }

    if (detailPlanningKeywords.some((keyword) => text.includes(keyword))) {
      return (
        this.phases.find((p) => p.id === "detail-planning") || this.phases[0]
      );
    }

    if (majorPlanningKeywords.some((keyword) => text.includes(keyword))) {
      return (
        this.phases.find((p) => p.id === "major-planning") || this.phases[0]
      );
    }

    if (planningStartKeywords.some((keyword) => text.includes(keyword))) {
      return (
        this.phases.find((p) => p.id === "planning-start") || this.phases[0]
      );
    }

    // Default to major planning phase
    return this.phases.find((p) => p.id === "major-planning") || this.phases[0];
  }

  /**
   * Generate suggested todos based on wedding date and existing todos
   */
  static generateSuggestedTodos(
    weddingDate: string,
    existingTodos: TodoItem[]
  ): TimelineTodo[] {
    if (!weddingDate) return [];

    const existingTexts = new Set(
      existingTodos.map((todo) => todo.text.toLowerCase().trim())
    );

    const suggestions: TimelineTodo[] = [];
    const monthsUntil = this.calculateMonthsUntilWedding(weddingDate);

    // Add seasonal tasks based on wedding date
    const season = this.getWeddingSeason(weddingDate);
    const seasonalTasksForSeason = this.seasonalTasks[season] || [];
    const allTasks = [...this.defaultTasks, ...seasonalTasksForSeason];

    allTasks.forEach((task, index) => {
      const taskTextLower = task.text.toLowerCase().trim();

      // Skip if task already exists
      if (existingTexts.has(taskTextLower)) {
        return;
      }

      // Skip if similar task exists (fuzzy matching)
      const similarExists = Array.from(existingTexts).some((existingText) => {
        return this.calculateSimilarity(taskTextLower, existingText) > 0.7;
      });

      if (similarExists) {
        return;
      }

      // Determine urgency based on timing
      let urgency: "low" | "medium" | "high" | "critical" =
        task.urgency || "medium";
      if (monthsUntil <= task.months && monthsUntil > task.months - 1) {
        urgency = "critical"; // Task is due now
      } else if (monthsUntil <= task.months + 1) {
        urgency = "high"; // Task is due soon
      }

      suggestions.push({
        id: Date.now() + index + Math.random(), // Ensure unique ID
        text: task.text,
        completed: false,
        timelinePhase: task.phase,
        recommendedMonths: task.months,
        isTimelineSuggestion: true,
        urgency: urgency,
      });
    });

    // Sort suggestions by urgency and timing
    return suggestions.sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aUrgency = urgencyOrder[a.urgency || "medium"];
      const bUrgency = urgencyOrder[b.urgency || "medium"];

      if (aUrgency !== bUrgency) {
        return bUrgency - aUrgency; // Higher urgency first
      }

      // Then sort by timing (tasks due sooner first)
      const aMonths = a.recommendedMonths || 0;
      const bMonths = b.recommendedMonths || 0;
      return Math.abs(monthsUntil - aMonths) - Math.abs(monthsUntil - bMonths);
    });
  }

  /**
   * Calculate months until wedding date
   */
  static calculateMonthsUntilWedding(weddingDate: string): number {
    if (!weddingDate) return 0;

    try {
      const wedding = new Date(weddingDate);
      const now = new Date();

      // Calculate difference in months more accurately
      const yearDiff = wedding.getFullYear() - now.getFullYear();
      const monthDiff = wedding.getMonth() - now.getMonth();
      const dayDiff = wedding.getDate() - now.getDate();

      let totalMonths = yearDiff * 12 + monthDiff;

      // Adjust for partial months
      if (dayDiff < 0) {
        totalMonths -= 0.5;
      } else if (dayDiff > 15) {
        totalMonths += 0.5;
      }

      return Math.max(0, totalMonths);
    } catch (error) {
      console.error("Error calculating months until wedding:", error);
      return 0;
    }
  }

  /**
   * Get the current status of a phase based on wedding timing
   */
  static getPhaseStatus(
    phase: TimelinePhase,
    monthsUntilWedding: number
  ): "upcoming" | "current" | "past" | "overdue" {
    if (monthsUntilWedding > phase.startMonths) {
      return "upcoming";
    } else if (monthsUntilWedding >= phase.endMonths) {
      return "current";
    } else if (monthsUntilWedding >= 0) {
      return "past";
    } else {
      return "overdue";
    }
  }

  /**
   * Get wedding season from date
   */
  private static getWeddingSeason(weddingDate: string): string {
    try {
      const date = new Date(weddingDate);
      const month = date.getMonth(); // 0-11

      if (month >= 2 && month <= 4) return "spring"; // Mar-May
      if (month >= 5 && month <= 7) return "summer"; // Jun-Aug
      if (month >= 8 && month <= 10) return "fall"; // Sep-Nov
      return "winter"; // Dec-Feb
    } catch {
      return "spring";
    }
  }

  /**
   * Calculate text similarity for fuzzy matching
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(" ").filter((w) => w.length > 2);
    const words2 = str2.split(" ").filter((w) => w.length > 2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const commonWords = words1.filter((word) =>
      words2.some((word2) => word.includes(word2) || word2.includes(word))
    );

    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Get tasks that are overdue based on current timing
   */
  static getOverdueTasks(todos: TodoItem[], weddingDate: string): TodoItem[] {
    if (!weddingDate) return [];

    const monthsUntil = this.calculateMonthsUntilWedding(weddingDate);
    const categorized = this.categorizeExistingTodos(todos);
    const overdue: TodoItem[] = [];

    this.phases.forEach((phase) => {
      const status = this.getPhaseStatus(phase, monthsUntil);
      if (status === "past" || status === "overdue") {
        const phaseTodos = categorized.get(phase.id) || [];
        const incompleteTodos = phaseTodos.filter((todo) => !todo.completed);
        overdue.push(...incompleteTodos);
      }
    });

    return overdue;
  }

  /**
   * Get current priority tasks based on timeline
   */
  static getCurrentPriorityTasks(
    todos: TodoItem[],
    weddingDate: string
  ): TodoItem[] {
    if (!weddingDate) return [];

    const monthsUntil = this.calculateMonthsUntilWedding(weddingDate);
    const categorized = this.categorizeExistingTodos(todos);
    const priority: TodoItem[] = [];

    this.phases.forEach((phase) => {
      const status = this.getPhaseStatus(phase, monthsUntil);
      if (status === "current") {
        const phaseTodos = categorized.get(phase.id) || [];
        const incompleteTodos = phaseTodos.filter((todo) => !todo.completed);
        priority.push(...incompleteTodos);
      }
    });

    return priority;
  }

  /**
   * Generate timeline insights and recommendations
   */
  static generateTimelineInsights(
    todos: TodoItem[],
    weddingDate: string
  ): {
    overallProgress: number;
    currentPhase: TimelinePhase | null;
    overdueTasks: TodoItem[];
    priorityTasks: TodoItem[];
    recommendations: string[];
  } {
    if (!weddingDate) {
      return {
        overallProgress: 0,
        currentPhase: null,
        overdueTasks: [],
        priorityTasks: [],
        recommendations: [
          "Set your wedding date to get personalized timeline insights!",
        ],
      };
    }

    const monthsUntil = this.calculateMonthsUntilWedding(weddingDate);
    const overdueTasks = this.getOverdueTasks(todos, weddingDate);
    const priorityTasks = this.getCurrentPriorityTasks(todos, weddingDate);

    // Find current phase
    const currentPhase =
      this.phases.find(
        (phase) => this.getPhaseStatus(phase, monthsUntil) === "current"
      ) || null;

    // Calculate overall progress
    const totalTasks = todos.length;
    const completedTasks = todos.filter((todo) => todo.completed).length;
    const overallProgress =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Generate recommendations
    const recommendations: string[] = [];

    if (overdueTasks.length > 0) {
      recommendations.push(
        `You have ${overdueTasks.length} overdue task${
          overdueTasks.length === 1 ? "" : "s"
        }. Focus on these first!`
      );
    }

    if (priorityTasks.length > 0) {
      recommendations.push(
        `${priorityTasks.length} task${
          priorityTasks.length === 1 ? "" : "s"
        } are due in your current phase. Stay on track!`
      );
    }

    if (monthsUntil <= 1 && priorityTasks.length === 0) {
      recommendations.push(
        "You're in the final stretch! Focus on day-of coordination and final confirmations."
      );
    }

    if (overallProgress < 50 && monthsUntil <= 3) {
      recommendations.push(
        "Consider hiring a wedding planner to help catch up on tasks."
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Great job staying on track with your wedding planning!"
      );
    }

    return {
      overallProgress,
      currentPhase,
      overdueTasks,
      priorityTasks,
      recommendations,
    };
  }

  /**
   * Export timeline data for sharing or backup
   */
  static exportTimelineData(
    todos: TodoItem[],
    weddingDate: string
  ): {
    metadata: {
      exportDate: string;
      weddingDate: string;
      monthsUntilWedding: number;
      totalTasks: number;
      completedTasks: number;
    };
    phases: Array<{
      phase: TimelinePhase;
      todos: TodoItem[];
      progress: number;
      status: string;
    }>;
    insights: ReturnType<typeof TimelineService.generateTimelineInsights>;
  } {
    const categorized = this.categorizeExistingTodos(todos);
    const monthsUntil = this.calculateMonthsUntilWedding(weddingDate);
    const insights = this.generateTimelineInsights(todos, weddingDate);

    const phases = this.phases.map((phase) => {
      const phaseTodos = categorized.get(phase.id) || [];
      const completed = phaseTodos.filter((todo) => todo.completed).length;
      const progress =
        phaseTodos.length > 0 ? (completed / phaseTodos.length) * 100 : 0;
      const status = this.getPhaseStatus(phase, monthsUntil);

      return {
        phase,
        todos: phaseTodos,
        progress: Math.round(progress),
        status,
      };
    });

    return {
      metadata: {
        exportDate: new Date().toISOString(),
        weddingDate,
        monthsUntilWedding: monthsUntil,
        totalTasks: todos.length,
        completedTasks: todos.filter((todo) => todo.completed).length,
      },
      phases,
      insights,
    };
  }

  /**
   * Get phase-specific tips and advice
   */
  static getPhaseAdvice(phaseId: string, monthsUntilWedding: number): string[] {
    const phase = this.getPhaseById(phaseId);
    if (!phase) return [];

    const status = this.getPhaseStatus(phase, monthsUntilWedding);
    const baseTips = phase.tips || [];
    const statusTips: string[] = [];

    switch (status) {
      case "current":
        statusTips.push(
          "🎯 This is your current focus phase - prioritize these tasks!"
        );
        break;
      case "overdue":
        statusTips.push(
          "⚠️ These tasks are overdue - consider delegating or hiring help."
        );
        break;
      case "upcoming":
        statusTips.push(
          "⏳ You can start planning these tasks, but focus on current phase first."
        );
        break;
      case "past":
        if (monthsUntilWedding > 0) {
          statusTips.push(
            "✅ Great job completing this phase! Any remaining tasks are still important."
          );
        }
        break;
    }

    return [...statusTips, ...baseTips];
  }

  /**
   * Calculate estimated completion date for remaining tasks
   */
  static estimateCompletionDate(
    todos: TodoItem[],
    weddingDate: string
  ): {
    estimatedCompletionDate: string;
    tasksPerWeek: number;
    isOnTrack: boolean;
    recommendation: string;
  } {
    if (!weddingDate) {
      return {
        estimatedCompletionDate: "",
        tasksPerWeek: 0,
        isOnTrack: false,
        recommendation: "Set your wedding date to get completion estimates",
      };
    }

    const incompleteTasks = todos.filter((todo) => !todo.completed);
    const monthsUntil = this.calculateMonthsUntilWedding(weddingDate);
    const weeksUntil = monthsUntil * 4.33; // Average weeks per month

    if (incompleteTasks.length === 0) {
      return {
        estimatedCompletionDate: new Date().toISOString().split("T")[0],
        tasksPerWeek: 0,
        isOnTrack: true,
        recommendation:
          "🎉 All tasks completed! You're ready for your wedding!",
      };
    }

    if (weeksUntil <= 0) {
      return {
        estimatedCompletionDate: weddingDate,
        tasksPerWeek: incompleteTasks.length,
        isOnTrack: false,
        recommendation: "⚠️ Wedding is here! Focus on essential tasks only.",
      };
    }

    // Estimate realistic completion rate (2-3 tasks per week is reasonable)
    const realisticTasksPerWeek = 2.5;
    const estimatedWeeks = Math.ceil(
      incompleteTasks.length / realisticTasksPerWeek
    );
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedWeeks * 7);

    const tasksPerWeek = Math.ceil(incompleteTasks.length / weeksUntil);
    const isOnTrack = tasksPerWeek <= 3; // 3 tasks per week is manageable

    let recommendation = "";
    if (isOnTrack) {
      recommendation = `✅ You're on track! Complete ${tasksPerWeek} task${
        tasksPerWeek === 1 ? "" : "s"
      } per week.`;
    } else if (tasksPerWeek <= 5) {
      recommendation = `⚡ You need to complete ${tasksPerWeek} tasks per week. Consider delegating some tasks.`;
    } else {
      recommendation = `🚨 ${tasksPerWeek} tasks per week is challenging. Consider hiring a wedding planner or postponing non-essential tasks.`;
    }

    return {
      estimatedCompletionDate: estimatedDate.toISOString().split("T")[0],
      tasksPerWeek,
      isOnTrack,
      recommendation,
    };
  }

  /**
   * Get wedding planning milestones and checkpoints
   */
  static getMilestones(weddingDate: string): Array<{
    date: string;
    milestone: string;
    description: string;
    importance: "high" | "medium" | "low";
  }> {
    if (!weddingDate) return [];

    const wedding = new Date(weddingDate);
    const milestones: Array<{
      date: string;
      milestone: string;
      description: string;
      importance: "high" | "medium" | "low";
    }> = [];

    // Calculate milestone dates
    const addMilestone = (
      monthsBefore: number,
      milestone: string,
      description: string,
      importance: "high" | "medium" | "low" = "medium"
    ) => {
      const milestoneDate = new Date(wedding);
      milestoneDate.setMonth(milestoneDate.getMonth() - monthsBefore);

      milestones.push({
        date: milestoneDate.toISOString().split("T")[0],
        milestone,
        description,
        importance,
      });
    };

    addMilestone(
      12,
      "Venue Booking Deadline",
      "Latest to book popular venues",
      "high"
    );
    addMilestone(
      10,
      "Major Vendor Booking",
      "Photographer, caterer, florist",
      "high"
    );
    addMilestone(
      8,
      "Dress Ordering Deadline",
      "Allow time for delivery and alterations",
      "high"
    );
    addMilestone(
      6,
      "Save-the-Date Deadline",
      "Send to guests for planning",
      "medium"
    );
    addMilestone(
      3,
      "Invitation Ordering",
      "Design and print invitations",
      "medium"
    );
    addMilestone(
      2,
      "Invitation Mailing",
      "Send 6-8 weeks before wedding",
      "high"
    );
    addMilestone(
      1,
      "Final Preparations",
      "Confirm details, final fittings",
      "high"
    );
    addMilestone(
      0.25,
      "Wedding Week",
      "Final confirmations and relaxation",
      "high"
    );

    return milestones.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  /**
   * Validate wedding timeline and identify potential issues
   */
  static validateTimeline(
    todos: TodoItem[],
    weddingDate: string
  ): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!weddingDate) {
      errors.push("Wedding date is required for timeline validation");
      return { isValid: false, warnings, errors, suggestions };
    }

    const monthsUntil = this.calculateMonthsUntilWedding(weddingDate);
    const overdueTasks = this.getOverdueTasks(todos, weddingDate);
    const categorized = this.categorizeExistingTodos(todos);

    // Check for overdue tasks
    if (overdueTasks.length > 0) {
      warnings.push(
        `${overdueTasks.length} task${
          overdueTasks.length === 1 ? " is" : "s are"
        } overdue`
      );
    }

    // Check for missing critical early tasks
    if (monthsUntil < 12) {
      const planningStartTasks = categorized.get("planning-start") || [];
      const completedEarlyTasks = planningStartTasks.filter(
        (todo) => todo.completed
      );

      if (completedEarlyTasks.length < planningStartTasks.length * 0.8) {
        warnings.push("Some critical early planning tasks may be incomplete");
      }
    }

    // Check timeline pressure
    const incompleteTasks = todos.filter((todo) => !todo.completed);
    if (monthsUntil <= 1 && incompleteTasks.length > 10) {
      errors.push("Too many tasks remaining for the final month");
      suggestions.push(
        "Consider hiring a wedding planner or day-of coordinator"
      );
    }

    // Check for missing essential vendors
    const essentialVendorTasks = [
      "photographer",
      "venue",
      "caterer",
      "officiant",
    ];

    const todoTexts = todos.map((todo) => todo.text.toLowerCase());
    essentialVendorTasks.forEach((vendor) => {
      const hasVendorTask = todoTexts.some((text) => text.includes(vendor));
      if (!hasVendorTask && monthsUntil < 6) {
        warnings.push(`No ${vendor} task found - this is typically essential`);
      }
    });

    // Provide suggestions based on timeline
    if (monthsUntil > 12) {
      suggestions.push(
        "You have plenty of time! Focus on major decisions first"
      );
    } else if (monthsUntil > 6) {
      suggestions.push("Time to book major vendors and finalize key details");
    } else if (monthsUntil > 3) {
      suggestions.push("Focus on invitations and final vendor confirmations");
    } else if (monthsUntil > 1) {
      suggestions.push(
        "Final month! Confirm all details and prepare for the big day"
      );
    }

    const isValid = errors.length === 0;
    return { isValid, warnings, errors, suggestions };
  }
}

export default TimelineService;

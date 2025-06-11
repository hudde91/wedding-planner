import { TodoItem } from "../types";

export interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  startMonths: number; // Months before wedding this phase should start
  endMonths: number; // Months before wedding this phase ends
  minMonthsBefore: number; // Minimum months before wedding this phase should start
  maxMonthsBefore: number; // Maximum months before wedding this phase ends
  color: string;
  priority: "critical" | "high" | "medium" | "low";
  tips?: string[];
  isFlexible: boolean; // Can this phase be compressed/extended?
  icon: string;
}

export interface TimelineTodo extends TodoItem {
  timelinePhase?: string;
  recommendedMonths?: number;
  urgency?: "critical" | "high" | "medium" | "low";
}

export interface SmartTodoItem extends TodoItem {
  aiCategory?: string;
  suggestedPhase?: string;
  urgencyLevel?: "critical" | "high" | "medium" | "low";
  estimatedDuration?: number; // Days to complete
  dependencies?: string[]; // Other tasks this depends on
  aiSuggestions?: string[];
}

export interface AdaptivePhase extends TimelinePhase {
  adaptedStartDate: Date;
  adaptedEndDate: Date;
  compressionLevel: number; // 0-1, how much this phase has been compressed
  urgencyBoost: number; // Priority boost due to time constraints
}

class SmartTimelineService {
  // Core wedding planning categories that work across languages
  private static readonly TASK_CATEGORIES = {
    venue: {
      keywords: [
        "venue",
        "location",
        "church",
        "hall",
        "reception",
        "ceremony",
        "site",
      ],
      priority: "critical",
      minLead: 12,
      estimatedDays: 14,
    },
    photography: {
      keywords: ["photo", "photographer", "picture", "image", "shot", "camera"],
      priority: "critical",
      minLead: 8,
      estimatedDays: 7,
    },
    catering: {
      keywords: [
        "food",
        "cater",
        "menu",
        "meal",
        "dinner",
        "lunch",
        "eat",
        "cook",
      ],
      priority: "critical",
      minLead: 6,
      estimatedDays: 10,
    },
    attire: {
      keywords: [
        "dress",
        "suit",
        "tux",
        "gown",
        "outfit",
        "wear",
        "clothing",
        "attire",
      ],
      priority: "high",
      minLead: 6,
      estimatedDays: 21,
    },
    flowers: {
      keywords: [
        "flower",
        "bouquet",
        "floral",
        "arrangement",
        "decoration",
        "bloom",
      ],
      priority: "high",
      minLead: 3,
      estimatedDays: 5,
    },
    music: {
      keywords: ["music", "band", "dj", "song", "dance", "sound", "audio"],
      priority: "high",
      minLead: 4,
      estimatedDays: 7,
    },
    invitations: {
      keywords: [
        "invitation",
        "invite",
        "card",
        "announce",
        "rsvp",
        "guest list",
      ],
      priority: "medium",
      minLead: 3,
      estimatedDays: 10,
    },
    transportation: {
      keywords: ["transport", "car", "limo", "ride", "travel", "vehicle"],
      priority: "medium",
      minLead: 2,
      estimatedDays: 3,
    },
    accommodation: {
      keywords: ["hotel", "stay", "lodge", "room", "accommodation", "sleep"],
      priority: "medium",
      minLead: 4,
      estimatedDays: 5,
    },
    legal: {
      keywords: [
        "license",
        "legal",
        "document",
        "certificate",
        "permit",
        "official",
      ],
      priority: "critical",
      minLead: 1,
      estimatedDays: 2,
    },
    honeymoon: {
      keywords: ["honeymoon", "vacation", "trip", "travel", "getaway"],
      priority: "low",
      minLead: 3,
      estimatedDays: 7,
    },
    beauty: {
      keywords: ["hair", "makeup", "beauty", "nail", "spa", "style"],
      priority: "medium",
      minLead: 2,
      estimatedDays: 5,
    },
  };

  // Adaptive phases that compress based on available time
  private static readonly ADAPTIVE_PHASES: TimelinePhase[] = [
    {
      id: "foundation",
      name: "Foundation Planning",
      description: "Essential decisions and major bookings",
      startMonths: 12,
      endMonths: 6,
      minMonthsBefore: 12,
      maxMonthsBefore: 6,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      priority: "critical",
      isFlexible: false,
      icon: "🏛️",
      tips: [
        "Book venue and major vendors first - they have the longest lead times",
        "Set your budget early to guide all other decisions",
        "Create your guest list to determine venue capacity needs",
      ],
    },
    {
      id: "vendor-selection",
      name: "Vendor Selection",
      description: "Secure key service providers",
      startMonths: 8,
      endMonths: 4,
      minMonthsBefore: 8,
      maxMonthsBefore: 4,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      priority: "high",
      isFlexible: true,
      icon: "🤝",
      tips: [
        "Research vendors thoroughly and check references",
        "Get contracts in writing with clear terms",
        "Book tastings and consultations early",
      ],
    },
    {
      id: "detailed-planning",
      name: "Detailed Planning",
      description: "Finalize specifics and design elements",
      startMonths: 4,
      endMonths: 2,
      minMonthsBefore: 4,
      maxMonthsBefore: 2,
      color: "bg-green-50 border-green-200 text-green-800",
      priority: "medium",
      isFlexible: true,
      icon: "📋",
      tips: [
        "Focus on design cohesion across all elements",
        "Confirm timeline and logistics with all vendors",
        "Order stationery and finalize menu details",
      ],
    },
    {
      id: "final-preparations",
      name: "Final Preparations",
      description: "Last-minute coordination and confirmations",
      startMonths: 2,
      endMonths: 0.25,
      minMonthsBefore: 2,
      maxMonthsBefore: 0.25,
      color: "bg-orange-50 border-orange-200 text-orange-800",
      priority: "high",
      isFlexible: false,
      icon: "⚡",
      tips: [
        "Confirm all vendor arrival times and details",
        "Delegate day-of responsibilities to trusted people",
        "Prepare emergency kit and backup plans",
      ],
    },
    {
      id: "wedding-week",
      name: "Wedding Week",
      description: "Final countdown and day-of execution",
      startMonths: 0.25,
      endMonths: 0,
      minMonthsBefore: 0.25,
      maxMonthsBefore: 0,
      color: "bg-pink-50 border-pink-200 text-pink-800",
      priority: "critical",
      isFlexible: false,
      icon: "💐",
      tips: [
        "Focus on relaxation and final preparations",
        "Trust your planning and enjoy the moment",
        "Have your support team handle any last-minute issues",
      ],
    },
  ];

  /**
   * Get all timeline phases
   */
  static getPhases(): TimelinePhase[] {
    return this.ADAPTIVE_PHASES;
  }

  /**
   * Get a phase by ID
   */
  static getPhaseById(id: string): TimelinePhase | undefined {
    return this.ADAPTIVE_PHASES.find((phase) => phase.id === id);
  }

  /**
   * Calculate months until wedding
   */
  static calculateMonthsUntilWedding(weddingDate: string): number {
    const wedding = new Date(weddingDate);
    const now = new Date();

    const yearDiff = wedding.getFullYear() - now.getFullYear();
    const monthDiff = wedding.getMonth() - now.getMonth();
    const dayDiff = wedding.getDate() - now.getDate();

    let totalMonths = yearDiff * 12 + monthDiff;

    if (dayDiff < 0) {
      totalMonths -= 0.5;
    } else if (dayDiff > 15) {
      totalMonths += 0.5;
    }

    return Math.max(0, totalMonths);
  }

  /**
   * Get phase status based on current timeline
   */
  static getPhaseStatus(
    phase: TimelinePhase,
    monthsUntilWedding: number
  ): "upcoming" | "current" | "past" | "overdue" {
    if (monthsUntilWedding > phase.startMonths) return "upcoming";
    if (
      monthsUntilWedding >= phase.endMonths &&
      monthsUntilWedding <= phase.startMonths
    )
      return "current";
    if (monthsUntilWedding >= 0) return "past";
    return "overdue";
  }

  /**
   * Generate suggested todos based on timeline
   */
  static generateSuggestedTodos(
    weddingDate: string,
    existingTodos: TodoItem[]
  ): TimelineTodo[] {
    if (!weddingDate) return [];

    const monthsUntilWedding = this.calculateMonthsUntilWedding(weddingDate);
    const existingTexts = new Set(
      existingTodos.map((todo) => todo.text.toLowerCase())
    );
    const suggestions: TimelineTodo[] = [];

    // Basic wedding planning tasks
    const basicTasks = [
      {
        text: "Set wedding budget",
        phase: "foundation",
        months: 12,
        urgency: "critical" as const,
      },
      {
        text: "Book wedding venue",
        phase: "foundation",
        months: 12,
        urgency: "critical" as const,
      },
      {
        text: "Create guest list",
        phase: "foundation",
        months: 10,
        urgency: "high" as const,
      },
      {
        text: "Hire wedding photographer",
        phase: "vendor-selection",
        months: 8,
        urgency: "critical" as const,
      },
      {
        text: "Choose wedding caterer",
        phase: "vendor-selection",
        months: 6,
        urgency: "critical" as const,
      },
      {
        text: "Select wedding dress/suit",
        phase: "vendor-selection",
        months: 6,
        urgency: "high" as const,
      },
      {
        text: "Book wedding band/DJ",
        phase: "vendor-selection",
        months: 6,
        urgency: "high" as const,
      },
      {
        text: "Order wedding invitations",
        phase: "detailed-planning",
        months: 4,
        urgency: "medium" as const,
      },
      {
        text: "Choose wedding flowers",
        phase: "detailed-planning",
        months: 3,
        urgency: "medium" as const,
      },
      {
        text: "Plan wedding menu",
        phase: "detailed-planning",
        months: 3,
        urgency: "medium" as const,
      },
      {
        text: "Book wedding transportation",
        phase: "detailed-planning",
        months: 2,
        urgency: "medium" as const,
      },
      {
        text: "Get marriage license",
        phase: "final-preparations",
        months: 1,
        urgency: "critical" as const,
      },
      {
        text: "Confirm vendor details",
        phase: "final-preparations",
        months: 1,
        urgency: "high" as const,
      },
      {
        text: "Pack for honeymoon",
        phase: "wedding-week",
        months: 0,
        urgency: "medium" as const,
      },
    ];

    // Filter out existing tasks and add relevant suggestions
    basicTasks.forEach((task, index) => {
      const isRelevant = monthsUntilWedding >= task.months - 1; // Include tasks that are close to being relevant
      const alreadyExists = existingTexts.has(task.text.toLowerCase());

      if (isRelevant && !alreadyExists) {
        suggestions.push({
          id: Date.now() + index,
          text: task.text,
          completed: false,
          timelinePhase: task.phase,
          recommendedMonths: task.months,
          urgency: task.urgency,
        });
      }
    });

    return suggestions;
  }

  /**
   * AI-powered task categorization using semantic analysis
   */
  static categorizeTodoWithAI(todo: TodoItem): SmartTodoItem {
    const text = todo.text.toLowerCase();
    let bestMatch = { category: "general", confidence: 0 };

    // Analyze against each category
    for (const [categoryName, categoryData] of Object.entries(
      this.TASK_CATEGORIES
    )) {
      let confidence = 0;
      let matchCount = 0;

      // Check for keyword matches
      for (const keyword of categoryData.keywords) {
        if (text.includes(keyword)) {
          matchCount++;
          confidence += 1;
        }

        // Check for partial matches and similar words
        if (this.calculateSimilarity(text, keyword) > 0.7) {
          confidence += 0.5;
        }
      }

      // Normalize confidence based on number of keywords
      confidence = confidence / categoryData.keywords.length;

      if (confidence > bestMatch.confidence) {
        bestMatch = { category: categoryName, confidence };
      }
    }

    // Generate AI suggestions based on category
    const suggestions = this.generateAISuggestions(
      todo.text,
      bestMatch.category
    );

    return {
      ...todo,
      aiCategory: bestMatch.category,
      urgencyLevel:
        (this.TASK_CATEGORIES[
          bestMatch.category as keyof typeof this.TASK_CATEGORIES
        ]?.priority as any) || "medium",
      estimatedDuration:
        this.TASK_CATEGORIES[
          bestMatch.category as keyof typeof this.TASK_CATEGORIES
        ]?.estimatedDays || 7,
      aiSuggestions: suggestions,
    };
  }

  /**
   * Generate adaptive phases based on available time until wedding
   */
  static generateAdaptiveTimeline(
    weddingDate: string,
    currentTodos: TodoItem[]
  ): AdaptivePhase[] {
    if (!weddingDate) return [];

    const monthsUntilWedding = this.calculateMonthsUntilWedding(weddingDate);
    const wedding = new Date(weddingDate);

    return this.ADAPTIVE_PHASES.map((phase) => {
      let adaptedPhase: AdaptivePhase;

      if (monthsUntilWedding >= phase.minMonthsBefore) {
        // Normal timeline - no compression needed
        adaptedPhase = {
          ...phase,
          adaptedStartDate: new Date(
            wedding.getTime() - phase.maxMonthsBefore * 30 * 24 * 60 * 60 * 1000
          ),
          adaptedEndDate: new Date(
            wedding.getTime() - phase.minMonthsBefore * 30 * 24 * 60 * 60 * 1000
          ),
          compressionLevel: 0,
          urgencyBoost: 0,
        };
      } else if (
        monthsUntilWedding <= phase.minMonthsBefore &&
        phase.isFlexible
      ) {
        // Compressed timeline - phase needs to be squeezed
        const compressionRatio = Math.max(
          0.3,
          monthsUntilWedding / phase.minMonthsBefore
        );
        const compressedDuration =
          (phase.maxMonthsBefore - phase.minMonthsBefore) * compressionRatio;

        adaptedPhase = {
          ...phase,
          adaptedStartDate: new Date(
            wedding.getTime() -
              (phase.minMonthsBefore * compressionRatio + compressedDuration) *
                30 *
                24 *
                60 *
                60 *
                1000
          ),
          adaptedEndDate: new Date(
            wedding.getTime() -
              phase.minMonthsBefore *
                compressionRatio *
                30 *
                24 *
                60 *
                60 *
                1000
          ),
          compressionLevel: 1 - compressionRatio,
          urgencyBoost: Math.floor((1 - compressionRatio) * 2), // 0-2 urgency boost
        };
      } else {
        // Phase should have been completed already - mark as overdue
        adaptedPhase = {
          ...phase,
          adaptedStartDate: new Date(), // Start now
          adaptedEndDate: new Date(Date.now() + 0.5 * 30 * 24 * 60 * 60 * 1000), // Complete in 2 weeks
          compressionLevel: 1,
          urgencyBoost: 2,
        };
      }

      return adaptedPhase;
    });
  }

  /**
   * Smart task suggestions based on AI analysis and timeline compression
   */
  static generateSmartSuggestions(
    weddingDate: string,
    existingTodos: TodoItem[],
    adaptivePhases: AdaptivePhase[]
  ): SmartTodoItem[] {
    if (!weddingDate) return [];

    const monthsUntilWedding = this.calculateMonthsUntilWedding(weddingDate);
    const existingCategories = new Set(
      existingTodos.map((todo) => this.categorizeTodoWithAI(todo).aiCategory)
    );

    const suggestions: SmartTodoItem[] = [];
    const currentPhase = this.getCurrentPhase(adaptivePhases);

    // Generate category-based suggestions
    for (const [categoryName, categoryData] of Object.entries(
      this.TASK_CATEGORIES
    )) {
      if (existingCategories.has(categoryName)) continue;

      // Check if this category is relevant given the timeline
      if (
        monthsUntilWedding < categoryData.minLead &&
        categoryData.priority === "critical"
      ) {
        // Critical task that's urgent
        suggestions.push({
          id: Date.now() + Math.random(),
          text: this.generateCategoryTask(categoryName),
          completed: false,
          aiCategory: categoryName,
          urgencyLevel: "critical",
          estimatedDuration: Math.max(
            1,
            Math.floor(categoryData.estimatedDays * 0.5)
          ), // Compressed time
          aiSuggestions: [
            `This is urgent - normally needs ${categoryData.minLead} months lead time`,
            "Consider hiring a wedding planner to expedite this process",
            "Look for vendors with immediate availability",
          ],
        });
      } else if (monthsUntilWedding >= categoryData.minLead) {
        // Normal timeline suggestion
        suggestions.push({
          id: Date.now() + Math.random(),
          text: this.generateCategoryTask(categoryName),
          completed: false,
          aiCategory: categoryName,
          urgencyLevel: categoryData.priority as any,
          estimatedDuration: categoryData.estimatedDays,
          aiSuggestions: this.generateAISuggestions(categoryName, categoryName),
        });
      }
    }

    // Add phase-specific urgent tasks if timeline is compressed
    if (currentPhase && currentPhase.compressionLevel > 0.5) {
      suggestions.push({
        id: Date.now() + Math.random() + 1000,
        text: "Consider hiring a wedding coordinator for timeline management",
        completed: false,
        aiCategory: "planning",
        urgencyLevel: "high",
        estimatedDuration: 1,
        aiSuggestions: [
          "A professional can help compress your timeline effectively",
          "They have vendor networks for quick bookings",
          "Can handle multiple tasks simultaneously",
        ],
      });
    }

    return suggestions.slice(0, 12); // Limit to most important suggestions
  }

  /**
   * Categorize existing todos using AI analysis
   */
  static categorizeExistingTodos(
    todos: TodoItem[]
  ): Map<string, SmartTodoItem[]> {
    const categorized = new Map<string, SmartTodoItem[]>();

    // Initialize with empty arrays for each phase
    this.ADAPTIVE_PHASES.forEach((phase) => {
      categorized.set(phase.id, []);
    });

    // Categorize each todo
    todos.forEach((todo) => {
      const smartTodo = this.categorizeTodoWithAI(todo);
      const phase = this.suggestPhaseForTask(smartTodo);

      const existing = categorized.get(phase) || [];
      categorized.set(phase, [...existing, smartTodo]);
    });

    return categorized;
  }

  /**
   * Get current phase based on adaptive timeline
   */
  static getCurrentPhase(
    adaptivePhases: AdaptivePhase[]
  ): AdaptivePhase | null {
    const now = new Date();

    return (
      adaptivePhases.find(
        (phase) => now >= phase.adaptedStartDate && now <= phase.adaptedEndDate
      ) || null
    );
  }

  /**
   * Generate timeline insights with AI recommendations
   */
  static generateTimelineInsights(
    todos: TodoItem[],
    weddingDate: string,
    adaptivePhases: AdaptivePhase[]
  ) {
    const currentPhase = this.getCurrentPhase(adaptivePhases);
    const monthsUntilWedding = this.calculateMonthsUntilWedding(weddingDate);

    // Analyze task completion vs timeline
    const smartTodos = todos.map((todo) => this.categorizeTodoWithAI(todo));
    const criticalTasks = smartTodos.filter(
      (todo) => todo.urgencyLevel === "critical"
    );
    const completedCritical = criticalTasks.filter((todo) => todo.completed);

    // Calculate overdue tasks based on phases
    const overdueTasks = smartTodos.filter((todo) => {
      const todoPhase = this.suggestPhaseForTask(todo);
      const phase = adaptivePhases.find((p) => p.id === todoPhase);
      if (!phase) return false;

      const now = new Date();
      return !todo.completed && now > phase.adaptedEndDate;
    });

    // Calculate priority tasks (critical + high urgency incomplete tasks)
    const priorityTasks = smartTodos.filter(
      (todo) =>
        !todo.completed &&
        (todo.urgencyLevel === "critical" || todo.urgencyLevel === "high")
    );

    const overallProgress =
      todos.length > 0
        ? (todos.filter((t) => t.completed).length / todos.length) * 100
        : 0;

    // Generate AI recommendations
    const recommendations: string[] = [];

    if (monthsUntilWedding < 6 && overallProgress < 50) {
      recommendations.push(
        "Consider hiring a wedding planner - your timeline is compressed and you need to accelerate planning"
      );
    }

    if (
      criticalTasks.length > completedCritical.length &&
      monthsUntilWedding < 3
    ) {
      recommendations.push(
        "Focus on critical tasks first - venue, catering, and photography cannot be delayed"
      );
    }

    if (currentPhase && currentPhase.compressionLevel > 0.7) {
      recommendations.push(
        "Your timeline is very compressed - prioritize must-have items and consider simplifying some elements"
      );
    }

    const timelineStress = this.calculateTimelineStress(
      adaptivePhases,
      smartTodos
    );

    if (timelineStress > 0.8) {
      recommendations.push(
        "High timeline stress detected - focus on vendor availability and consider flexible options"
      );
    }

    return {
      overallProgress,
      currentPhase,
      recommendations,
      timelineStress,
      criticalTasksRemaining: criticalTasks.length - completedCritical.length,
      adaptivePhases,
      overdueTasks, // Added missing property
      priorityTasks, // Added missing property
    };
  }

  // Helper methods
  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(" ").filter((w) => w.length > 2);
    const words2 = str2.split(" ").filter((w) => w.length > 2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const commonWords = words1.filter((word1) =>
      words2.some(
        (word2) =>
          word1.includes(word2) ||
          word2.includes(word1) ||
          this.levenshteinDistance(word1, word2) <= 2
      )
    );

    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private static generateCategoryTask(category: string): string {
    const taskTemplates = {
      venue: "Book wedding venue and ceremony location",
      photography: "Hire wedding photographer and videographer",
      catering: "Choose caterer and finalize wedding menu",
      attire: "Select and order wedding dress/suit",
      flowers: "Choose florist and design floral arrangements",
      music: "Book wedding band or DJ for reception",
      invitations: "Design and order wedding invitations",
      transportation: "Arrange wedding day transportation",
      accommodation: "Book hotel rooms for out-of-town guests",
      legal: "Obtain marriage license and legal documents",
      honeymoon: "Plan and book honeymoon destination",
      beauty: "Schedule hair and makeup trial sessions",
    };

    return (
      taskTemplates[category as keyof typeof taskTemplates] ||
      "Complete wedding planning task"
    );
  }

  private static generateAISuggestions(
    taskText: string,
    category: string
  ): string[] {
    const suggestions = {
      venue: [
        "Book 12-18 months in advance for popular venues",
        "Visit venues in person and check availability for your preferred date",
        "Consider backup dates and venues in case of availability issues",
      ],
      photography: [
        "Review full wedding portfolios, not just highlight reels",
        "Meet photographers in person to ensure personality fit",
        "Book engagement session to test working relationship",
      ],
      catering: [
        "Schedule tastings and consider dietary restrictions",
        "Get detailed quotes including service fees and gratuity",
        "Discuss setup and cleanup responsibilities",
      ],
      general: [
        "Research multiple options before making decisions",
        "Read reviews and ask for references",
        "Get all agreements in writing with clear terms",
      ],
    };

    return (
      suggestions[category as keyof typeof suggestions] || suggestions.general
    );
  }

  private static suggestPhaseForTask(smartTodo: SmartTodoItem): string {
    const category = smartTodo.aiCategory;
    const urgency = smartTodo.urgencyLevel;

    // Map categories to phases based on priority and lead time
    if (urgency === "critical") {
      if (["venue", "photography", "catering"].includes(category || "")) {
        return "foundation";
      }
      return "vendor-selection";
    }

    if (urgency === "high") {
      if (["attire", "music", "flowers"].includes(category || "")) {
        return "vendor-selection";
      }
      return "detailed-planning";
    }

    if (["legal", "beauty"].includes(category || "")) {
      return "final-preparations";
    }

    return "detailed-planning";
  }

  private static calculateTimelineStress(
    adaptivePhases: AdaptivePhase[],
    smartTodos: SmartTodoItem[]
  ): number {
    let totalStress = 0;
    let phaseCount = 0;

    adaptivePhases.forEach((phase) => {
      const phaseStress = phase.compressionLevel + phase.urgencyBoost * 0.3;
      totalStress += Math.min(1, phaseStress);
      phaseCount++;
    });

    // Factor in critical tasks not completed
    const criticalTasks = smartTodos.filter(
      (todo) => todo.urgencyLevel === "critical"
    );
    const incompleteCritical = criticalTasks.filter((todo) => !todo.completed);
    const criticalStress =
      criticalTasks.length > 0
        ? incompleteCritical.length / criticalTasks.length
        : 0;

    return Math.min(1, (totalStress / phaseCount) * 0.7 + criticalStress * 0.3);
  }
}

export default SmartTimelineService;

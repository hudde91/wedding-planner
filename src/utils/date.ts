/**
 * Date formatting and calculation utilities
 * Consolidates all date-related logic across components
 */

export const formatWeddingDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatCompactDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const calculateDaysUntilWedding = (
  weddingDate: string
): number | null => {
  if (!weddingDate) return null;
  return Math.ceil(
    (new Date(weddingDate).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24)
  );
};

export const calculateMonthsUntilWedding = (weddingDate: string): number => {
  if (!weddingDate) return 0;
  const now = new Date();
  const wedding = new Date(weddingDate);
  const monthDiff =
    (wedding.getFullYear() - now.getFullYear()) * 12 +
    (wedding.getMonth() - now.getMonth());
  const dayDiff = wedding.getDate() - now.getDate();
  return monthDiff + (dayDiff < 0 ? -1 : 0);
};

export interface CountdownInfo {
  text: string;
  subtext: string;
  color: string;
  urgency: "low" | "medium" | "high" | "critical";
  showCelebration: boolean;
}

export const getWeddingCountdown = (weddingDate: string): CountdownInfo => {
  const days = calculateDaysUntilWedding(weddingDate);

  if (days === null) {
    return {
      text: "Set your wedding date",
      subtext: "Add your wedding date to see countdown",
      color: "text-gray-500",
      urgency: "low",
      showCelebration: false,
    };
  }

  if (days < 0) {
    return {
      text: `${Math.abs(days)} days ago`,
      subtext: "Congratulations on your wedding!",
      color: "text-gray-500",
      urgency: "low",
      showCelebration: true,
    };
  }

  if (days === 0) {
    return {
      text: "Today!",
      subtext: "Your wedding day is here!",
      color: "text-rose-600",
      urgency: "critical",
      showCelebration: true,
    };
  }

  if (days === 1) {
    return {
      text: "Tomorrow!",
      subtext: "Final countdown - you've got this!",
      color: "text-red-600",
      urgency: "critical",
      showCelebration: false,
    };
  }

  if (days <= 7) {
    return {
      text: `${days} days left`,
      subtext: "Final preparations time!",
      color: "text-orange-600",
      urgency: "high",
      showCelebration: false,
    };
  }

  if (days <= 30) {
    return {
      text: `${days} days left`,
      subtext: "Final month - time to finalize details",
      color: "text-amber-600",
      urgency: "medium",
      showCelebration: false,
    };
  }

  if (days <= 90) {
    return {
      text: `${days} days left`,
      subtext: "Perfect timing for planning",
      color: "text-blue-600",
      urgency: "medium",
      showCelebration: false,
    };
  }

  const months = Math.ceil(days / 30);
  return {
    text: `${months} months to go!`,
    subtext: "Plenty of time to plan perfectly",
    color: "text-purple-600",
    urgency: "low",
    showCelebration: false,
  };
};

export const isDateInPast = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

export const isDateToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return today.toDateString() === date.toDateString();
};

export const getDateStatus = (
  dateString: string
): "past" | "today" | "future" => {
  if (isDateToday(dateString)) return "today";
  if (isDateInPast(dateString)) return "past";
  return "future";
};

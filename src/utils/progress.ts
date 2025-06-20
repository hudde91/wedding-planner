/**
 * Progress calculation utilities
 * Consolidates all progress-related calculations
 */

import { TodoItem } from "../types";

export interface ProgressInfo {
  completed: number;
  total: number;
  percentage: number;
  remaining: number;
}

export const calculateTodoProgress = (todos: TodoItem[]): ProgressInfo => {
  const completed = todos.filter((todo) => todo.completed).length;
  const total = todos.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed;

  return { completed, total, percentage, remaining };
};

export const calculateResponseRate = (
  totalGuests: number,
  respondedGuests: number
): number => {
  if (totalGuests === 0) return 0;
  return Math.round((respondedGuests / totalGuests) * 100);
};

export const calculateAttendanceRate = (
  attendingGuests: number,
  respondedGuests: number
): number => {
  if (respondedGuests === 0) return 0;
  return Math.round((attendingGuests / respondedGuests) * 100);
};

export interface TaskVelocityInfo {
  tasksPerWeek: number;
  isOnTrack: boolean;
  estimatedCompletionDate: string;
  recommendation: string;
}

export const calculateTaskVelocity = (
  incompleteTasks: TodoItem[],
  monthsUntilWedding: number
): TaskVelocityInfo => {
  const weeksUntil = monthsUntilWedding * 4.33;

  if (incompleteTasks.length === 0) {
    return {
      tasksPerWeek: 0,
      isOnTrack: true,
      estimatedCompletionDate: new Date().toISOString().split("T")[0],
      recommendation: "All tasks completed! You're ready for your wedding!",
    };
  }

  if (weeksUntil <= 0) {
    return {
      tasksPerWeek: incompleteTasks.length,
      isOnTrack: false,
      estimatedCompletionDate: new Date().toISOString().split("T")[0],
      recommendation: "Wedding is here! Focus on essential tasks only.",
    };
  }

  const tasksPerWeek = Math.ceil(incompleteTasks.length / weeksUntil);
  const isOnTrack = tasksPerWeek <= 3;

  const estimatedCompletionDate = new Date(
    Date.now() + (incompleteTasks.length / 2.5) * 7 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  const recommendation = isOnTrack
    ? `You're on track! Complete ${tasksPerWeek} task${
        tasksPerWeek === 1 ? "" : "s"
      } per week.`
    : `${tasksPerWeek} tasks per week is challenging. Consider hiring a wedding planner.`;

  return {
    tasksPerWeek,
    isOnTrack,
    estimatedCompletionDate,
    recommendation,
  };
};

export const getProgressMessage = (percentage: number): string => {
  if (percentage === 100) return "All tasks completed! 🎉";
  if (percentage >= 80) return "Almost there! Keep up the great work";
  if (percentage >= 60) return "Great progress! You're more than halfway";
  if (percentage >= 40) return "Good momentum! Keep going";
  if (percentage >= 20) return "Getting started! Every task counts";
  return "Begin your planning journey";
};

export const getProgressColorClass = (percentage: number): string => {
  if (percentage >= 80) return "from-emerald-400 to-green-500";
  if (percentage >= 60) return "from-blue-400 to-cyan-500";
  if (percentage >= 40) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-pink-500";
};

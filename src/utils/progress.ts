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

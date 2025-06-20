/**
 * Status badge and color utilities
 * Consolidates all status-related styling and logic
 */

import { RSVPStatus } from "../types";

export interface StatusStyle {
  containerClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  iconPath?: string;
}

export const getRSVPStatusStyle = (status: RSVPStatus): StatusStyle => {
  switch (status) {
    case "attending":
      return {
        containerClass: "text-emerald-700 bg-emerald-100 border-emerald-200",
        textClass: "text-emerald-700",
        bgClass: "bg-emerald-100",
        borderClass: "border-emerald-200",
        iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      };
    case "declined":
      return {
        containerClass: "text-red-700 bg-red-100 border-red-200",
        textClass: "text-red-700",
        bgClass: "bg-red-100",
        borderClass: "border-red-200",
        iconPath: "M6 18L18 6M6 6l12 12",
      };
    default: // pending
      return {
        containerClass: "text-amber-700 bg-amber-100 border-amber-200",
        textClass: "text-amber-700",
        bgClass: "bg-amber-100",
        borderClass: "border-amber-200",
        iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      };
  }
};

export const getCardBorderColorByRSVP = (status: RSVPStatus): string => {
  switch (status) {
    case "attending":
      return "border-emerald-200/60 hover:border-emerald-300/80";
    case "declined":
      return "border-red-200/60 hover:border-red-300/80";
    default:
      return "border-amber-200/60 hover:border-amber-300/80";
  }
};

export type Priority = "low" | "medium" | "high" | "critical";

export type PhaseStatus =
  | "upcoming"
  | "current"
  | "past"
  | "overdue"
  | "compressed";

export const getPhaseStatusStyle = (status: PhaseStatus): StatusStyle => {
  switch (status) {
    case "current":
      return {
        containerClass:
          "bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-200 shadow-sm",
        textClass: "text-blue-700",
        bgClass: "bg-blue-100",
        borderClass: "border-blue-300",
      };
    case "past":
      return {
        containerClass: "bg-green-100 text-green-700 border-green-300",
        textClass: "text-green-700",
        bgClass: "bg-green-100",
        borderClass: "border-green-300",
      };
    case "overdue":
      return {
        containerClass:
          "bg-red-100 text-red-700 border-red-300 ring-2 ring-red-200",
        textClass: "text-red-700",
        bgClass: "bg-red-100",
        borderClass: "border-red-300",
      };
    case "compressed":
      return {
        containerClass:
          "bg-orange-100 text-orange-700 border-orange-300 ring-2 ring-orange-200",
        textClass: "text-orange-700",
        bgClass: "bg-orange-100",
        borderClass: "border-orange-300",
      };
    default: // upcoming
      return {
        containerClass: "bg-gray-100 text-gray-600 border-gray-300",
        textClass: "text-gray-600",
        bgClass: "bg-gray-100",
        borderClass: "border-gray-300",
      };
  }
};

export type PaymentStatus =
  | "not_paid"
  | "deposit_paid"
  | "partial_paid"
  | "fully_paid";

export const getPaymentStatusStyle = (status: PaymentStatus): StatusStyle => {
  switch (status) {
    case "fully_paid":
      return {
        containerClass: "bg-green-100 text-green-700 border-green-200",
        textClass: "text-green-700",
        bgClass: "bg-green-100",
        borderClass: "border-green-200",
      };
    case "partial_paid":
    case "deposit_paid":
      return {
        containerClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
        textClass: "text-yellow-700",
        bgClass: "bg-yellow-100",
        borderClass: "border-yellow-200",
      };
    default:
      return {
        containerClass: "bg-red-100 text-red-700 border-red-200",
        textClass: "text-red-700",
        bgClass: "bg-red-100",
        borderClass: "border-red-200",
      };
  }
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return "from-emerald-400 to-green-500";
  if (percentage >= 60) return "from-blue-400 to-cyan-500";
  if (percentage >= 40) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-pink-500";
};

export const getStatusMessage = (status: PhaseStatus): string => {
  switch (status) {
    case "current":
      return "Focus Here";
    case "past":
      return "Phase Complete";
    case "overdue":
      return "Behind Schedule";
    case "compressed":
      return "Time Compressed";
    default:
      return "Coming Up";
  }
};

export const getStatusIcon = (status: PhaseStatus): string => {
  switch (status) {
    case "current":
      return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
    case "past":
      return "M5 13l4 4L19 7";
    case "overdue":
      return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z";
    default:
      return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
  }
};

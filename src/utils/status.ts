import { PaymentStatus, RSVPStatus } from "../types";

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

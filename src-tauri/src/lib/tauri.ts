// Tauri 2.0 API helpers
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { fetch } from "@tauri-apps/plugin-http";
import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";

// Types for the wedding planner data structures
export interface WeddingPlan {
  couple_name1: string;
  couple_name2: string;
  wedding_date: string;
  budget: number;
  todos: TodoItem[];
  guests: Guest[];
  tables: Table[];
  wishlist: WishlistItem[];
  media: MediaItem[];
  ceremony: CeremonyDetails;
  reception: ReceptionDetails;
  contact_info: WeddingContactInfo;
  dress_code?: string;
  theme?: string;
  colors?: string;
  rsvp_deadline?: string;
  gift_message?: string;
  special_instructions?: string;
  parking?: string;
  transportation?: string;
  accommodation?: string;
  weather_plan?: string;
  website?: string;
  hashtag?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  cost?: number;
  budget?: number;
  payment_status?: string;
  due_date?: string;
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;
  vendor_phone?: string;
  notes?: string;
  completion_date?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp_status: "pending" | "attending" | "declined";
  meal_preference: string;
  plus_ones: PlusOne[];
  notes: string;
}

export interface PlusOne {
  id: string;
  name: string;
  meal_preference: string;
  notes: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  assigned_guests: string[];
  shape?: "round" | "rectangular";
  x?: number;
  y?: number;
  seat_assignments?: SeatAssignment[];
}

export interface SeatAssignment {
  tableId: string;
  seatNumber: number;
  guestId: string;
  guestName: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  product_url: string;
  status: "available" | "reserved" | "purchased";
  reserved_by?: string;
  reserved_at?: string;
  notes?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  type: "image" | "video";
  category:
    | "ceremony"
    | "reception"
    | "preparation"
    | "portraits"
    | "party"
    | "other";
  uploadedAt: string;
  uploadedBy: string;
  caption?: string;
  tags: string[];
  isFavorite: boolean;
  fileSize: number;
  dimensions?: { width: number; height: number };
  duration?: number;
  thumbnailPath?: string;
}

export interface CeremonyDetails {
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  time?: string;
  duration?: string;
  officiant?: string;
}

export interface ReceptionDetails {
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  time?: string;
  endTime?: string;
  cocktailHour?: string;
  dinnerTime?: string;
  dancingTime?: string;
}

export interface WeddingContactInfo {
  coupleEmail?: string;
  couplePhone?: string;
  plannerName?: string;
  plannerEmail?: string;
  plannerPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// Wedding Plan API
export const weddingPlanAPI = {
  async save(plan: WeddingPlan): Promise<void> {
    return await invoke("save_wedding_plan", { plan });
  },

  async load(): Promise<WeddingPlan> {
    return await invoke("load_wedding_plan");
  },

  async syncWithBackend(
    backendUrl: string,
    authToken?: string
  ): Promise<string> {
    return await invoke("sync_with_backend", { backendUrl, authToken });
  },

  async generateGuestLink(planId: string, backendUrl: string): Promise<string> {
    return await invoke("generate_guest_link", { planId, backendUrl });
  },
};

// Media API
export const mediaAPI = {
  async saveFile(fileName: string, fileData: Uint8Array): Promise<string> {
    return await invoke("save_media_file", {
      fileName,
      fileData: Array.from(fileData),
    });
  },

  async getFileData(filename: string): Promise<Uint8Array> {
    const data: number[] = await invoke("get_media_file_data", { filename });
    return new Uint8Array(data);
  },

  async deleteFile(filename: string): Promise<void> {
    return await invoke("delete_media_file", { filename });
  },

  async getFileInfo(
    filename: string
  ): Promise<{ size: number; dimensions?: { width: number; height: number } }> {
    const [size, dimensions] = await invoke("get_media_file_info", {
      filename,
    });
    return { size, dimensions };
  },

  async selectFiles(): Promise<string[]> {
    const files = await open({
      multiple: true,
      filters: [
        {
          name: "Media",
          extensions: [
            "png",
            "jpg",
            "jpeg",
            "gif",
            "webp",
            "mp4",
            "mov",
            "avi",
          ],
        },
      ],
    });

    if (!files) return [];
    return Array.isArray(files) ? files : [files];
  },
};

// Notification API
export const notificationAPI = {
  async send(title: string, message: string): Promise<void> {
    // Check and request permission if needed
    let permission = await isPermissionGranted();
    if (!permission) {
      permission = (await requestPermission()) === "granted";
    }

    if (permission) {
      await invoke("send_notification", { title, message });
    }
  },
};

// Utility functions for mobile detection
export const deviceUtils = {
  isMobile(): boolean {
    return (
      window.__TAURI_INTERNALS__?.metadata?.currentTarget?.includes("mobile") ??
      false
    );
  },

  isAndroid(): boolean {
    return window.__TAURI_INTERNALS__?.metadata?.currentTarget === "android";
  },

  isIOS(): boolean {
    return window.__TAURI_INTERNALS__?.metadata?.currentTarget === "ios";
  },

  isDesktop(): boolean {
    return !this.isMobile();
  },
};

// Enhanced error handling
export class WeddingPlannerError extends Error {
  constructor(message: string, public code?: string, public context?: any) {
    super(message);
    this.name = "WeddingPlannerError";
  }
}

// Helper function to handle Tauri errors consistently
export function handleTauriError(error: any): WeddingPlannerError {
  if (typeof error === "string") {
    return new WeddingPlannerError(error);
  }

  if (error instanceof Error) {
    return new WeddingPlannerError(error.message, "tauri_error", error);
  }

  return new WeddingPlannerError(
    "An unknown error occurred",
    "unknown_error",
    error
  );
}

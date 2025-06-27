export type RSVPStatus = "pending" | "attending" | "declined";

export type TableShape = "round" | "rectangular";

export type WishStatus = "available" | "reserved" | "purchased";

export type MediaType = "image" | "video";

export type MediaCategory =
  | "ceremony"
  | "reception"
  | "preparation"
  | "portraits"
  | "party"
  | "other";

export interface SeatAssignment {
  tableId: string;
  seatNumber: number;
  guestId: string;
  guestName: string;
}

export type TabId =
  | "overview"
  | "details"
  | "todos"
  | "guests"
  | "seating"
  | "timeline"
  | "wishlist"
  | "gallery";

export interface PlusOne {
  id: string;
  name: string;
  meal_preference: string;
  notes: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp_status: RSVPStatus;
  meal_preference: string;
  plus_ones: PlusOne[];
  notes: string;
  assigned_seat?: number;
}

export interface Seat {
  id: number;
  guestId: string | null;
  guestName: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  assigned_guests: string[]; // Array of guest IDs assigned to this table
  shape?: TableShape;
  seatAssignments: SeatAssignment[];
}

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  cost?: number;
  payment_status?: string;
  due_date?: string;
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;
  vendor_phone?: string;
  notes?: string;
  completion_date?: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  product_url: string;
  status: WishStatus;
  reserved_by?: string; // Guest name who reserved it
  reserved_at?: string;
  notes?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  type: MediaType;
  category: MediaCategory;
  uploadedAt: string;
  uploadedBy: string; // Name of person who uploaded
  caption?: string;
  tags?: string[];
  isFavorite: boolean;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // For videos, in seconds
  thumbnailPath?: string; // For videos
}

// Extended wedding details
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

  // Extended wedding details
  ceremony?: CeremonyDetails;
  reception?: ReceptionDetails;
  contactInfo?: WeddingContactInfo;

  // Additional details
  dressCode?: string;
  theme?: string;
  colors?: string;
  rsvpDeadline?: string;
  giftMessage?: string;
  specialInstructions?: string;
  parking?: string;
  transportation?: string;
  accommodation?: string;
  weatherPlan?: string;
  website?: string;
  hashtag?: string;

  // Schedule/Timeline
  gettingReadyTime?: string;
  photosTime?: string;
  ceremonyStartTime?: string;
  cocktailStartTime?: string;
  receptionStartTime?: string;
  cakeTime?: string;
  bouquetTossTime?: string;
  lastDanceTime?: string;
}

export interface TableFormData {
  name: string;
  seats: number;
  shape: TableShape;
}

export interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  rsvp_status: RSVPStatus;
  meal_preference: string;
  plus_ones: PlusOne[];
  notes: string;
}

export interface WishlistFormData {
  title: string;
  price: number;
  currency: string;
  image_url: string;
  product_url: string;
  notes?: string;
}

export interface MediaUploadData {
  category: MediaCategory;
  caption?: string;
  tags?: string[];
  uploadedBy: string;
}

export interface SeatingStats {
  totalSeats: number;
  occupiedSeats: number;
  unseatedGuests: number;
}

export interface GuestStats {
  attending: Guest[];
  declined: Guest[];
  pending: Guest[];
  totalAttendees: number;
}

export interface TodoFormData {
  cost?: number;
  payment_status?: string;
  due_date?: string;
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;
  vendor_phone?: string;
  notes?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  spentPercentage?: number;
  daysUntilWedding: number | null;
  totalGuests: number;
  attendingGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  totalAttendees: number;
  completedTodos: number;
  totalTodos: number;
  todoProgress: number;
  totalTables: number;
  totalSeats: number;
  occupiedSeats: number;
  weddingDate: string;
}

export interface PinterestPin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  boardName?: string;
  creatorName?: string;
  saveCount?: number;
}

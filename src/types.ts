export type RSVPStatus = "pending" | "attending" | "declined";

export type TableShape = "round" | "rectangular";

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
  | "timeline";

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

export interface WeddingPlan {
  couple_name1: string;
  couple_name2: string;
  wedding_date: string;
  budget: number;
  todos: TodoItem[];
  guests: Guest[];
  tables: Table[];
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

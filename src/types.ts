export type RSVPStatus = "pending" | "attending" | "declined";

export type TableShape = "round" | "rectangular";

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
}

export interface Seat {
  id: number;
  guestId: string | null;
  guestName: string;
}

export interface Table {
  id: number;
  name: string;
  seats: Seat[];
  shape: TableShape;
}

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
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

// Extended types for frontend use (seating chart)
export interface AttendeeWithType {
  id: string;
  name: string;
  type: "main";
  parentGuestId: null;
}

export interface PlusOneAttendee {
  id: string;
  name: string;
  type: "plus_one";
  parentGuestId: string;
}

export type Attendee = AttendeeWithType | PlusOneAttendee;

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

export interface DragState {
  isDragging: boolean;
  draggedGuest: Attendee | null;
  draggedFromSeat: { tableId: number; seatId: number } | null;
  dragPosition: { x: number; y: number };
  hoveredSeat: { tableId: number; seatId: number } | null;
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

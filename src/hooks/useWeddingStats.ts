import { createMemo } from "solid-js";
import { WeddingPlan } from "../types";

export const useWeddingStats = (weddingPlan: () => WeddingPlan) => {
  return createMemo(() => {
    const plan = weddingPlan();

    // Calculate days until wedding
    const daysUntilWedding = plan.wedding_date
      ? Math.ceil(
          (new Date(plan.wedding_date).getTime() - new Date().getTime()) /
            (1000 * 3600 * 24)
        )
      : null;

    // Calculate guest stats
    const totalGuests = plan.guests.length;
    const attendingGuests = plan.guests.filter(
      (g) => g.rsvp_status === "attending"
    );
    const declinedGuests = plan.guests.filter(
      (g) => g.rsvp_status === "declined"
    );
    const pendingGuests = plan.guests.filter(
      (g) => g.rsvp_status === "pending"
    );

    // Calculate total attendees (including plus ones)
    const totalAttendees = attendingGuests.reduce((sum, guest) => {
      return sum + 1 + (guest.plus_ones?.length || 0);
    }, 0);

    // Calculate budget info
    const totalBudget = plan.budget;
    const totalSpent = plan.todos.reduce(
      (sum, todo) => sum + (todo.cost || 0),
      0
    );
    const remainingBudget = totalBudget - totalSpent;

    // Calculate todo progress
    const completedTodos = plan.todos.filter((t) => t.completed).length;
    const totalTodos = plan.todos.length;
    const todoProgress =
      totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    // Calculate seating info
    const totalTables = plan.tables.length;
    const totalSeats = plan.tables.reduce(
      (sum, table) => sum + table.seats.length,
      0
    );
    const occupiedSeats = plan.tables.reduce(
      (sum, table) => sum + table.seats.filter((seat) => seat.guestId).length,
      0
    );

    return {
      daysUntilWedding,
      totalGuests,
      attendingGuests: attendingGuests.length,
      declinedGuests: declinedGuests.length,
      pendingGuests: pendingGuests.length,
      totalAttendees,
      totalBudget,
      totalSpent,
      remainingBudget,
      completedTodos,
      totalTodos,
      todoProgress,
      totalTables,
      totalSeats,
      occupiedSeats,
      weddingDate: plan.wedding_date,
    };
  });
};

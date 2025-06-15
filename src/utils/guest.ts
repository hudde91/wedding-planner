/**
 * Guest counting and statistics utilities
 * Consolidates all guest-related calculations
 */

import { Guest, RSVPStatus } from "../types";

export interface GuestStats {
  totalGuests: number;
  attendingGuests: Guest[];
  declinedGuests: Guest[];
  pendingGuests: Guest[];
  totalAttendees: number;
  responseRate: number;
  attendanceRate: number;
}

export const calculateGuestStats = (guests: Guest[]): GuestStats => {
  const attendingGuests = guests.filter((g) => g.rsvp_status === "attending");
  const declinedGuests = guests.filter((g) => g.rsvp_status === "declined");
  const pendingGuests = guests.filter((g) => g.rsvp_status === "pending");

  const totalAttendees = attendingGuests.reduce((sum, guest) => {
    return sum + 1 + (guest.plus_ones?.length || 0);
  }, 0);

  const respondedGuests = attendingGuests.length + declinedGuests.length;
  const responseRate =
    guests.length > 0 ? Math.round((respondedGuests / guests.length) * 100) : 0;
  const attendanceRate =
    respondedGuests > 0
      ? Math.round((attendingGuests.length / respondedGuests) * 100)
      : 0;

  return {
    totalGuests: guests.length,
    attendingGuests,
    declinedGuests,
    pendingGuests,
    totalAttendees,
    responseRate,
    attendanceRate,
  };
};

export const countGuestsByStatus = (
  guests: Guest[],
  status: RSVPStatus
): number => {
  return guests.filter((guest) => guest.rsvp_status === status).length;
};

export const countTotalAttendees = (guests: Guest[]): number => {
  return guests
    .filter((guest) => guest.rsvp_status === "attending")
    .reduce((sum, guest) => sum + 1 + (guest.plus_ones?.length || 0), 0);
};

export const countPlusOnes = (guests: Guest[]): number => {
  return guests
    .filter((guest) => guest.rsvp_status === "attending")
    .reduce((sum, guest) => sum + (guest.plus_ones?.length || 0), 0);
};

export const getGuestPartySize = (
  guest: Guest
): { main: number; plusOnes: number; total: number } => {
  const plusOnes = guest.plus_ones?.length || 0;
  return {
    main: 1,
    plusOnes,
    total: 1 + plusOnes,
  };
};

export const getUnassignedAttendees = (
  guests: Guest[],
  assignedGuestIds: string[]
) => {
  const attendingGuests = guests.filter((g) => g.rsvp_status === "attending");

  const attendees: Array<{
    id: string;
    name: string;
    type: "main" | "plus_one";
    originalGuestId: string;
  }> = [];

  attendingGuests.forEach((guest) => {
    // Add main guest
    attendees.push({
      id: guest.id,
      name: guest.name,
      type: "main",
      originalGuestId: guest.id,
    });

    // Add plus ones as separate attendees
    guest.plus_ones?.forEach((plusOne, index) => {
      attendees.push({
        id: `${guest.id}_plus_${index}`,
        name: plusOne.name || `${guest.name}'s Guest ${index + 1}`,
        type: "plus_one",
        originalGuestId: guest.id,
      });
    });
  });

  return attendees.filter(
    (attendee) => !assignedGuestIds.includes(attendee.id)
  );
};

export const getGuestsByMealPreference = (
  guests: Guest[]
): Record<string, Guest[]> => {
  const attendingGuests = guests.filter((g) => g.rsvp_status === "attending");

  return attendingGuests.reduce((acc, guest) => {
    const preference = guest.meal_preference || "No preference";
    if (!acc[preference]) {
      acc[preference] = [];
    }
    acc[preference].push(guest);
    return acc;
  }, {} as Record<string, Guest[]>);
};

export const getGuestsWithPlusOnes = (guests: Guest[]): Guest[] => {
  return guests.filter(
    (guest) => guest.plus_ones && guest.plus_ones.length > 0
  );
};

export const getGuestsWithoutRSVP = (guests: Guest[]): Guest[] => {
  return guests.filter((guest) => guest.rsvp_status === "pending");
};

export const findGuestById = (
  guests: Guest[],
  id: string
): Guest | undefined => {
  return guests.find((guest) => guest.id === id);
};

export const searchGuests = (guests: Guest[], query: string): Guest[] => {
  const lowercaseQuery = query.toLowerCase();
  return guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(lowercaseQuery) ||
      guest.email.toLowerCase().includes(lowercaseQuery) ||
      guest.phone.includes(query)
  );
};

export interface GuestInsights {
  largestPartySize: number;
  mostCommonMealPreference: string;
  guestsNeedingFollowUp: Guest[];
  estimatedFinalCount: number;
}

export const generateGuestInsights = (guests: Guest[]): GuestInsights => {
  const partySizes = guests.map((guest) => getGuestPartySize(guest).total);
  const largestPartySize = Math.max(...partySizes, 0);

  const mealPreferences = getGuestsByMealPreference(guests);
  const mostCommonMealPreference =
    Object.entries(mealPreferences).sort(
      ([, a], [, b]) => b.length - a.length
    )[0]?.[0] || "No preference";

  const guestsNeedingFollowUp = guests.filter(
    (guest) => guest.rsvp_status === "pending" && guest.email
  );

  // Estimate final count assuming 70% of pending guests will attend
  const stats = calculateGuestStats(guests);
  const estimatedAttending =
    stats.attendingGuests.length + Math.round(stats.pendingGuests.length * 0.7);
  const estimatedFinalCount =
    guests
      .filter((g) => g.rsvp_status === "attending")
      .reduce((sum, guest) => sum + getGuestPartySize(guest).total, 0) +
    Math.round(stats.pendingGuests.length * 0.7 * 1.5); // Assume avg 1.5 people per pending guest

  return {
    largestPartySize,
    mostCommonMealPreference,
    guestsNeedingFollowUp,
    estimatedFinalCount,
  };
};

/**
 * Guest counting and statistics utilities
 * Consolidates all guest-related calculations
 */

import { Guest, TableShape } from "../types";

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

export interface SeatPosition {
  x: number;
  y: number;
  tableWidth?: number;
  tableHeight?: number;
  radius?: number;
  tableRadius?: number;
}

import { JSX } from "solid-js";

interface SeatLayoutProps {
  seatNumber: number;
  totalSeats: number;
  shape: TableShape;
  children?: JSX.Element;
}

export const getSeatPosition = (
  seatNumber: number,
  totalSeats: number,
  shape: TableShape
): SeatPosition => {
  if (shape === "rectangular") {
    const dotsPerSide = Math.ceil(totalSeats / 2);
    const remainingDots = totalSeats - dotsPerSide;
    const minWidth = 200;
    const maxWidth = 500;
    const seatSpacing = 40;
    const maxSeatsOnSide = Math.max(dotsPerSide, remainingDots);

    const calculatedWidth = Math.max(
      minWidth,
      (maxSeatsOnSide + 1) * seatSpacing
    );
    const tableWidth = Math.min(maxWidth, calculatedWidth);
    const baseHeight = 80;
    const tableHeight = Math.max(baseHeight, Math.min(150, tableWidth * 0.3));
    const seatOffset = 30;

    const centerX = 140;
    const centerY = 140;

    if (seatNumber <= dotsPerSide) {
      const topSpacing = tableWidth / (dotsPerSide + 1);
      const x = centerX - tableWidth / 2 + topSpacing * seatNumber;
      const y = centerY - tableHeight / 2 - seatOffset;
      return { x, y, tableWidth, tableHeight };
    } else {
      const bottomIndex = seatNumber - dotsPerSide;
      const bottomSpacing = tableWidth / (remainingDots + 1);
      const x = centerX - tableWidth / 2 + bottomSpacing * bottomIndex;
      const y = centerY + tableHeight / 2 + seatOffset;
      return { x, y, tableWidth, tableHeight };
    }
  } else {
    // Round table
    const minRadius = 80;
    const maxRadius = 180;
    const minSeatSpacing = 50;

    const requiredRadius = (minSeatSpacing * totalSeats) / (2 * Math.PI);
    const radius = Math.max(minRadius, Math.min(maxRadius, requiredRadius));
    const tableRadius = Math.max(60, radius * 0.6);

    const centerX = 140;
    const centerY = 140;

    const angleStep = (2 * Math.PI) / totalSeats;
    const angle = (seatNumber - 1) * angleStep - Math.PI / 2;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y, radius, tableRadius };
  }
};

export const getTableDimensions = (totalSeats: number, shape: TableShape) => {
  if (totalSeats === 0)
    return { width: 200, height: 80, radius: 80, tableRadius: 60 };

  const firstSeatPos = getSeatPosition(1, totalSeats, shape);

  if (shape === "rectangular") {
    return {
      width: firstSeatPos.tableWidth || 200,
      height: firstSeatPos.tableHeight || 80,
      radius: 0,
      tableRadius: 0,
    };
  } else {
    return {
      width: 0,
      height: 0,
      radius: firstSeatPos.radius || 80,
      tableRadius: firstSeatPos.tableRadius || 60,
    };
  }
};

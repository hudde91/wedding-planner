import { createSignal, onMount, onCleanup } from "solid-js";
import { Attendee } from "../types";

export interface DragState {
  isDragging: boolean;
  draggedGuest: Attendee | null;
  draggedFromSeat: { tableId: number; seatId: number } | null;
  dragPosition: { x: number; y: number };
  hoveredSeat: { tableId: number; seatId: number } | null;
}

export const useDragAndDrop = () => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [draggedGuest, setDraggedGuest] = createSignal<Attendee | null>(null);
  const [draggedFromSeat, setDraggedFromSeat] = createSignal<{
    tableId: number;
    seatId: number;
  } | null>(null);
  const [dragPosition, setDragPosition] = createSignal({ x: 0, y: 0 });
  const [hoveredSeat, setHoveredSeat] = createSignal<{
    tableId: number;
    seatId: number;
  } | null>(null);

  const handleMouseDown = (
    attendee: Attendee,
    fromSeat?: { tableId: number; seatId: number }
  ): void => {
    setDraggedGuest(attendee);
    setDraggedFromSeat(fromSeat || null);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (isDragging() && draggedGuest()) {
      setDragPosition({ x: e.clientX, y: e.clientY });

      const element = document.elementFromPoint(e.clientX, e.clientY);
      const seatElement = element?.closest(
        "[data-seat-id]"
      ) as HTMLElement | null;

      if (seatElement) {
        const tableId = parseInt(
          seatElement.getAttribute("data-table-id") || "0"
        );
        const seatId = parseInt(
          seatElement.getAttribute("data-seat-id") || "0"
        );
        setHoveredSeat({ tableId, seatId });
      } else {
        setHoveredSeat(null);
      }
    }
  };

  const handleMouseUp = (
    e: MouseEvent,
    onDrop: (e: MouseEvent, tableId: number, seatId: number) => void
  ): void => {
    if (!isDragging() || !draggedGuest()) {
      resetDrag();
      return;
    }

    const element = document.elementFromPoint(e.clientX, e.clientY);
    const seatElement = element?.closest(
      "[data-seat-id]"
    ) as HTMLElement | null;

    if (seatElement) {
      const tableId = parseInt(
        seatElement.getAttribute("data-table-id") || "0"
      );
      const seatId = parseInt(seatElement.getAttribute("data-seat-id") || "0");
      onDrop(e, tableId, seatId);
    }

    resetDrag();
  };

  const resetDrag = (): void => {
    setIsDragging(false);
    setDraggedGuest(null);
    setDraggedFromSeat(null);
    setHoveredSeat(null);
  };

  onMount(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("mousemove", handleMouseMove);

      onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove);
      });
    }
  });

  return {
    isDragging,
    draggedGuest,
    draggedFromSeat,
    dragPosition,
    hoveredSeat,
    handleMouseDown,
    handleMouseUp,
    resetDrag,
  };
};

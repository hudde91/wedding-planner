import { Component } from "solid-js";
import { Seat, Attendee } from "../../types";

interface SeatComponentProps {
  seat: Seat;
  tableId: number;
  availableGuests: Attendee[];
  isDragging: boolean;
  isHovered: boolean;
  draggedGuest: Attendee | null;
  onMouseDown: (
    attendee: Attendee,
    fromSeat: { tableId: number; seatId: number }
  ) => void;
  onRemoveGuest: (tableId: number, seatId: number) => void;
}

const SeatComponent: Component<SeatComponentProps> = (props) => {
  return (
    <div
      data-table-id={props.tableId}
      data-seat-id={props.seat.id}
      class={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${
        props.seat.guestId
          ? "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200"
          : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200 border-dashed"
      } ${
        props.isDragging && props.isHovered
          ? props.seat.guestId
            ? "ring-2 ring-orange-300 bg-orange-100"
            : "ring-2 ring-green-300 bg-green-100"
          : props.isDragging
          ? "ring-1 ring-purple-300"
          : ""
      }`}
      title={
        props.isDragging && props.isHovered
          ? props.seat.guestId
            ? `Replace ${props.seat.guestName}?`
            : `Drop ${props.draggedGuest?.name} here`
          : props.seat.guestId
          ? `${props.seat.guestName} - Click to remove`
          : "Drop guest here"
      }
      onClick={(e) => {
        if (props.seat.guestId && !props.isDragging) {
          e.stopPropagation();
          props.onRemoveGuest(props.tableId, props.seat.id);
        }
      }}
    >
      {props.seat.guestId ? (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            const attendee = props.availableGuests.find(
              (a) => a.id === props.seat.guestId
            );
            if (attendee) {
              props.onMouseDown(attendee, {
                tableId: props.tableId,
                seatId: props.seat.id,
              });
            }
          }}
          class="text-center leading-tight cursor-move w-full h-full flex items-center justify-center pointer-events-auto select-none text-xs"
        >
          {props.seat.guestName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()}
        </div>
      ) : (
        <div class="text-center pointer-events-none text-xs">+</div>
      )}
    </div>
  );
};

export default SeatComponent;

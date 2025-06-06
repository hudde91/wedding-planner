import { Component, For } from "solid-js";
import { Table, Attendee, TableShape } from "../../types";
import SeatComponent from "./SeatComponent";

interface TableComponentProps {
  table: Table;
  availableGuests: Attendee[];
  isDragging: boolean;
  draggedGuest: Attendee | null;
  hoveredSeat: { tableId: number; seatId: number } | null;
  onEditTable: (table: Table) => void;
  onDeleteTable: (tableId: number) => void;
  onMouseDownGuest: (
    attendee: Attendee,
    fromSeat?: { tableId: number; seatId: number }
  ) => void;
  onRemoveGuest: (tableId: number, seatId: number) => void;
}

const TableComponent: Component<TableComponentProps> = (props) => {
  const getTableSize = (seatCount: number, shape: TableShape) => {
    if (shape === "rectangular") {
      const dotsPerSide = Math.ceil(seatCount / 2);
      const remainingDots = seatCount - dotsPerSide;
      const maxDotsOnSide = Math.max(dotsPerSide, remainingDots);
      const baseWidth = 120;
      const baseHeight = 50;
      const widthPerDot = 32;
      const calculatedWidth = Math.max(
        baseWidth,
        maxDotsOnSide * widthPerDot + 40
      );
      return { width: calculatedWidth, height: baseHeight };
    } else {
      const baseSize = 40;
      const sizePerSeat = 3;
      const maxSize = 70;
      const calculatedSize = Math.min(
        maxSize,
        baseSize + seatCount * sizePerSeat
      );
      return { width: calculatedSize, height: calculatedSize };
    }
  };

  const getContainerSize = (seatCount: number, shape: TableShape) => {
    const tableSize = getTableSize(seatCount, shape);
    if (shape === "rectangular") {
      const width = tableSize.width + 80;
      const height = tableSize.height + 100;
      return { width: Math.max(250, width), height: Math.max(150, height) };
    } else {
      const size = Math.max(120, tableSize.width + 64);
      return { width: size, height: size };
    }
  };

  const getSeatStyle = (
    index: number,
    total: number,
    shape: TableShape
  ): string => {
    if (shape === "rectangular") {
      const tableSize = getTableSize(total, shape);
      const containerSize = getContainerSize(total, shape);
      const dotsPerSide = Math.ceil(total / 2);
      const remainingDots = total - dotsPerSide;

      if (index < dotsPerSide) {
        const topSpacing = tableSize.width / (dotsPerSide + 1);
        const x =
          (containerSize.width - tableSize.width) / 2 +
          topSpacing * (index + 1);
        const y = (containerSize.height - tableSize.height) / 2 - 32;
        return `left: ${x}px; top: ${y}px; transform: translateX(-50%);`;
      } else {
        const bottomIndex = index - dotsPerSide;
        const bottomSpacing = tableSize.width / (remainingDots + 1);
        const x =
          (containerSize.width - tableSize.width) / 2 +
          bottomSpacing * (bottomIndex + 1);
        const y =
          (containerSize.height - tableSize.height) / 2 + tableSize.height;
        return `left: ${x}px; top: ${y}px; transform: translateX(-50%);`;
      }
    } else {
      const tableSize = getTableSize(total, shape);
      const containerSize = getContainerSize(total, shape);
      const angleStep = (2 * Math.PI) / total;
      const angle = index * angleStep - Math.PI / 2;
      const tableRadius = tableSize.width / 2;
      const seatDistance = 18;
      const seatRadius = tableRadius + seatDistance;
      const centerX = containerSize.width / 2;
      const centerY = containerSize.height / 2;
      const x = centerX + seatRadius * Math.cos(angle);
      const y = centerY + seatRadius * Math.sin(angle);
      return `left: ${x}px; top: ${y}px; transform: translate(-50%, -50%);`;
    }
  };

  const tableSize = getTableSize(props.table.seats.length, props.table.shape);
  const containerSize = getContainerSize(
    props.table.seats.length,
    props.table.shape
  );

  return (
    <div class="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-semibold text-gray-800 truncate">
          {props.table.name}
        </h3>
        <div class="flex space-x-1">
          <button
            onClick={() => props.onEditTable(props.table)}
            class="text-blue-500 hover:text-blue-700 p-1"
            title="Edit table"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => props.onDeleteTable(props.table.id)}
            class="text-red-500 hover:text-red-700 p-1"
            title="Delete table"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div
        class="relative border-2 border-dashed border-gray-300 rounded-lg overflow-visible p-4 mx-auto"
        style={`width: ${containerSize.width}px; height: ${containerSize.height}px;`}
      >
        {/* Table representation */}
        <div
          class={`absolute ${
            props.table.shape === "round" ? "rounded-full" : "rounded-lg"
          } bg-amber-100 border-2 border-amber-300`}
          style={`width: ${tableSize.width}px; height: ${
            tableSize.height
          }px; left: ${(containerSize.width - tableSize.width) / 2}px; top: ${
            (containerSize.height - tableSize.height) / 2
          }px;`}
        ></div>

        {/* Seats */}
        <For each={props.table.seats}>
          {(seat, index) => (
            <div
              class="absolute"
              style={getSeatStyle(
                index(),
                props.table.seats.length,
                props.table.shape
              )}
            >
              <SeatComponent
                seat={seat}
                tableId={props.table.id}
                availableGuests={props.availableGuests}
                isDragging={props.isDragging}
                isHovered={
                  props.hoveredSeat?.tableId === props.table.id &&
                  props.hoveredSeat?.seatId === seat.id
                }
                draggedGuest={props.draggedGuest}
                onMouseDown={props.onMouseDownGuest}
                onRemoveGuest={props.onRemoveGuest}
              />
            </div>
          )}
        </For>
      </div>

      <div class="text-center text-xs text-gray-500 mt-2">
        {props.table.seats.filter((seat) => seat.guestId).length} /{" "}
        {props.table.seats.length} seats filled
      </div>
    </div>
  );
};

export default TableComponent;

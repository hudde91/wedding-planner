import { Component, For, createMemo } from "solid-js";
import { Table, SeatAssignment } from "../../types";
import { getTableDimensions, getSeatPosition } from "../../utils/guest";

interface TableViewProps {
  table: Table;
  seatAssignments: SeatAssignment[];
  onSeatClick?: (seatNumber: number) => void;
  onRemoveAssignment?: (guestId: string) => void;
  interactive?: boolean;
  title?: string;
}

const TableView: Component<TableViewProps> = (props) => {
  // Mobile-optimized container dimensions
  const CONTAINER_WIDTH = 320;
  const CONTAINER_HEIGHT = 320;
  const CENTER_X = CONTAINER_WIDTH / 2;
  const CENTER_Y = CONTAINER_HEIGHT / 2;

  const tableDimensions = createMemo(() =>
    getTableDimensions(props.table.capacity, props.table.shape || "round")
  );

  const seatPositions = createMemo(() =>
    Array.from({ length: props.table.capacity }, (_, i) => {
      const seatNumber = i + 1;
      return {
        seatNumber,
        position: getSeatPosition(
          seatNumber,
          props.table.capacity,
          props.table.shape || "round"
        ),
      };
    })
  );

  const getOccupiedSeats = () =>
    props.seatAssignments.filter((a) => a.tableId === props.table.id);

  return (
    <div class="animate-fade-in-up">
      {/* Mobile-optimized table layout */}
      <div class="p-4 sm:p-8">
        <div class="relative w-80 h-80 mx-auto">
          {/* Table Surface */}
          {props.table.shape === "rectangular" ? (
            <div
              class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border-4 border-amber-200 shadow-xl"
              style={`left: ${CENTER_X - tableDimensions().width / 2}px; top: ${
                CENTER_Y - tableDimensions().height / 2
              }px; width: ${tableDimensions().width}px; height: ${
                tableDimensions().height
              }px;`}
            >
              <div class="w-full h-full flex items-center justify-center">
                <div class="text-center">
                  <div class="text-lg sm:text-xl font-bold text-amber-800">
                    {props.title || props.table.name}
                  </div>
                  <div class="text-xs text-amber-700 mt-1">
                    Rectangular • {props.table.capacity} seats
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-full border-4 border-amber-200 shadow-xl"
              style={`left: ${
                CENTER_X - tableDimensions().tableRadius
              }px; top: ${CENTER_Y - tableDimensions().tableRadius}px; width: ${
                tableDimensions().tableRadius * 2
              }px; height: ${tableDimensions().tableRadius * 2}px;`}
            >
              <div class="w-full h-full flex items-center justify-center">
                <div class="text-center">
                  <div class="text-xl sm:text-2xl font-bold text-amber-800">
                    {props.title || props.table.name}
                  </div>
                  <div class="text-sm text-amber-700 mt-1">
                    Round Table • {props.table.capacity} seats
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seats */}
          <For each={seatPositions()}>
            {(seatData) => {
              const occupiedBy = getOccupiedSeats().find(
                (a) => a.seatNumber === seatData.seatNumber
              );
              const isOccupied = !!occupiedBy;
              const isClickable = props.interactive && !isOccupied;

              // Adjust positions for mobile-optimized layout
              const adjustedX = seatData.position.x + (CENTER_X - 120);
              const adjustedY = seatData.position.y + (CENTER_Y - 120);

              return (
                <button
                  class={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg touch-manipulation ${
                    isOccupied
                      ? "bg-gradient-to-br from-purple-400 to-violet-500 text-white"
                      : isClickable
                      ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white hover:scale-110 hover:shadow-xl cursor-pointer"
                      : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                  }`}
                  style={`left: ${adjustedX - 24}px; top: ${adjustedY - 24}px;`}
                  onClick={() =>
                    isClickable && props.onSeatClick?.(seatData.seatNumber)
                  }
                  disabled={!isClickable}
                  title={
                    isOccupied
                      ? `Seat ${seatData.seatNumber} - ${occupiedBy?.guestName}`
                      : `Seat ${seatData.seatNumber} - Available`
                  }
                >
                  {isOccupied ? (
                    <svg
                      class="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  ) : (
                    seatData.seatNumber
                  )}
                </button>
              );
            }}
          </For>
        </div>
      </div>

      {/* Mobile-optimized guest list */}
      {getOccupiedSeats().length > 0 && (
        <div class="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl">
          <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Seated Guests
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <For
              each={getOccupiedSeats().sort(
                (a, b) => a.seatNumber - b.seatNumber
              )}
            >
              {(assignment) => (
                <div class="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg border border-purple-100/50">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md text-xs sm:text-sm">
                    {assignment.seatNumber}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {assignment.guestName}
                    </p>
                    <p class="text-purple-600 text-xs sm:text-sm">
                      Seat {assignment.seatNumber}
                    </p>
                  </div>
                  {props.onRemoveAssignment && (
                    <button
                      onClick={() =>
                        props.onRemoveAssignment!(assignment.guestId)
                      }
                      class="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 touch-manipulation"
                      title="Remove from seat"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </For>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;

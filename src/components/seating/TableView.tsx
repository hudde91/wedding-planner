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
    <div class="p-8">
      <div class="relative w-96 h-96 mx-auto">
        {/* Table Surface */}
        {props.table.shape === "rectangular" ? (
          <div
            class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border-4 border-amber-200 shadow-xl"
            style={`left: ${140 - tableDimensions().width / 2}px; top: ${
              140 - tableDimensions().height / 2
            }px; width: ${tableDimensions().width}px; height: ${
              tableDimensions().height
            }px;`}
          >
            <div class="w-full h-full flex items-center justify-center">
              <div class="text-center">
                <div class="text-xl font-bold text-amber-800">
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
            style={`left: ${140 - tableDimensions().tableRadius}px; top: ${
              140 - tableDimensions().tableRadius
            }px; width: ${tableDimensions().tableRadius * 2}px; height: ${
              tableDimensions().tableRadius * 2
            }px;`}
          >
            <div class="w-full h-full flex items-center justify-center">
              <div class="text-center">
                <div class="text-2xl font-bold text-amber-800">
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

            return (
              <button
                class={`absolute w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center text-sm font-bold shadow-lg ${
                  isOccupied
                    ? "bg-gradient-to-br from-purple-400 to-violet-500 text-white"
                    : isClickable
                    ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white hover:scale-110 hover:shadow-xl cursor-pointer"
                    : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                }`}
                style={`left: ${seatData.position.x - 28}px; top: ${
                  seatData.position.y - 28
                }px;`}
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
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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

      {/* Guest List */}
      {getOccupiedSeats().length > 0 && (
        <div class="mt-8">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">
            Seated Guests
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <For
              each={getOccupiedSeats().sort(
                (a, b) => a.seatNumber - b.seatNumber
              )}
            >
              {(assignment) => (
                <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg border border-purple-100/50">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                    {assignment.seatNumber}
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">
                      {assignment.guestName}
                    </p>
                    <p class="text-purple-600 text-sm">
                      Seat {assignment.seatNumber}
                    </p>
                  </div>
                  {props.onRemoveAssignment && (
                    <button
                      onClick={() =>
                        props.onRemoveAssignment!(assignment.guestId)
                      }
                      class="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
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

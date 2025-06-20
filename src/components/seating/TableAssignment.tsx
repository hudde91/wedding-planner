import { Component, For, Show, createSignal, createMemo } from "solid-js";
import { Table, SeatAssignment } from "../../types";
import { getInitials, truncateText } from "../../utils/validation";
import { getSeatPosition, getTableDimensions } from "../../utils/guest";

interface Attendee {
  id: string;
  name: string;
  type: "main" | "plus_one";
}

interface TableAssignmentProps {
  table: Table;
  unassignedAttendees: Attendee[];
  seatAssignments: SeatAssignment[];
  onSeatAssign: (seatNumber: number, guestId: string) => void;
  onRemoveAssignment: (guestId: string) => void;
}

const TableAssignment: Component<TableAssignmentProps> = (props) => {
  const [selectedGuestId, setSelectedGuestId] = createSignal<string | null>(
    null
  );

  // Container dimensions for proper centering
  const CONTAINER_WIDTH = 384; // w-96 = 384px
  const CONTAINER_HEIGHT = 384; // h-96 = 384px
  const CENTER_X = CONTAINER_WIDTH / 2; // 192px
  const CENTER_Y = CONTAINER_HEIGHT / 2; // 192px

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

  const tableAssignments = createMemo(() =>
    props.seatAssignments.filter((a) => a.tableId === props.table.id)
  );

  const hasSelectedGuest = createMemo(() => !!selectedGuestId());

  const selectedGuest = createMemo(() => {
    const guestId = selectedGuestId();
    if (!guestId) return null;

    const found = props.unassignedAttendees.find((g) => g.id === guestId);
    return found;
  });

  const handleSeatClick = (seatNumber: number) => {
    console.log(
      "Seat clicked:",
      seatNumber,
      "Selected guest ID:",
      selectedGuestId()
    );

    const assignment = tableAssignments().find(
      (a) => a.seatNumber === seatNumber
    );
    const guestId = selectedGuestId();

    if (assignment) {
      // Seat is occupied, remove assignment
      console.log("Removing assignment for seat:", seatNumber);
      props.onRemoveAssignment(assignment.guestId);
    } else if (guestId) {
      // Guest is selected and seat is available, assign guest to seat
      console.log("Assigning guest to seat:", seatNumber, guestId);
      props.onSeatAssign(seatNumber, guestId);
      setSelectedGuestId(null);
    } else {
      console.log("No guest selected, cannot assign");
    }
  };

  const handleGuestSelect = (guestId: string) => {
    const newGuestId = guestId === selectedGuestId() ? null : guestId;
    console.log(
      "Guest selection changed:",
      guestId,
      "new selection:",
      newGuestId
    );
    setSelectedGuestId(newGuestId);
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Guest Selection Panel */}
      <div class="space-y-6">
        {/* Selected Guest Info */}
        <Show when={selectedGuest()}>
          <div class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                {getInitials(selectedGuest()!.name)}
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">
                  {selectedGuest()!.name}
                </h4>
                <p class="text-purple-700">
                  {selectedGuest()!.type === "main" ? "Main Guest" : "Plus One"}{" "}
                  • Click a seat to assign
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedGuestId(null)}
              class="w-full py-2 px-4 bg-white/80 hover:bg-white text-gray-700 rounded-lg transition-all duration-300 font-medium"
            >
              Cancel Selection
            </button>
          </div>
        </Show>

        {/* Available Guests */}
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Available Guests
                </h3>
                <p class="text-gray-600 font-light">
                  {props.unassignedAttendees.length} guests awaiting seats
                </p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <Show
              when={props.unassignedAttendees.length > 0}
              fallback={
                <div class="text-center py-12">
                  <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      class="w-8 h-8 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p class="text-gray-600 font-light">
                    All guests have been seated!
                  </p>
                </div>
              }
            >
              <div class="space-y-3 max-h-96 overflow-y-auto">
                <For each={props.unassignedAttendees}>
                  {(attendee) => (
                    <button
                      onClick={() => handleGuestSelect(attendee.id)}
                      class={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] border ${
                        selectedGuestId() === attendee.id
                          ? "bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 shadow-lg"
                          : "bg-gradient-to-r from-white to-emerald-50/50 border-emerald-200 hover:border-emerald-300 hover:shadow-md"
                      }`}
                    >
                      <div class="flex items-center space-x-4">
                        <div
                          class={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                            selectedGuestId() === attendee.id
                              ? "bg-gradient-to-br from-purple-500 to-violet-600"
                              : attendee.type === "main"
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                              : "bg-gradient-to-br from-amber-500 to-orange-600"
                          }`}
                        >
                          {getInitials(attendee.name)}
                        </div>
                        <div class="flex-1">
                          <h4 class="font-semibold text-gray-900">
                            {truncateText(attendee.name, 25)}
                          </h4>
                          <p
                            class={`text-sm ${
                              attendee.type === "main"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {attendee.type === "main"
                              ? "Main Guest"
                              : "Plus One"}
                          </p>
                        </div>
                        <Show when={selectedGuestId() === attendee.id}>
                          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg
                              class="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </Show>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>

        {/* Current Table Status */}
        <div class="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Table Status</h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total Seats:</span>
              <span class="font-medium text-gray-900">
                {props.table.capacity}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Assigned:</span>
              <span class="font-medium text-purple-600">
                {tableAssignments().length}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Available:</span>
              <span class="font-medium text-emerald-600">
                {props.table.capacity - tableAssignments().length}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                class="bg-gradient-to-r from-purple-400 to-violet-500 h-2 rounded-full transition-all duration-300"
                style={`width: ${
                  (tableAssignments().length / props.table.capacity) * 100
                }%`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Layout */}
      <div class="lg:col-span-2">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  {props.table.name}
                </h3>
                <p class="text-gray-600 font-light">
                  {selectedGuest()
                    ? `Click a seat to assign ${selectedGuest()!.name}`
                    : hasSelectedGuest()
                    ? `Guest selected - Click a seat to assign`
                    : "Select a guest, then click a seat to assign"}
                </p>
              </div>
            </div>
          </div>

          {/* Table Layout - Now Properly Centered */}
          <div class="p-8">
            <div class="relative w-96 h-96 mx-auto">
              {/* Table Surface - Perfectly Centered */}
              {props.table.shape === "rectangular" ? (
                <div
                  class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border-4 border-amber-200 shadow-xl"
                  style={`left: ${
                    CENTER_X - tableDimensions().width / 2
                  }px; top: ${
                    CENTER_Y - tableDimensions().height / 2
                  }px; width: ${tableDimensions().width}px; height: ${
                    tableDimensions().height
                  }px;`}
                >
                  <div class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-xl font-bold text-amber-800">
                        {props.table.name}
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
                  }px; top: ${
                    CENTER_Y - tableDimensions().tableRadius
                  }px; width: ${tableDimensions().tableRadius * 2}px; height: ${
                    tableDimensions().tableRadius * 2
                  }px;`}
                >
                  <div class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-amber-800">
                        {props.table.name}
                      </div>
                      <div class="text-sm text-amber-700 mt-1">
                        Round Table • {props.table.capacity} seats
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seats - Now Using Corrected Center Point */}
              <For each={seatPositions()}>
                {(seatData) => {
                  const assignment = tableAssignments().find(
                    (a) => a.seatNumber === seatData.seatNumber
                  );
                  const isOccupied = !!assignment;
                  const canClickToAssign = hasSelectedGuest() && !isOccupied;

                  // Adjust seat positions to use the proper center point
                  const adjustedX = seatData.position.x + (CENTER_X - 140);
                  const adjustedY = seatData.position.y + (CENTER_Y - 140);

                  return (
                    <button
                      class={`absolute w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center text-sm font-bold shadow-lg hover:scale-110 cursor-pointer ${
                        isOccupied
                          ? "bg-gradient-to-br from-purple-400 to-violet-500 text-white hover:bg-gradient-to-br hover:from-red-400 hover:to-red-500"
                          : canClickToAssign
                          ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white hover:shadow-xl animate-pulse"
                          : hasSelectedGuest()
                          ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white hover:shadow-xl"
                          : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 cursor-default"
                      }`}
                      style={`left: ${adjustedX - 28}px; top: ${
                        adjustedY - 28
                      }px;`}
                      onClick={() => handleSeatClick(seatData.seatNumber)}
                      title={
                        isOccupied
                          ? `Seat ${seatData.seatNumber} - ${assignment?.guestName} (Click to remove)`
                          : canClickToAssign
                          ? `Seat ${seatData.seatNumber} - Click to assign guest`
                          : hasSelectedGuest()
                          ? `Seat ${seatData.seatNumber} - Available`
                          : `Seat ${seatData.seatNumber} - Select a guest first`
                      }
                    >
                      {isOccupied ? (
                        <svg
                          class="w-6 h-6"
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

            {/* Seat Legend */}
            <div class="mt-8">
              <div class="flex justify-center space-x-8">
                <div class="flex items-center space-x-2">
                  <div class="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">Available</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-4 h-4 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">Occupied</span>
                </div>
                <Show when={selectedGuest()}>
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                    <span class="text-sm text-emerald-600 font-medium">
                      Click to Assign {selectedGuest()!.name}
                    </span>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableAssignment;

import { Component, For, Show, createSignal } from "solid-js";
import { Guest, Table } from "../../types";

interface UnassignedGuestsProps {
  guests: Guest[];
  tables: Table[];
  onAssignGuest: (guestId: string, tableId: string) => void;
}

const UnassignedGuests: Component<UnassignedGuestsProps> = (props) => {
  const [selectedGuest, setSelectedGuest] = createSignal<string | null>(null);
  const [showAssignModal, setShowAssignModal] = createSignal(false);

  const handleGuestClick = (guestId: string) => {
    setSelectedGuest(guestId);
    setShowAssignModal(true);
  };

  const handleAssignToTable = (tableId: string) => {
    if (selectedGuest()) {
      props.onAssignGuest(selectedGuest()!, tableId);
      setShowAssignModal(false);
      setSelectedGuest(null);
    }
  };

  const getTableAvailableSeats = (table: Table) => {
    const assignedGuests = props.guests.filter((guest) =>
      table.assigned_guests?.includes(guest.id)
    );
    const totalAssigned = assignedGuests.reduce(
      (sum, guest) => sum + 1 + guest.plus_ones.length,
      0
    );
    return table.capacity - totalAssigned;
  };

  const getGuestPartySize = (guest: Guest) => {
    return 1 + guest.plus_ones.length;
  };

  const canFitInTable = (guest: Guest, table: Table) => {
    return getGuestPartySize(guest) <= getTableAvailableSeats(table);
  };

  return (
    <>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg h-fit sticky top-8">
        {/* Header */}
        <div class="p-6 border-b border-gray-100/60 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-white"
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
              <h3 class="text-lg font-medium text-gray-900">
                Unassigned Guests
              </h3>
              <p class="text-sm text-gray-600 font-light">
                Click to assign to a table
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-700 font-medium">
              {props.guests.length} guests remaining
            </span>
            <div class="flex items-center space-x-1 text-amber-600">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span class="font-light">Need seating</span>
            </div>
          </div>
        </div>

        {/* Guest List */}
        <div class="p-6 max-h-[600px] overflow-y-auto">
          <Show
            when={props.guests.length > 0}
            fallback={
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    class="w-8 h-8 text-emerald-500"
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
                <h4 class="text-sm font-medium text-gray-900 mb-1">
                  All guests assigned!
                </h4>
                <p class="text-xs text-gray-500 font-light">
                  Every guest has been seated at a table
                </p>
              </div>
            }
          >
            <div class="space-y-3">
              <For each={props.guests}>
                {(guest, index) => (
                  <div
                    class="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    style={`animation-delay: ${index() * 50}ms`}
                    onClick={() => handleGuestClick(guest.id)}
                  >
                    <div class="bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-lg p-4 border border-amber-200/50 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center text-white font-medium">
                          {guest.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-medium text-gray-900 text-sm truncate">
                            {guest.name}
                          </h4>
                          <div class="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                            <span class="flex items-center">
                              <svg
                                class="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {getGuestPartySize(guest)} seat
                              {getGuestPartySize(guest) > 1 ? "s" : ""}
                            </span>
                            <Show when={guest.meal_preference}>
                              <span class="flex items-center">
                                <svg
                                  class="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                {guest.meal_preference}
                              </span>
                            </Show>
                          </div>

                          {/* Plus Ones Preview */}
                          <Show when={guest.plus_ones.length > 0}>
                            <div class="mt-2 text-xs text-gray-600">
                              <span class="font-medium">Plus ones:</span>
                              <For each={guest.plus_ones.slice(0, 2)}>
                                {(plusOne, i) => (
                                  <span class="ml-1">
                                    {plusOne.name || `Guest ${i() + 1}`}
                                    {i() <
                                    Math.min(guest.plus_ones.length - 1, 1)
                                      ? ","
                                      : ""}
                                  </span>
                                )}
                              </For>
                              <Show when={guest.plus_ones.length > 2}>
                                <span class="ml-1 text-gray-500">
                                  +{guest.plus_ones.length - 2} more
                                </span>
                              </Show>
                            </div>
                          </Show>
                        </div>

                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg
                            class="w-5 h-5 text-amber-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Instructions */}
        <Show when={props.guests.length > 0}>
          <div class="p-6 pt-0">
            <div class="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
              <div class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-blue-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="text-sm">
                  <p class="font-medium text-blue-800 mb-1">Assignment Tips</p>
                  <ul class="text-blue-700 font-light space-y-1 text-xs">
                    <li>• Click any guest to see available tables</li>
                    <li>• Consider meal preferences and party sizes</li>
                    <li>• Group friends and family together</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>

      {/* Assignment Modal */}
      <Show when={showAssignModal()}>
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAssignModal(false)}
        >
          <div
            class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div class="p-6 border-b border-gray-100/80 bg-gradient-to-r from-purple-50/50 to-violet-50/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-medium text-gray-900">
                      Assign to Table
                    </h3>
                    <p class="text-sm text-gray-600 font-light">
                      Choose a table for{" "}
                      {props.guests.find((g) => g.id === selectedGuest())?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                >
                  <svg
                    class="w-6 h-6"
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
              </div>
            </div>

            {/* Table Options */}
            <div class="p-6 max-h-[500px] overflow-y-auto">
              <Show
                when={props.tables.length > 0}
                fallback={
                  <div class="text-center py-12">
                    <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        class="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h4 class="text-lg font-medium text-gray-900 mb-2">
                      No tables available
                    </h4>
                    <p class="text-gray-600 font-light">
                      Create some tables first to assign guests
                    </p>
                  </div>
                }
              >
                <div class="space-y-3">
                  <For each={props.tables}>
                    {(table) => {
                      const guest = props.guests.find(
                        (g) => g.id === selectedGuest()
                      );
                      const canFit = guest
                        ? canFitInTable(guest, table)
                        : false;
                      const availableSeats = getTableAvailableSeats(table);
                      const partySize = guest ? getGuestPartySize(guest) : 0;

                      return (
                        <button
                          onClick={() => handleAssignToTable(table.id)}
                          disabled={!canFit}
                          class={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                            canFit
                              ? "border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer"
                              : "border-gray-200 bg-gray-50/50 cursor-not-allowed opacity-60"
                          }`}
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                              <div
                                class={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  canFit
                                    ? "bg-gradient-to-br from-purple-400 to-violet-400 text-white"
                                    : "bg-gray-300 text-gray-500"
                                }`}
                              >
                                <svg
                                  class="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 class="font-medium text-gray-900">
                                  {table.name}
                                </h4>
                                <div class="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>Capacity: {table.capacity}</span>
                                  <span>Available: {availableSeats}</span>
                                  <span>Needed: {partySize}</span>
                                </div>
                              </div>
                            </div>

                            <div class="flex items-center space-x-3">
                              <Show when={canFit}>
                                <div class="text-sm text-emerald-600 font-medium flex items-center">
                                  <svg
                                    class="w-4 h-4 mr-1"
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
                                  Can fit
                                </div>
                              </Show>
                              <Show when={!canFit}>
                                <div class="text-sm text-red-600 font-medium flex items-center">
                                  <svg
                                    class="w-4 h-4 mr-1"
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
                                  Too full
                                </div>
                              </Show>

                              <svg
                                class="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div class="mt-3">
                            <div class="w-full bg-gray-200 rounded-full h-2">
                              <div
                                class={`h-2 rounded-full transition-all duration-500 ${
                                  availableSeats < partySize
                                    ? "bg-gradient-to-r from-red-400 to-red-500"
                                    : availableSeats === partySize
                                    ? "bg-gradient-to-r from-amber-400 to-orange-400"
                                    : "bg-gradient-to-r from-emerald-400 to-green-400"
                                }`}
                                style={`width: ${Math.min(
                                  ((table.capacity - availableSeats) /
                                    table.capacity) *
                                    100,
                                  100
                                )}%`}
                              ></div>
                            </div>
                          </div>
                        </button>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>

            {/* Modal Footer */}
            <div class="p-6 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/80 to-white/60">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600 font-light">
                  {props.guests.find((g) => g.id === selectedGuest()) && (
                    <span>
                      Party size:{" "}
                      {getGuestPartySize(
                        props.guests.find((g) => g.id === selectedGuest())!
                      )}
                      {props.guests.find((g) => g.id === selectedGuest())!
                        .plus_ones.length > 0 &&
                        ` (1 + ${
                          props.guests.find((g) => g.id === selectedGuest())!
                            .plus_ones.length
                        } plus ones)`}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default UnassignedGuests;

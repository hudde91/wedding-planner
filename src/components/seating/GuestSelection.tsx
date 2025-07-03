import { Component, For, Show, createMemo } from "solid-js";
import { Guest, SeatAssignment } from "../../types";
import { getInitials, pluralize } from "../../utils/validation";
import { getUnassignedAttendees } from "../../utils/guest";

interface GuestSelectionProps {
  guests: Guest[];
  seatAssignments: SeatAssignment[];
  selectedGuestId: string | null;
  onGuestSelect: (guestId: string) => void;
}

const GuestSelection: Component<GuestSelectionProps> = (props) => {
  const unassignedAttendees = createMemo(() => {
    const assignedIds = props.seatAssignments.map((a) => a.guestId);
    return getUnassignedAttendees(props.guests, assignedIds);
  });

  return (
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-4 sm:p-6">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
              Available Guests
            </h3>
            <p class="text-sm sm:text-base text-gray-600 font-light">
              {pluralize(unassignedAttendees().length, "guest")} awaiting seats
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-6">
        <Show
          when={unassignedAttendees().length > 0}
          fallback={
            <div class="text-center py-8 sm:py-12">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  class="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600"
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
          <div class="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto overflow-touch">
            <For each={unassignedAttendees()}>
              {(attendee) => (
                <button
                  onClick={() => props.onGuestSelect(attendee.id)}
                  class={`w-full p-3 sm:p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-95 border touch-manipulation ${
                    props.selectedGuestId === attendee.id
                      ? "bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 shadow-lg"
                      : "bg-gradient-to-r from-white to-gray-50/50 border-gray-200 hover:border-emerald-300 hover:shadow-md"
                  }`}
                >
                  <div class="flex items-center space-x-3 sm:space-x-4">
                    <div
                      class={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md text-sm ${
                        props.selectedGuestId === attendee.id
                          ? "bg-gradient-to-br from-purple-500 to-violet-600"
                          : attendee.type === "main"
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                          : "bg-gradient-to-br from-amber-500 to-orange-600"
                      }`}
                    >
                      {getInitials(attendee.name)}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {attendee.name}
                      </h4>
                      <p
                        class={`text-xs sm:text-sm ${
                          attendee.type === "main"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {attendee.type === "main" ? "Main Guest" : "Plus One"}
                      </p>
                    </div>
                    <Show when={props.selectedGuestId === attendee.id}>
                      <div class="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          class="w-3 h-3 sm:w-4 sm:h-4 text-white"
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
  );
};

export default GuestSelection;

import { Component, For, Show } from "solid-js";
import { Guest } from "../../types";
import {
  getInitials,
  pluralize,
  truncateText,
  capitalizeFirst,
} from "../../utils/validation";
import { getGuestPartySize } from "../../utils/guest";

interface GuestListProps {
  guests: Guest[];
  selectedGuestId: string | null;
  onGuestSelect: (guestId: string) => void;
}

const GuestList: Component<GuestListProps> = (props) => {
  return (
    <div class="animate-fade-in-up bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden sticky top-6">
      <div class="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-100/60">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
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
            <h3 class="text-xl font-medium text-gray-900">Unassigned Guests</h3>
            <p class="text-sm text-gray-600 font-light">
              {pluralize(props.guests.length, "guest")} waiting for seats
            </p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <Show
          when={props.guests.length > 0}
          fallback={
            <div class="text-center py-12">
              <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
              <p class="text-gray-600 font-light">All guests are seated!</p>
            </div>
          }
        >
          <div class="space-y-3">
            <For each={props.guests}>
              {(guest) => {
                const partyInfo = getGuestPartySize(guest);
                return (
                  <button
                    onClick={() => props.onGuestSelect(guest.id)}
                    class={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] ${
                      props.selectedGuestId === guest.id
                        ? "bg-gradient-to-r from-purple-100 to-violet-100 border-2 border-purple-300 shadow-lg"
                        : "bg-gradient-to-r from-white to-amber-50/30 border border-amber-200/40 hover:border-amber-300/60 hover:shadow-md"
                    }`}
                  >
                    <div class="flex items-center space-x-4">
                      <div
                        class={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
                          props.selectedGuestId === guest.id
                            ? "bg-gradient-to-br from-purple-400 to-violet-500"
                            : "bg-gradient-to-br from-amber-400 to-orange-500"
                        }`}
                      >
                        {getInitials(guest.name)}
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900">
                          {truncateText(guest.name, 25)}
                        </h4>
                        <div class="flex items-center space-x-3 mt-1">
                          <span class="text-xs text-gray-600">Main guest</span>
                          <Show when={partyInfo.plusOnes > 0}>
                            <span class="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                              +{pluralize(partyInfo.plusOnes, "plus one")}
                            </span>
                          </Show>
                          <Show when={guest.meal_preference}>
                            <span class="text-xs text-gray-500">
                              • {capitalizeFirst(guest.meal_preference || "")}
                            </span>
                          </Show>
                        </div>
                      </div>
                      <Show when={props.selectedGuestId === guest.id}>
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
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default GuestList;

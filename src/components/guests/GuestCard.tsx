import { Component, For } from "solid-js";
import { Guest, RSVPStatus } from "../../types";

interface GuestCardProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
}

const GuestCard: Component<GuestCardProps> = (props) => {
  const getRSVPColor = (status: RSVPStatus): string => {
    switch (status) {
      case "attending":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "declined":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-amber-700 bg-amber-100 border-amber-200";
    }
  };

  const getRSVPIcon = (status: RSVPStatus): string => {
    switch (status) {
      case "attending":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case "declined":
        return "M6 18L18 6M6 6l12 12";
      default:
        return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  };

  const getCardBorderColor = (status: RSVPStatus): string => {
    switch (status) {
      case "attending":
        return "border-emerald-200/60 hover:border-emerald-300/80";
      case "declined":
        return "border-red-200/60 hover:border-red-300/80";
      default:
        return "border-amber-200/60 hover:border-amber-300/80";
    }
  };

  return (
    <div
      class={`group bg-white/80 backdrop-blur-sm border rounded-xl p-6 hover:shadow-xl transition-all duration-500 ${getCardBorderColor(
        props.guest.rsvp_status
      )}`}
    >
      {/* Header */}
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <h3 class="text-xl font-medium text-gray-900">
              {props.guest.name}
            </h3>
            <div
              class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRSVPColor(
                props.guest.rsvp_status
              )}`}
            >
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
                  d={getRSVPIcon(props.guest.rsvp_status)}
                />
              </svg>
              {props.guest.rsvp_status.charAt(0).toUpperCase() +
                props.guest.rsvp_status.slice(1)}
            </div>
          </div>

          <div class="space-y-2">
            {props.guest.email && (
              <div class="flex items-center text-sm text-gray-600">
                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
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
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <span class="font-light">{props.guest.email}</span>
              </div>
            )}

            {props.guest.phone && (
              <div class="flex items-center text-sm text-gray-600">
                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span class="font-light">{props.guest.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            onClick={() => props.onEdit(props.guest)}
            class="opacity-0 group-hover:opacity-100 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-300"
            title="Edit guest"
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
              />
            </svg>
          </button>
          <button
            onClick={() => props.onDelete(props.guest.id)}
            class="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300"
            title="Delete guest"
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
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {props.guest.meal_preference && (
          <div class="flex items-center p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-4 h-4 text-orange-600"
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
            </div>
            <div>
              <div class="text-xs text-orange-600 font-medium">
                Meal Preference
              </div>
              <div class="text-sm text-gray-700 font-light">
                {props.guest.meal_preference}
              </div>
            </div>
          </div>
        )}

        {props.guest.plus_ones && props.guest.plus_ones.length > 0 && (
          <div class="flex items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="w-4 h-4 text-purple-600"
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
            </div>
            <div>
              <div class="text-xs text-purple-600 font-medium">Plus Ones</div>
              <div class="text-sm text-gray-700 font-light">
                +{props.guest.plus_ones.length} guest
                {props.guest.plus_ones.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        )}

        <div class="flex items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg
              class="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <div class="text-xs text-blue-600 font-medium">Total Attendees</div>
            <div class="text-sm text-gray-700 font-light">
              {(() => {
                const mainGuest = 1;
                const plusOnesCount = props.guest.plus_ones
                  ? props.guest.plus_ones.length
                  : 0;
                const total = mainGuest + plusOnesCount;
                return `${total} attendee${total > 1 ? "s" : ""}`;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {props.guest.notes && (
        <div class="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 mb-4">
          <div class="flex items-start space-x-3">
            <div class="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
              <svg
                class="w-3 h-3 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <div class="text-xs text-gray-600 font-medium mb-1">Notes</div>
              <div class="text-sm text-gray-700 font-light">
                {props.guest.notes}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plus Ones Details */}
      {props.guest.plus_ones && props.guest.plus_ones.length > 0 && (
        <div class="border-t border-gray-100 pt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
              <svg
                class="w-3 h-3 text-purple-600"
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
            </div>
            Plus One Details
          </h4>
          <div class="space-y-3">
            <For each={props.guest.plus_ones}>
              {(plusOne, index) => (
                <div class="bg-gradient-to-r from-purple-50/50 to-violet-50/50 p-4 rounded-lg border border-purple-100/50">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="font-medium text-gray-800 text-sm mb-1">
                        {plusOne.name ||
                          `${props.guest.name}'s plus one ${index() + 1}`}
                      </div>
                      <div class="space-y-1">
                        {plusOne.meal_preference && (
                          <div class="flex items-center text-xs text-gray-600">
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
                            <span class="font-light">
                              Meal: {plusOne.meal_preference}
                            </span>
                          </div>
                        )}
                        {plusOne.notes && (
                          <div class="flex items-start text-xs text-gray-600">
                            <svg
                              class="w-3 h-3 mr-1 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span class="font-light">
                              Notes: {plusOne.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestCard;

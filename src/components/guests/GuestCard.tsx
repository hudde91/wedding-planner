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
        return "text-green-600 bg-green-100";
      case "declined":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-800">
            {props.guest.name}
          </h3>
          <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            {props.guest.email && (
              <span class="flex items-center">
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
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  ></path>
                </svg>
                {props.guest.email}
              </span>
            )}
            {props.guest.phone && (
              <span class="flex items-center">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                {props.guest.phone}
              </span>
            )}
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span
            class={`px-2 py-1 rounded-full text-xs font-medium ${getRSVPColor(
              props.guest.rsvp_status
            )}`}
          >
            {props.guest.rsvp_status.charAt(0).toUpperCase() +
              props.guest.rsvp_status.slice(1)}
          </span>
          <button
            onClick={() => props.onEdit(props.guest)}
            class="text-blue-500 hover:text-blue-700 p-1 rounded focus:outline-none"
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
              ></path>
            </svg>
          </button>
          <button
            onClick={() => props.onDelete(props.guest.id)}
            class="text-red-500 hover:text-red-700 p-1 rounded focus:outline-none"
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
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        {props.guest.meal_preference && (
          <div class="flex items-center text-gray-600">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
            <span>Meal: {props.guest.meal_preference}</span>
          </div>
        )}

        {props.guest.plus_ones && props.guest.plus_ones.length > 0 && (
          <div class="flex items-center text-gray-600">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span>
              +{props.guest.plus_ones.length} guest
              {props.guest.plus_ones.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div class="flex items-center text-gray-600">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          <span>
            Total:{" "}
            {(() => {
              const mainGuest = 1;
              const plusOnesCount = props.guest.plus_ones
                ? props.guest.plus_ones.length
                : 0;
              const total = mainGuest + plusOnesCount;
              return `${total} attendee${total > 1 ? "s" : ""}`;
            })()}
          </span>
        </div>
      </div>

      {props.guest.notes && (
        <div class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
          <strong>Notes:</strong> {props.guest.notes}
        </div>
      )}

      {props.guest.plus_ones && props.guest.plus_ones.length > 0 && (
        <div class="mt-3 space-y-2">
          <h4 class="text-sm font-semibold text-gray-700">Plus Ones:</h4>
          <For each={props.guest.plus_ones}>
            {(plusOne, index) => (
              <div class="bg-gray-50 p-2 rounded text-sm">
                <div class="font-medium text-gray-800">
                  {plusOne.name ||
                    `${props.guest.name}'s plus one ${index() + 1}`}
                </div>
                {plusOne.meal_preference && (
                  <div class="text-gray-600 text-xs">
                    Meal: {plusOne.meal_preference}
                  </div>
                )}
                {plusOne.notes && (
                  <div class="text-gray-600 text-xs">
                    Notes: {plusOne.notes}
                  </div>
                )}
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default GuestCard;

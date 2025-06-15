import { Component } from "solid-js";
import { BudgetSummary } from "../../types";
import { calculateResponseRate } from "../../utils/progress";

interface RSVPStatusCardProps {
  stats: BudgetSummary;
}

const RSVPStatusCard: Component<RSVPStatusCardProps> = (props) => {
  return (
    <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
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
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-medium text-gray-900">RSVP Status</h3>
          <p class="text-sm text-gray-500 font-light">
            Guest response tracking
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Attending</span>
          </div>
          <div class="text-right">
            <span class="text-lg font-medium text-gray-900">
              {props.stats.attendingGuests}
            </span>
            <span class="text-sm text-gray-500 ml-2">
              ({props.stats.totalAttendees} total)
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-red-400 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Declined</span>
          </div>
          <span class="text-lg font-medium text-gray-900">
            {props.stats.declinedGuests}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Pending</span>
          </div>
          <span class="text-lg font-medium text-gray-900">
            {props.stats.pendingGuests}
          </span>
        </div>

        <div class="mt-6">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Response Rate</span>
            <span>
              {calculateResponseRate(
                props.stats.totalGuests,
                props.stats.attendingGuests + props.stats.declinedGuests
              )}
              %
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
              style={`width: ${calculateResponseRate(
                props.stats.totalGuests,
                props.stats.attendingGuests + props.stats.declinedGuests
              )}%`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPStatusCard;

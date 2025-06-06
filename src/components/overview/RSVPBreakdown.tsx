import { Component } from "solid-js";
import ProgressBar from "../common/ProgressBar";

interface RSVPBreakdownProps {
  attendingGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  totalGuests: number;
  totalAttendees: number;
}

const RSVPBreakdown: Component<RSVPBreakdownProps> = (props) => {
  const responseRate =
    props.totalGuests > 0
      ? ((props.attendingGuests + props.declinedGuests) / props.totalGuests) *
        100
      : 0;

  return (
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">RSVP Status</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            <span class="text-sm text-gray-700">Attending</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-semibold text-gray-900">
              {props.attendingGuests}
            </span>
            <span class="text-xs text-gray-500">
              ({props.totalAttendees} total)
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
            <span class="text-sm text-gray-700">Declined</span>
          </div>
          <span class="text-sm font-semibold text-gray-900">
            {props.declinedGuests}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
            <span class="text-sm text-gray-700">Pending</span>
          </div>
          <span class="text-sm font-semibold text-gray-900">
            {props.pendingGuests}
          </span>
        </div>

        <ProgressBar
          progress={responseRate}
          label="Response Rate"
          showPercentage={true}
          color="blue"
        />
      </div>
    </div>
  );
};

export default RSVPBreakdown;

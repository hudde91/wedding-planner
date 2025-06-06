import { Component } from "solid-js";
import { GuestStats as GuestStatsType } from "../../types";

interface GuestStatsProps {
  stats: GuestStatsType;
  totalGuests: number;
}

const GuestStats: Component<GuestStatsProps> = (props) => {
  return (
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{props.totalGuests}</div>
        <div class="text-sm text-blue-800">Total Invited</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-green-600">
          {props.stats.attending.length}
        </div>
        <div class="text-sm text-green-800">Attending</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-red-600">
          {props.stats.declined.length}
        </div>
        <div class="text-sm text-red-800">Declined</div>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-purple-600">
          {props.stats.totalAttendees}
        </div>
        <div class="text-sm text-purple-800">Total Attendees</div>
      </div>
    </div>
  );
};

export default GuestStats;

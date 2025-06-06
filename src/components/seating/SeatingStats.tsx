import { Component } from "solid-js";

interface SeatingStatsProps {
  totalTables: number;
  occupiedSeats: number;
  totalSeats: number;
  unseatedGuests: number;
}

const SeatingStats: Component<SeatingStatsProps> = (props) => {
  return (
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{props.totalTables}</div>
        <div class="text-sm text-blue-800">Tables</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-green-600">
          {props.occupiedSeats}/{props.totalSeats}
        </div>
        <div class="text-sm text-green-800">Seats Filled</div>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-orange-600">
          {props.unseatedGuests}
        </div>
        <div class="text-sm text-orange-800">Unseated Guests</div>
      </div>
    </div>
  );
};

export default SeatingStats;

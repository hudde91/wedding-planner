import { Component } from "solid-js";
import { Table, SeatAssignment } from "../../types";
import TableView from "./TableView";
import { truncateText } from "../../utils/validation";

interface SeatSelectionProps {
  table: Table;
  seatAssignments: SeatAssignment[];
  selectedGuestName: string;
  onSeatSelect: (seatNumber: number) => void;
}

const SeatSelection: Component<SeatSelectionProps> = (props) => {
  return (
    <div class="lg:col-span-2">
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 p-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
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
                {truncateText(props.table.name, 15)}
              </h3>
              <p class="text-gray-600 font-light">
                Choose a seat for {props.selectedGuestName}
              </p>
            </div>
          </div>
        </div>

        <TableView
          table={props.table}
          seatAssignments={props.seatAssignments}
          onSeatClick={props.onSeatSelect}
          interactive={true}
        />

        {/* Seat Legend */}
        <div class="px-8 pb-8">
          <div class="flex justify-center space-x-8">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Available</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Occupied</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-purple-600 font-medium">
                Click to Assign
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

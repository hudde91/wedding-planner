import { Component } from "solid-js";

const AssignmentInstructions: Component = () => {
  return (
    <div class="animate-fade-in-up bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-100/50 shadow-xl">
      <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto sm:mx-0">
          <svg
            class="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
        </div>
        <div class="flex-1 text-center sm:text-left">
          <h3 class="text-xl sm:text-2xl font-medium text-gray-900 mb-3 sm:mb-4">
            How to Assign Seats
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="flex items-center space-x-3 p-3 sm:p-0">
              <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <span class="text-sm sm:text-base text-blue-800">
                Click a guest from the left panel
              </span>
            </div>
            <div class="flex items-center space-x-3 p-3 sm:p-0">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <span class="text-sm sm:text-base text-blue-800">
                Select a table with available seats
              </span>
            </div>
            <div class="flex items-center space-x-3 p-3 sm:p-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <span class="text-sm sm:text-base text-blue-800">
                Click on the specific seat number
              </span>
            </div>
          </div>
          <div class="mt-4 p-3 sm:p-4 bg-amber-50/50 rounded-lg border border-amber-200/50">
            <p class="text-xs sm:text-sm text-amber-800 leading-relaxed">
              <span class="font-medium">📝 Note:</span> Each guest (including
              plus ones) needs their own individual seat assignment. After
              assigning the main guest, repeat the process for each plus one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentInstructions;

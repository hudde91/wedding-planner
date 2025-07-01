import { Component } from "solid-js";

const PlanningTips: Component = () => {
  return (
    <div class="animate-fade-in-up-delay-200 mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg border border-blue-100/50">
      <div class="flex items-start space-x-3">
        <svg
          class="w-5 h-5 text-blue-500 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <div class="text-sm">
          <p class="font-medium text-blue-800 mb-1">Seating Planning Tips</p>
          <ul class="text-blue-700 font-light space-y-1 text-xs">
            <li>• Consider mixing friend groups for conversation</li>
            <li>• Keep families with young children near exits</li>
            <li>• Place elderly guests away from loud speakers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanningTips;

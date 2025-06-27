import { Component } from "solid-js";
import { TabId } from "../../types";

interface QuickActionsCardProps {
  onNavigateToRoute?: (tabId: TabId) => void;
}

const QuickActionsCard: Component<QuickActionsCardProps> = (props) => {
  return (
    <div class="animate-fade-in-up-delay-800 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-8">
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-medium text-gray-900">Quick Actions</h3>
          <p class="text-sm text-gray-500 font-light">
            Jump to key planning areas
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => props.onNavigateToRoute?.("details")}
          class="group p-6 border border-gray-200 rounded-xl hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-300 text-left"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg
              class="w-6 h-6 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div class="text-sm font-medium text-gray-900 mb-1">
            Wedding Details
          </div>
          <div class="text-xs text-gray-500 font-light">
            Set date, budget & information
          </div>
        </button>

        <button
          onClick={() => props.onNavigateToRoute?.("guests")}
          class="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 text-left"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg
              class="w-6 h-6 text-blue-600"
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
          <div class="text-sm font-medium text-gray-900 mb-1">
            Manage Guests
          </div>
          <div class="text-xs text-gray-500 font-light">
            Add guests and track RSVPs
          </div>
        </button>

        <button
          onClick={() => props.onNavigateToRoute?.("todos")}
          class="group p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-300 text-left"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg
              class="w-6 h-6 text-emerald-600"
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
          <div class="text-sm font-medium text-gray-900 mb-1">
            Planning Tasks
          </div>
          <div class="text-xs text-gray-500 font-light">
            Track progress and vendors
          </div>
        </button>

        <button
          onClick={() => props.onNavigateToRoute?.("seating")}
          class="group p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-300 text-left"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div class="text-sm font-medium text-gray-900 mb-1">
            Seating Chart
          </div>
          <div class="text-xs text-gray-500 font-light">
            Arrange table assignments
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsCard;

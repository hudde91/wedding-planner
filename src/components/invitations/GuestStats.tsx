import { Component } from "solid-js";
import { GuestStats as GuestStatsType } from "../../types";
import {
  calculateResponseRate,
  calculateAttendanceRate,
} from "../../utils/progress";

interface GuestStatsProps {
  stats: GuestStatsType;
  totalGuests: number;
}

const GuestStats: Component<GuestStatsProps> = (props) => {
  const getResponseRate = () => {
    const responded =
      props.stats.attending.length + props.stats.declined.length;
    return calculateResponseRate(props.totalGuests, responded);
  };

  const getAttendanceRate = () => {
    const responded =
      props.stats.attending.length + props.stats.declined.length;
    return calculateAttendanceRate(props.stats.attending.length, responded);
  };

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Invited */}
      <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 card-hover">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600 tracking-wide">
              Total Invited
            </p>
            <p class="text-2xl sm:text-3xl font-light text-blue-600">
              {props.totalGuests}
            </p>
            <p class="text-xs text-gray-500 font-light">Invitations sent</p>
          </div>
        </div>
      </div>

      {/* Attending */}
      <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 card-hover">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600 tracking-wide">
              Attending
            </p>
            <p class="text-2xl sm:text-3xl font-light text-emerald-600">
              {props.stats.attending.length}
            </p>
            <p class="text-xs text-gray-500 font-light">
              {getAttendanceRate()}% of responses
            </p>
          </div>
        </div>
      </div>

      {/* Declined */}
      <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 card-hover">
        <div class="absolute inset-0 bg-gradient-to-br from-red-50/50 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-rose-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600 tracking-wide">
              Declined
            </p>
            <p class="text-2xl sm:text-3xl font-light text-red-600">
              {props.stats.declined.length}
            </p>
            <p class="text-xs text-gray-500 font-light">Cannot attend</p>
          </div>
        </div>
      </div>

      {/* Total Attendees */}
      <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 card-hover">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600 tracking-wide">
              Total Attendees
            </p>
            <p class="text-2xl sm:text-3xl font-light text-purple-600">
              {props.stats.totalAttendees}
            </p>
            <p class="text-xs text-gray-500 font-light">Including plus ones</p>
          </div>
        </div>
      </div>

      {/* Response Progress - Full Width */}
      <div class="col-span-1 sm:col-span-2 lg:col-span-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-medium text-gray-900">
                RSVP Progress
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 font-light">
                Guest response tracking
              </p>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xl sm:text-2xl font-light text-gray-900">
              {getResponseRate()}%
            </div>
            <div class="text-xs sm:text-sm text-gray-500 font-light">
              Response Rate
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Attending Progress */}
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium text-emerald-600">Attending</span>
                <span class="text-gray-600">
                  {props.stats.attending.length}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-emerald-400 to-green-400 h-2 rounded-full transition-all duration-1000"
                  style={`width: ${
                    props.totalGuests > 0
                      ? (props.stats.attending.length / props.totalGuests) * 100
                      : 0
                  }%`}
                ></div>
              </div>
            </div>

            {/* Declined Progress */}
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium text-red-600">Declined</span>
                <span class="text-gray-600">{props.stats.declined.length}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-red-400 to-rose-400 h-2 rounded-full transition-all duration-1000"
                  style={`width: ${
                    props.totalGuests > 0
                      ? (props.stats.declined.length / props.totalGuests) * 100
                      : 0
                  }%`}
                ></div>
              </div>
            </div>

            {/* Pending Progress */}
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="font-medium text-amber-600">Pending</span>
                <span class="text-gray-600">{props.stats.pending.length}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                  style={`width: ${
                    props.totalGuests > 0
                      ? (props.stats.pending.length / props.totalGuests) * 100
                      : 0
                  }%`}
                ></div>
              </div>
            </div>
          </div>

          {/* Overall Response Rate */}
          <div class="pt-4 border-t border-gray-100">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span class="font-medium">Overall Response Rate</span>
              <span>
                {props.stats.attending.length + props.stats.declined.length} of{" "}
                {props.totalGuests} responded
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="bg-gradient-to-r from-blue-400 to-cyan-400 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
                style={`width: ${getResponseRate()}%`}
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestStats;

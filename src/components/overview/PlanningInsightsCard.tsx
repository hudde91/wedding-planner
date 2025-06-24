import { Component, Show } from "solid-js";
import { BudgetSummary } from "../../types";

interface PlanningInsightsCardProps {
  stats: BudgetSummary;
}

const PlanningInsightsCard: Component<PlanningInsightsCardProps> = (props) => {
  return (
    <Show when={props.stats.totalTodos > 0 || props.stats.totalGuests > 0}>
      <div class="animate-fade-in-up-delay-600 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl p-8 border border-indigo-200/50 shadow-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-medium text-gray-900">Planning Insights</h3>
            <p class="text-sm text-gray-500 font-light">
              Personalized recommendations
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <Show
            when={(() => {
              const days = props.stats.daysUntilWedding;
              return days !== null && days > 0;
            })()}
          >
            <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">
                  {(() => {
                    const days = props.stats.daysUntilWedding!;
                    return days > 180
                      ? "You have plenty of time! Focus on major decisions like venue and photographer."
                      : days > 90
                      ? "Time to finalize key details and send save-the-dates to guests."
                      : days > 30
                      ? "Final preparations time! Confirm all vendor details and arrangements."
                      : "Final countdown! Focus on day-of coordination and last-minute details.";
                  })()}
                </p>
              </div>
            </div>
          </Show>

          <Show when={props.stats.pendingGuests > 0}>
            <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  class="w-4 h-4 text-white"
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
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">
                  You have {props.stats.pendingGuests} pending RSVP
                  {props.stats.pendingGuests === 1 ? "" : "s"}. Consider sending
                  gentle reminders to help finalize your guest count.
                </p>
              </div>
            </div>
          </Show>

          <Show
            when={
              props.stats.totalAttendees > 0 && props.stats.occupiedSeats === 0
            }
          >
            <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  class="w-4 h-4 text-white"
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
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">
                  Perfect time to start your seating arrangements! You have{" "}
                  {props.stats.totalAttendees}
                  confirmed attendee
                  {props.stats.totalAttendees === 1 ? "" : "s"} ready to be
                  seated.
                </p>
              </div>
            </div>
          </Show>

          <Show
            when={(() => {
              const days = props.stats.daysUntilWedding;
              return (
                props.stats.todoProgress < 25 && days !== null && days < 90
              );
            })()}
          >
            <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div class="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">
                  Consider prioritizing your planning tasks or hiring a wedding
                  coordinator to help manage the timeline effectively.
                </p>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};

export default PlanningInsightsCard;

import { Component, Show } from "solid-js";

interface PlanningTipsProps {
  daysUntilWedding: number | null;
  pendingGuests: number;
  totalAttendees: number;
  occupiedSeats: number;
  totalTodos: number;
  totalGuests: number;
}

const PlanningTips: Component<PlanningTipsProps> = (props) => {
  return (
    <Show when={props.totalTodos > 0 || props.totalGuests > 0}>
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">
          💡 Planning Tips
        </h3>
        <div class="space-y-2 text-sm text-gray-700">
          <Show
            when={(() => {
              const days = props.daysUntilWedding;
              return days !== null && days > 0;
            })()}
          >
            <div class="flex items-start space-x-2">
              <span class="text-yellow-500 mt-0.5">⭐</span>
              <span>
                {(() => {
                  const days = props.daysUntilWedding!;
                  return days > 180
                    ? "You have plenty of time! Focus on big decisions like venue and date."
                    : days > 90
                    ? "Time to finalize major details and send save-the-dates."
                    : days > 30
                    ? "Crunch time! Focus on final details and confirmations."
                    : "Final week! Double-check everything and enjoy your special day!";
                })()}
              </span>
            </div>
          </Show>
          <Show when={props.pendingGuests > 0}>
            <div class="flex items-start space-x-2">
              <span class="text-blue-500 mt-0.5">📧</span>
              <span>
                You have {props.pendingGuests} pending RSVPs. Consider following
                up soon.
              </span>
            </div>
          </Show>
          <Show when={props.totalAttendees > 0 && props.occupiedSeats === 0}>
            <div class="flex items-start space-x-2">
              <span class="text-purple-500 mt-0.5">🪑</span>
              <span>
                Ready to start your seating chart? You have{" "}
                {props.totalAttendees} attendees to seat.
              </span>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};

export default PlanningTips;

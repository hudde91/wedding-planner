import { Component, For } from "solid-js";
import { Attendee } from "../../types";

interface UnseatedGuestsProps {
  guests: Attendee[];
  onMouseDown: (attendee: Attendee) => void;
  isDragging: boolean;
  draggedGuest: Attendee | null;
}

const UnseatedGuests: Component<UnseatedGuestsProps> = (props) => {
  return (
    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <h3 class="text-lg font-semibold text-yellow-800 mb-3">
        Unseated Guests (Drag to seats)
      </h3>
      <div class="flex flex-wrap gap-2">
        <For each={props.guests}>
          {(attendee) => (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                props.onMouseDown(attendee);
              }}
              class={`px-3 py-1 rounded-full cursor-move hover:bg-yellow-300 transition-colors text-sm select-none ${
                attendee.type === "plus_one"
                  ? "bg-orange-200 text-orange-800 hover:bg-orange-300"
                  : "bg-yellow-200 text-yellow-800"
              } ${
                props.isDragging && props.draggedGuest?.id === attendee.id
                  ? "opacity-50"
                  : ""
              }`}
            >
              {attendee.name}
              {attendee.type === "plus_one" && (
                <span class="ml-1 text-xs opacity-75">+1</span>
              )}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default UnseatedGuests;

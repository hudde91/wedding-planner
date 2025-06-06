import { Component } from "solid-js";
import { PlusOne } from "../../types";

interface PlusOneFormProps {
  plusOne: PlusOne;
  index: number;
  guestName: string;
  onUpdate: <K extends keyof PlusOne>(
    plusOneId: string,
    field: K,
    value: PlusOne[K]
  ) => void;
  onRemove: (plusOneId: string) => void;
}

const PlusOneForm: Component<PlusOneFormProps> = (props) => {
  return (
    <div class="border border-gray-200 rounded-md p-3 bg-gray-50">
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-sm font-medium text-gray-700">
          Plus One {props.index}
        </h4>
        <button
          type="button"
          onClick={() => props.onRemove(props.plusOne.id)}
          class="text-red-500 hover:text-red-700 p-1"
          title="Remove plus one"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <div class="space-y-2">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            value={props.plusOne.name}
            onInput={(e) =>
              props.onUpdate(
                props.plusOne.id,
                "name",
                (e.target as HTMLInputElement).value
              )
            }
            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder={`${props.guestName || "Guest"}'s plus one`}
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Meal Preference
          </label>
          <input
            type="text"
            value={props.plusOne.meal_preference}
            onInput={(e) =>
              props.onUpdate(
                props.plusOne.id,
                "meal_preference",
                (e.target as HTMLInputElement).value
              )
            }
            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="e.g., Vegetarian, Gluten-free"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Notes
          </label>
          <textarea
            value={props.plusOne.notes}
            onInput={(e) =>
              props.onUpdate(
                props.plusOne.id,
                "notes",
                (e.target as HTMLTextAreaElement).value
              )
            }
            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            rows="2"
            placeholder="Any special notes"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PlusOneForm;

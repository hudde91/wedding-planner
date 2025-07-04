import { Component, createSignal, createEffect } from "solid-js";
import { PlusOne } from "../../types";

interface PlusOneFormProps {
  plusOne: PlusOne;
  index: number;
  guestName: string;
  onRemove: (plusOneId: string) => void;
  onDataChange?: (plusOneId: string, data: PlusOne) => void; // Optional callback for getting data
}

const PlusOneForm: Component<PlusOneFormProps> = (props) => {
  const [localData, setLocalData] = createSignal<PlusOne>({
    id: props.plusOne.id,
    name: props.plusOne.name,
    meal_preference: props.plusOne.meal_preference,
    notes: props.plusOne.notes,
  });

  // Update local state when props change (initial load)
  createEffect(() => {
    setLocalData({
      id: props.plusOne.id,
      name: props.plusOne.name,
      meal_preference: props.plusOne.meal_preference,
      notes: props.plusOne.notes,
    });
  });

  // Simple local update - no parent communication during typing
  const updateField = <K extends keyof PlusOne>(
    field: K,
    value: PlusOne[K]
  ) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  // Make getCurrentData available to parent if callback provided
  createEffect(() => {
    if (props.onDataChange) {
      props.onDataChange(props.plusOne.id, localData());
    }
  });

  return (
    <div class="bg-gradient-to-br from-purple-50/50 to-violet-50/50 border border-purple-200/50 rounded-xl p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
        <h4 class="text-sm font-medium text-gray-700 flex items-center">
          <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
            <svg
              class="w-3 h-3 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          Plus One {props.index}
        </h4>
        <button
          type="button"
          onClick={() => props.onRemove(props.plusOne.id)}
          class="btn-mobile self-start sm:self-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 focus-mobile"
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

      <div class="space-y-3 sm:space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={localData().name}
            onInput={(e) =>
              updateField("name", (e.target as HTMLInputElement).value)
            }
            class="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg focus-mobile transition-all duration-300 font-light text-sm text-mobile-readable"
            placeholder={`${props.guestName || "Guest"}'s plus one`}
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Meal Preference
          </label>
          <input
            type="text"
            value={localData().meal_preference}
            onInput={(e) =>
              updateField(
                "meal_preference",
                (e.target as HTMLInputElement).value
              )
            }
            class="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg focus-mobile transition-all duration-300 font-light text-sm text-mobile-readable"
            placeholder="e.g., Vegetarian, Gluten-free"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={localData().notes}
            onInput={(e) =>
              updateField("notes", (e.target as HTMLTextAreaElement).value)
            }
            class="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg focus-mobile transition-all duration-300 font-light text-sm text-mobile-readable resize-none"
            rows="2"
            placeholder="Any special notes"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PlusOneForm;

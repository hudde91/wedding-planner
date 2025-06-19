import { Component, createSignal, createEffect } from "solid-js";
import { PlusOne } from "../../types";
import { formatName } from "../../utils/validation";

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
  // Local state to prevent focus loss
  const [localFormData, setLocalFormData] = createSignal<PlusOne>({
    id: props.plusOne.id,
    name: props.plusOne.name,
    meal_preference: props.plusOne.meal_preference,
    notes: props.plusOne.notes,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = createSignal(false);
  const [initialFormData, setInitialFormData] = createSignal<PlusOne>({
    id: props.plusOne.id,
    name: props.plusOne.name,
    meal_preference: props.plusOne.meal_preference,
    notes: props.plusOne.notes,
  });

  // Update local state when props change
  createEffect(() => {
    const newFormData = {
      id: props.plusOne.id,
      name: props.plusOne.name,
      meal_preference: props.plusOne.meal_preference,
      notes: props.plusOne.notes,
    };

    setLocalFormData(newFormData);
    setInitialFormData(newFormData);
    setHasUnsavedChanges(false);
  });

  // Check for unsaved changes
  createEffect(() => {
    const current = localFormData();
    const initial = initialFormData();
    const hasChanged = JSON.stringify(current) !== JSON.stringify(initial);
    setHasUnsavedChanges(hasChanged);
  });

  // Save function
  const saveChanges = () => {
    if (!hasUnsavedChanges()) return;

    const currentData = localFormData();
    const initial = initialFormData();

    // Only call onUpdate for fields that actually changed
    if (currentData.name !== initial.name) {
      props.onUpdate(props.plusOne.id, "name", currentData.name);
    }
    if (currentData.meal_preference !== initial.meal_preference) {
      props.onUpdate(
        props.plusOne.id,
        "meal_preference",
        currentData.meal_preference
      );
    }
    if (currentData.notes !== initial.notes) {
      props.onUpdate(props.plusOne.id, "notes", currentData.notes);
    }

    setInitialFormData(currentData);
    setHasUnsavedChanges(false);
  };

  // Update local form field
  const updateLocalField = <K extends keyof PlusOne>(
    field: K,
    value: PlusOne[K]
  ): void => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle input blur - save changes
  const handleInputBlur = () => {
    if (hasUnsavedChanges()) {
      saveChanges();
    }
  };

  // Handle name input with formatting
  const handleNameInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const formattedValue = formatName(target.value);
    updateLocalField("name", formattedValue);
  };

  // Handle name blur with final formatting
  const handleNameBlur = (e: FocusEvent) => {
    const target = e.target as HTMLInputElement;
    const formattedValue = formatName(target.value);
    updateLocalField("name", formattedValue);
    // Small delay to ensure state is updated before saving
    setTimeout(() => {
      if (hasUnsavedChanges()) {
        saveChanges();
      }
    }, 10);
  };

  return (
    <div class="border border-gray-200 rounded-md p-3 bg-gray-50">
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-sm font-medium text-gray-700">
          Plus One {props.index}
        </h4>
        <div class="flex items-center space-x-2">
          {/* Save status indicator */}
          {hasUnsavedChanges() && (
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span class="text-xs text-amber-600">Unsaved</span>
            </div>
          )}
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
      </div>
      <div class="space-y-2">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            value={localFormData().name}
            onInput={handleNameInput}
            onBlur={handleNameBlur}
            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200"
            placeholder={`${props.guestName || "Guest"}'s plus one`}
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Meal Preference
          </label>
          <input
            type="text"
            value={localFormData().meal_preference}
            onInput={(e) =>
              updateLocalField(
                "meal_preference",
                (e.target as HTMLInputElement).value
              )
            }
            onBlur={handleInputBlur}
            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200"
            placeholder="e.g., Vegetarian, Gluten-free"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Notes
          </label>
          <textarea
            value={localFormData().notes}
            onInput={(e) =>
              updateLocalField("notes", (e.target as HTMLTextAreaElement).value)
            }
            onBlur={handleInputBlur}
            class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200 resize-none"
            rows="2"
            placeholder="Any special notes"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PlusOneForm;

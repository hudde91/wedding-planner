import { createSignal, Component, For } from "solid-js";
import { Guest, GuestFormData, RSVPStatus, PlusOne } from "../../types";
import PlusOneForm from "./PlusOneForm";

interface GuestFormProps {
  editingGuest: Guest | null;
  onSubmit: (guestData: GuestFormData) => void;
  onCancel: () => void;
}

const GuestForm: Component<GuestFormProps> = (props) => {
  const [formData, setFormData] = createSignal<GuestFormData>({
    name: props.editingGuest?.name || "",
    email: props.editingGuest?.email || "",
    phone: props.editingGuest?.phone || "",
    rsvp_status: props.editingGuest?.rsvp_status || "pending",
    meal_preference: props.editingGuest?.meal_preference || "",
    plus_ones: props.editingGuest?.plus_ones || [],
    notes: props.editingGuest?.notes || "",
  });

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const data = formData();

    if (!data.name.trim()) {
      alert("Guest name is required");
      return;
    }

    props.onSubmit(data);
  };

  const updateFormField = <K extends keyof GuestFormData>(
    field: K,
    value: GuestFormData[K]
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPlusOne = (): void => {
    const currentForm = formData();
    const guestName = currentForm.name || "Guest";
    const plusOneNumber = currentForm.plus_ones.length + 1;

    const newPlusOne: PlusOne = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: `${guestName}'s plus one ${plusOneNumber}`,
      meal_preference: "",
      notes: "",
    };

    setFormData((prev) => ({
      ...prev,
      plus_ones: [...prev.plus_ones, newPlusOne],
    }));
  };

  const updatePlusOne = <K extends keyof PlusOne>(
    plusOneId: string,
    field: K,
    value: PlusOne[K]
  ): void => {
    setFormData((prev) => ({
      ...prev,
      plus_ones: prev.plus_ones.map((plusOne) =>
        plusOne.id === plusOneId ? { ...plusOne, [field]: value } : plusOne
      ),
    }));
  };

  const removePlusOne = (plusOneId: string): void => {
    setFormData((prev) => ({
      ...prev,
      plus_ones: prev.plus_ones.filter((plusOne) => plusOne.id !== plusOneId),
    }));
  };

  return (
    <div class="bg-gray-50 p-6 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">
        {props.editingGuest ? "Edit Guest" : "Add New Guest"}
      </h3>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData().name}
              onInput={(e) =>
                updateFormField("name", (e.target as HTMLInputElement).value)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData().email}
              onInput={(e) =>
                updateFormField("email", (e.target as HTMLInputElement).value)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData().phone}
              onInput={(e) =>
                updateFormField("phone", (e.target as HTMLInputElement).value)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              RSVP Status
            </label>
            <select
              value={formData().rsvp_status}
              onChange={(e) =>
                updateFormField(
                  "rsvp_status",
                  (e.target as HTMLSelectElement).value as RSVPStatus
                )
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pending</option>
              <option value="attending">Attending</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Meal Preference
            </label>
            <input
              type="text"
              value={formData().meal_preference}
              onInput={(e) =>
                updateFormField(
                  "meal_preference",
                  (e.target as HTMLInputElement).value
                )
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Vegetarian, Gluten-free"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Plus Ones
            </label>
            <div class="space-y-3">
              <button
                type="button"
                onClick={addPlusOne}
                class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors duration-200 flex items-center justify-center space-x-2"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span>Add Plus One</span>
              </button>

              <For each={formData().plus_ones}>
                {(plusOne, index) => (
                  <PlusOneForm
                    plusOne={plusOne}
                    index={index() + 1}
                    guestName={formData().name}
                    onUpdate={updatePlusOne}
                    onRemove={removePlusOne}
                  />
                )}
              </For>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData().notes}
            onInput={(e) =>
              updateFormField("notes", (e.target as HTMLTextAreaElement).value)
            }
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="2"
            placeholder="Any special notes or requirements"
          ></textarea>
        </div>
        <div class="flex space-x-2">
          <button
            type="submit"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
          >
            {props.editingGuest ? "Update Guest" : "Add Guest"}
          </button>
          <button
            type="button"
            onClick={props.onCancel}
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestForm;

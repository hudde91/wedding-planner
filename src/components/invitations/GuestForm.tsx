import { createSignal, Component, For, createEffect } from "solid-js";
import { Guest, GuestFormData, RSVPStatus, PlusOne } from "../../types";
import {
  validateEmail,
  validatePhoneNumber,
  formatName,
  generateId,
} from "../../utils/validation";
import PlusOneForm from "./PlusOneForm";

interface GuestFormProps {
  editingGuest: Guest | null;
  onSubmit: (guestData: GuestFormData) => void;
  onCancel: () => void;
}

// Simple sanitization for final data (only on submit)
const sanitizeForSubmit = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

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

  // Store current plus-one data (updated from child components)
  const [currentPlusOnes, setCurrentPlusOnes] = createSignal<
    Map<string, PlusOne>
  >(new Map());

  const [validationErrors, setValidationErrors] = createSignal<{
    email?: string;
    phone?: string;
  }>({});

  // Update form data when editing guest changes
  createEffect(() => {
    const newFormData = {
      name: props.editingGuest?.name || "",
      email: props.editingGuest?.email || "",
      phone: props.editingGuest?.phone || "",
      rsvp_status: props.editingGuest?.rsvp_status || "pending",
      meal_preference: props.editingGuest?.meal_preference || "",
      plus_ones: props.editingGuest?.plus_ones || [],
      notes: props.editingGuest?.notes || "",
    };

    setFormData(newFormData);

    // Reset plus-ones map when editing guest changes
    const plusOnesMap = new Map();
    newFormData.plus_ones.forEach((plusOne) => {
      plusOnesMap.set(plusOne.id, plusOne);
    });
    setCurrentPlusOnes(plusOnesMap);

    setValidationErrors({});
  });

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const data = formData();

    // Collect current plus-one data from child components
    const currentPlusOneData = Array.from(currentPlusOnes().values());

    // Clean and validate data only on submit
    const cleanData = {
      ...data,
      name: formatName(sanitizeForSubmit(data.name)),
      email: sanitizeForSubmit(data.email),
      phone: sanitizeForSubmit(data.phone),
      meal_preference: sanitizeForSubmit(data.meal_preference),
      notes: sanitizeForSubmit(data.notes),
      plus_ones: currentPlusOneData.map((plusOne) => ({
        ...plusOne,
        name: formatName(sanitizeForSubmit(plusOne.name)),
        meal_preference: sanitizeForSubmit(plusOne.meal_preference),
        notes: sanitizeForSubmit(plusOne.notes),
      })),
    };

    if (!cleanData.name.trim()) {
      alert("Guest name is required");
      return;
    }

    // Validate email if provided
    if (cleanData.email && !validateEmail(cleanData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate phone if provided
    if (cleanData.phone && !validatePhoneNumber(cleanData.phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    props.onSubmit(cleanData);
  };

  // Handle plus-one data updates (from child components)
  const handlePlusOneDataChange = (plusOneId: string, data: PlusOne) => {
    setCurrentPlusOnes((prev) => {
      const newMap = new Map(prev);
      newMap.set(plusOneId, data);
      return newMap;
    });
  };

  const updateFormField = <K extends keyof GuestFormData>(
    field: K,
    value: GuestFormData[K]
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user types
    if (field === "email" || field === "phone") {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Simple real-time validation (no sanitization)
  const handleEmailInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    updateFormField("email", value);

    // Real-time validation feedback
    if (value && !validateEmail(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePhoneInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    updateFormField("phone", value);

    // Real-time validation feedback
    if (value && !validatePhoneNumber(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number",
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const addPlusOne = (): void => {
    const currentForm = formData();
    const guestName = currentForm.name || "Guest";
    const plusOneNumber = currentForm.plus_ones.length + 1;

    const newPlusOne: PlusOne = {
      id: `temp_${generateId()}`,
      name: `${guestName}'s plus one ${plusOneNumber}`,
      meal_preference: "",
      notes: "",
    };

    // Add to form data
    setFormData((prev) => ({
      ...prev,
      plus_ones: [...prev.plus_ones, newPlusOne],
    }));

    // Add to current plus-ones map
    setCurrentPlusOnes((prev) => {
      const newMap = new Map(prev);
      newMap.set(newPlusOne.id, newPlusOne);
      return newMap;
    });
  };

  const removePlusOne = (plusOneId: string): void => {
    // Remove from form data
    setFormData((prev) => ({
      ...prev,
      plus_ones: prev.plus_ones.filter((plusOne) => plusOne.id !== plusOneId),
    }));

    // Remove from current plus-ones map
    setCurrentPlusOnes((prev) => {
      const newMap = new Map(prev);
      newMap.delete(plusOneId);
      return newMap;
    });
  };

  return (
    <div class="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-lg">
      <div class="mb-6">
        <h3 class="text-2xl font-medium text-gray-900">
          {props.editingGuest ? "Edit Guest" : "Add New Guest"}
        </h3>
        <p class="text-gray-600 font-light mt-1">
          Fill out all the details and click submit when ready
        </p>
      </div>

      <form onSubmit={handleSubmit} class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData().name}
              onInput={(e) =>
                updateFormField("name", (e.target as HTMLInputElement).value)
              }
              class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light"
              placeholder="Enter guest name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData().email}
              onInput={handleEmailInput}
              class={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light ${
                validationErrors().email
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-gray-200"
              }`}
              placeholder="guest@example.com"
            />
            {validationErrors().email && (
              <p class="text-red-500 text-sm mt-1 font-light">
                {validationErrors().email}
              </p>
            )}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData().phone}
              onInput={handlePhoneInput}
              class={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light ${
                validationErrors().phone
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-gray-200"
              }`}
              placeholder="(555) 123-4567"
            />
            {validationErrors().phone && (
              <p class="text-red-500 text-sm mt-1 font-light">
                {validationErrors().phone}
              </p>
            )}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              RSVP Status
            </label>
            <div class="relative">
              <select
                value={formData().rsvp_status}
                onChange={(e) =>
                  updateFormField(
                    "rsvp_status",
                    (e.target as HTMLSelectElement).value as RSVPStatus
                  )
                }
                class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light appearance-none cursor-pointer pr-10"
              >
                <option value="pending">Pending</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select>
              {/* Custom dropdown arrow */}
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
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
              class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light"
              placeholder="e.g., Vegetarian, Gluten-free, No allergies"
            />
          </div>
        </div>

        {/* Plus Ones Section */}
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">
              Plus Ones
            </label>
            <button
              type="button"
              onClick={addPlusOne}
              class="inline-flex items-center px-4 py-2 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50 transition-all duration-300 space-x-2"
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
              <span class="font-medium">Add Plus One</span>
            </button>
          </div>

          <div class="space-y-3">
            <For each={formData().plus_ones}>
              {(plusOne, index) => (
                <PlusOneForm
                  plusOne={plusOne}
                  index={index() + 1}
                  guestName={formData().name}
                  onRemove={removePlusOne}
                  onDataChange={handlePlusOneDataChange}
                />
              )}
            </For>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData().notes}
            onInput={(e) =>
              updateFormField("notes", (e.target as HTMLTextAreaElement).value)
            }
            class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light resize-none"
            rows="3"
            placeholder="Any special notes, dietary restrictions, or requirements"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div class="flex items-center space-x-4 pt-4">
          <button
            type="submit"
            class="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {props.editingGuest ? "Update Guest" : "Add Guest"}
          </button>
          <button
            type="button"
            onClick={props.onCancel}
            class="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestForm;

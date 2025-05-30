import { createSignal, Component, For } from "solid-js";
import {
  Guest,
  GuestFormData,
  RSVPStatus,
  PlusOne,
  GuestStats,
} from "../types";

interface GuestListProps {
  guests: Guest[];
  addGuest: (guestData: GuestFormData) => void;
  updateGuest: (id: string, guestData: GuestFormData) => void;
  deleteGuest: (id: string) => void;
}

const GuestList: Component<GuestListProps> = (props) => {
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editingGuest, setEditingGuest] = createSignal<Guest | null>(null);
  const [formData, setFormData] = createSignal<GuestFormData>({
    name: "",
    email: "",
    phone: "",
    rsvp_status: "pending",
    meal_preference: "",
    plus_ones: [],
    notes: "",
  });

  const resetForm = (): void => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      rsvp_status: "pending",
      meal_preference: "",
      plus_ones: [],
      notes: "",
    });
    setShowAddForm(false);
    setEditingGuest(null);
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const data = formData();

    if (!data.name.trim()) {
      alert("Guest name is required");
      return;
    }

    if (editingGuest()) {
      props.updateGuest(editingGuest()!.id, data);
    } else {
      props.addGuest(data);
    }

    resetForm();
  };

  const startEdit = (guest: Guest): void => {
    setFormData({
      ...guest,
      plus_ones: guest.plus_ones || [],
    });
    setEditingGuest(guest);
    setShowAddForm(true);
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

  const stats = (): GuestStats => {
    const guests = props.guests;
    const attending = guests.filter((g) => g.rsvp_status === "attending");
    const declined = guests.filter((g) => g.rsvp_status === "declined");
    const pending = guests.filter((g) => g.rsvp_status === "pending");
    const totalAttendees = attending.reduce(
      (sum, guest) => sum + 1 + guest.plus_ones.length,
      0
    );

    return { attending, declined, pending, totalAttendees };
  };

  const getRSVPColor = (status: RSVPStatus): string => {
    switch (status) {
      case "attending":
        return "text-green-600 bg-green-100";
      case "declined":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Guest List</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm())}
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
        >
          {showAddForm() ? "Cancel" : "Add Guest"}
        </button>
      </div>

      {props.guests.length > 0 && (
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">
              {props.guests.length}
            </div>
            <div class="text-sm text-blue-800">Total Invited</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">
              {stats().attending.length}
            </div>
            <div class="text-sm text-green-800">Attending</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-red-600">
              {stats().declined.length}
            </div>
            <div class="text-sm text-red-800">Declined</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">
              {stats().totalAttendees}
            </div>
            <div class="text-sm text-purple-800">Total Attendees</div>
          </div>
        </div>
      )}

      {showAddForm() && (
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">
            {editingGuest() ? "Edit Guest" : "Add New Guest"}
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
                    updateFormField(
                      "name",
                      (e.target as HTMLInputElement).value
                    )
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
                    updateFormField(
                      "email",
                      (e.target as HTMLInputElement).value
                    )
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
                    updateFormField(
                      "phone",
                      (e.target as HTMLInputElement).value
                    )
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
                      <div class="border border-gray-200 rounded-md p-3 bg-gray-50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-medium text-gray-700">
                            Plus One {index() + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removePlusOne(plusOne.id)}
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
                              value={plusOne.name}
                              onInput={(e) =>
                                updatePlusOne(
                                  plusOne.id,
                                  "name",
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                              placeholder={`${
                                formData().name || "Guest"
                              }'s plus one`}
                            />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">
                              Meal Preference
                            </label>
                            <input
                              type="text"
                              value={plusOne.meal_preference}
                              onInput={(e) =>
                                updatePlusOne(
                                  plusOne.id,
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
                              value={plusOne.notes}
                              onInput={(e) =>
                                updatePlusOne(
                                  plusOne.id,
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
                  updateFormField(
                    "notes",
                    (e.target as HTMLTextAreaElement).value
                  )
                }
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="2"
                placeholder="Any special notes or requirements"
              ></textarea>
            </div>
            <div class="flex space-x-2">
              <button
                type="submit"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
              >
                {editingGuest() ? "Update Guest" : "Add Guest"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guest List */}
      <div class="space-y-3">
        {props.guests.length === 0 ? (
          <div class="text-center py-12 text-gray-500">
            <div class="text-4xl mb-4">👥</div>
            <p class="text-lg font-medium mb-2">No guests added yet</p>
            <p>Add your first wedding guest above!</p>
          </div>
        ) : (
          <For each={props.guests}>
            {(guest) => (
              <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800">
                      {guest.name}
                    </h3>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      {guest.email && (
                        <span class="flex items-center">
                          <svg
                            class="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            ></path>
                          </svg>
                          {guest.email}
                        </span>
                      )}
                      {guest.phone && (
                        <span class="flex items-center">
                          <svg
                            class="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                          {guest.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      class={`px-2 py-1 rounded-full text-xs font-medium ${getRSVPColor(
                        guest.rsvp_status
                      )}`}
                    >
                      {guest.rsvp_status.charAt(0).toUpperCase() +
                        guest.rsvp_status.slice(1)}
                    </span>
                    <button
                      onClick={() => startEdit(guest)}
                      class="text-blue-500 hover:text-blue-700 p-1 rounded focus:outline-none"
                      title="Edit guest"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => props.deleteGuest(guest.id)}
                      class="text-red-500 hover:text-red-700 p-1 rounded focus:outline-none"
                      title="Delete guest"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  {guest.meal_preference && (
                    <div class="flex items-center text-gray-600">
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        ></path>
                      </svg>
                      <span>Meal: {guest.meal_preference}</span>
                    </div>
                  )}

                  {guest.plus_ones && guest.plus_ones.length > 0 && (
                    <div class="flex items-center text-gray-600">
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      <span>
                        +{guest.plus_ones.length} guest
                        {guest.plus_ones.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  <div class="flex items-center text-gray-600">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    <span>
                      Total:{" "}
                      {(() => {
                        const mainGuest = 1;
                        const plusOnesCount = guest.plus_ones
                          ? guest.plus_ones.length
                          : 0;
                        const total = mainGuest + plusOnesCount;
                        return `${total} attendee${total > 1 ? "s" : ""}`;
                      })()}
                    </span>
                  </div>
                </div>

                {guest.notes && (
                  <div class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Notes:</strong> {guest.notes}
                  </div>
                )}

                {guest.plus_ones && guest.plus_ones.length > 0 && (
                  <div class="mt-3 space-y-2">
                    <h4 class="text-sm font-semibold text-gray-700">
                      Plus Ones:
                    </h4>
                    <For each={guest.plus_ones}>
                      {(plusOne, index) => (
                        <div class="bg-gray-50 p-2 rounded text-sm">
                          <div class="font-medium text-gray-800">
                            {plusOne.name ||
                              `${guest.name}'s plus one ${index() + 1}`}
                          </div>
                          {plusOne.meal_preference && (
                            <div class="text-gray-600 text-xs">
                              Meal: {plusOne.meal_preference}
                            </div>
                          )}
                          {plusOne.notes && (
                            <div class="text-gray-600 text-xs">
                              Notes: {plusOne.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </div>
            )}
          </For>
        )}
      </div>
    </div>
  );
};

export default GuestList;

import { Component, createSignal, For, Show } from "solid-js";
import { Table, Guest } from "../../types";

interface TableCardProps {
  table: Table;
  guests: Guest[];
  onDelete: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdateCapacity: (id: string, capacity: number) => void;
  onRemoveGuest: (guestId: string) => void;
}

const TableCard: Component<TableCardProps> = (props) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editName, setEditName] = createSignal(props.table.name);
  const [editCapacity, setEditCapacity] = createSignal(props.table.capacity);

  const getTotalAssignedSeats = () => {
    return props.guests.reduce((sum, guest) => {
      if (guest.rsvp_status === "attending") {
        return sum + 1 + guest.plus_ones.length;
      }
      return sum;
    }, 0);
  };

  const getAvailableSeats = () => {
    return props.table.capacity - getTotalAssignedSeats();
  };

  const getCapacityStatus = () => {
    const assigned = getTotalAssignedSeats();
    const capacity = props.table.capacity;
    const percentage = capacity > 0 ? (assigned / capacity) * 100 : 0;

    if (percentage > 100)
      return {
        color: "text-red-600",
        bgColor: "bg-red-100",
        status: "Overbooked",
      };
    if (percentage === 100)
      return {
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        status: "Full",
      };
    if (percentage >= 80)
      return {
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        status: "Nearly Full",
      };
    return {
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      status: "Available",
    };
  };

  const handleSaveEdit = () => {
    props.onUpdateName(props.table.id, editName());
    props.onUpdateCapacity(props.table.id, editCapacity());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(props.table.name);
    setEditCapacity(props.table.capacity);
    setIsEditing(false);
  };

  const capacityStatus = getCapacityStatus();

  return (
    <div class="group bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
      {/* Table Header */}
      <div class="p-6 border-b border-gray-100/60 bg-gradient-to-r from-purple-50/30 to-violet-50/30">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-white"
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
              <Show
                when={!isEditing()}
                fallback={
                  <div class="space-y-2">
                    <input
                      type="text"
                      value={editName()}
                      onInput={(e) =>
                        setEditName((e.target as HTMLInputElement).value)
                      }
                      class="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-medium"
                      placeholder="Table name"
                    />
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={editCapacity()}
                      onInput={(e) =>
                        setEditCapacity(
                          Number((e.target as HTMLInputElement).value)
                        )
                      }
                      class="w-24 px-3 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                      placeholder="Capacity"
                    />
                  </div>
                }
              >
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {props.table.name}
                  </h3>
                  <p class="text-sm text-gray-600 font-light">
                    Capacity: {props.table.capacity} seats
                  </p>
                </div>
              </Show>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Show
              when={!isEditing()}
              fallback={
                <div class="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    class="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                    title="Save changes"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-300"
                    title="Cancel editing"
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
                      />
                    </svg>
                  </button>
                </div>
              }
            >
              <button
                onClick={() => setIsEditing(true)}
                class="opacity-0 group-hover:opacity-100 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-300"
                title="Edit table"
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
                  />
                </svg>
              </button>
              <button
                onClick={() => props.onDelete(props.table.id)}
                class="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300"
                title="Delete table"
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
                  />
                </svg>
              </button>
            </Show>
          </div>
        </div>

        {/* Capacity Status */}
        <div class="flex items-center justify-between">
          <div
            class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${capacityStatus.bgColor} ${capacityStatus.color}`}
          >
            <div
              class={`w-2 h-2 rounded-full mr-2 ${capacityStatus.color.replace(
                "text-",
                "bg-"
              )}`}
            ></div>
            {capacityStatus.status}
          </div>

          <div class="text-sm text-gray-600 font-light">
            {getTotalAssignedSeats()} / {props.table.capacity} seated
          </div>
        </div>

        {/* Progress Bar */}
        <div class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class={`h-2 rounded-full transition-all duration-1000 ${
                getTotalAssignedSeats() > props.table.capacity
                  ? "bg-gradient-to-r from-red-400 to-red-500"
                  : getTotalAssignedSeats() === props.table.capacity
                  ? "bg-gradient-to-r from-emerald-400 to-green-400"
                  : "bg-gradient-to-r from-blue-400 to-cyan-400"
              }`}
              style={`width: ${Math.min(
                (getTotalAssignedSeats() / props.table.capacity) * 100,
                100
              )}%`}
            ></div>
          </div>
        </div>
      </div>

      {/* Guest List */}
      <div class="p-6">
        <Show
          when={props.guests.length > 0}
          fallback={
            <div class="text-center py-8">
              <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h4 class="text-sm font-medium text-gray-900 mb-1">
                No guests assigned
              </h4>
              <p class="text-xs text-gray-500 font-light">
                Drag guests here to assign them to this table
              </p>
            </div>
          }
        >
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-700 flex items-center">
              <svg
                class="w-4 h-4 mr-2"
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
              Assigned Guests ({props.guests.length})
            </h4>

            <For each={props.guests}>
              {(guest) => (
                <div class="group bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg p-4 border border-purple-100/50 hover:border-purple-200 transition-all duration-300">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {guest.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <h5 class="font-medium text-gray-900 text-sm">
                            {guest.name}
                          </h5>
                          <div class="flex items-center space-x-3 text-xs text-gray-600">
                            <Show when={guest.plus_ones.length > 0}>
                              <span class="flex items-center">
                                <svg
                                  class="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                +{guest.plus_ones.length} guest
                                {guest.plus_ones.length > 1 ? "s" : ""}
                              </span>
                            </Show>
                            <Show when={guest.meal_preference}>
                              <span class="flex items-center">
                                <svg
                                  class="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                {guest.meal_preference}
                              </span>
                            </Show>
                          </div>
                        </div>
                      </div>

                      {/* Plus Ones */}
                      <Show when={guest.plus_ones.length > 0}>
                        <div class="mt-3 pl-11 space-y-2">
                          <For each={guest.plus_ones}>
                            {(plusOne, index) => (
                              <div class="flex items-center space-x-2 text-xs text-gray-600">
                                <div class="w-6 h-6 bg-purple-200 rounded-lg flex items-center justify-center text-purple-700 text-xs font-medium">
                                  +{index() + 1}
                                </div>
                                <span class="font-light">
                                  {plusOne.name ||
                                    `${guest.name}'s plus one ${index() + 1}`}
                                </span>
                                <Show when={plusOne.meal_preference}>
                                  <span class="text-gray-500">
                                    • {plusOne.meal_preference}
                                  </span>
                                </Show>
                              </div>
                            )}
                          </For>
                        </div>
                      </Show>
                    </div>

                    <button
                      onClick={() => props.onRemoveGuest(guest.id)}
                      class="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                      title="Remove from table"
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
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        {/* Table Visual Representation */}
        <Show when={props.guests.length > 0}>
          <div class="mt-6 pt-6 border-t border-gray-100">
            <h5 class="text-sm font-medium text-gray-700 mb-3">Table Layout</h5>
            <div class="relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200/50">
              {/* Table Surface */}
              <div class="w-32 h-20 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-lg mx-auto mb-4 flex items-center justify-center border border-amber-300/50">
                <span class="text-xs font-medium text-amber-800">
                  {props.table.name}
                </span>
              </div>

              {/* Seated Indicators */}
              <div class="flex justify-center space-x-2">
                {Array.from(
                  { length: Math.min(props.table.capacity, 8) },
                  (_, i) => (
                    <div
                      class={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        i < getTotalAssignedSeats()
                          ? "bg-purple-100 border-purple-300 text-purple-700"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                      title={
                        i < getTotalAssignedSeats() ? "Occupied" : "Available"
                      }
                    >
                      {i < getTotalAssignedSeats() ? "👤" : "○"}
                    </div>
                  )
                )}
                <Show when={props.table.capacity > 8}>
                  <div class="text-xs text-gray-500 ml-2">
                    +{props.table.capacity - 8} more
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default TableCard;

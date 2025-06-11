import { createSignal, Component, For, Show, onMount } from "solid-js";
import { Table, Guest } from "../../types";
import TableCard from "./TableCard";
import UnassignedGuests from "./UnassignedGuests";
import TableControls from "./TableControls";
import { nanoid } from "nanoid";

interface SeatingChartProps {
  tables: Table[];
  guests: Guest[];
  onUpdateTables: (tables: Table[]) => void;
}

const SeatingChart: Component<SeatingChartProps> = (props) => {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [viewMode, setViewMode] = createSignal<"visual" | "list">("visual");

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  const addTable = () => {
    const newTable: Table = {
      id: nanoid(),
      name: `Table ${props.tables.length + 1}`,
      capacity: 8,
      assigned_guests: [],
      x: 0,
      y: 0,
    };

    const updatedTables = [...props.tables, newTable];
    props.onUpdateTables(updatedTables);
  };

  const deleteTable = (id: string) => {
    const updatedTables = props.tables.filter((table) => table.id !== id);
    props.onUpdateTables(updatedTables);
  };

  const updateTableName = (id: string, name: string) => {
    const updatedTables = props.tables.map((table) =>
      table.id === id ? { ...table, name } : table
    );
    props.onUpdateTables(updatedTables);
  };

  const updateTableCapacity = (id: string, capacity: number) => {
    const updatedTables = props.tables.map((table) =>
      table.id === id ? { ...table, capacity } : table
    );
    props.onUpdateTables(updatedTables);
  };

  const assignGuestToTable = (guestId: string, tableId: string) => {
    const updatedTables = props.tables.map((table) => {
      // Remove guest from any other table first
      const assigned_guests = table.assigned_guests.filter(
        (id) => id !== guestId
      );

      // Add to the target table
      if (table.id === tableId) {
        assigned_guests.push(guestId);
      }

      return { ...table, assigned_guests };
    });

    props.onUpdateTables(updatedTables);
  };

  const removeGuestFromTable = (guestId: string) => {
    const updatedTables = props.tables.map((table) => ({
      ...table,
      assigned_guests: table.assigned_guests.filter((id) => id !== guestId),
    }));

    props.onUpdateTables(updatedTables);
  };

  const updateTablePosition = (id: string, x: number, y: number) => {
    const updatedTables = props.tables.map((table) =>
      table.id === id ? { ...table, x, y } : table
    );
    props.onUpdateTables(updatedTables);
  };

  const getUnassignedGuests = () => {
    const assignedGuestIds = new Set(
      props.tables.flatMap((table) => table.assigned_guests)
    );
    return props.guests.filter(
      (guest) =>
        guest.rsvp_status === "attending" && !assignedGuestIds.has(guest.id)
    );
  };

  const getTotalAttendees = () => {
    return props.guests
      .filter((guest) => guest.rsvp_status === "attending")
      .reduce((sum, guest) => sum + 1 + guest.plus_ones.length, 0);
  };

  const getSeatedAttendees = () => {
    return props.tables.reduce((sum, table) => {
      const tableGuests = props.guests.filter(
        (guest) =>
          table.assigned_guests.includes(guest.id) &&
          guest.rsvp_status === "attending"
      );
      return (
        sum +
        tableGuests.reduce(
          (guestSum, guest) => guestSum + 1 + guest.plus_ones.length,
          0
        )
      );
    }, 0);
  };

  const getTotalCapacity = () => {
    return props.tables.reduce((sum, table) => sum + table.capacity, 0);
  };

  const seatingStats = () => ({
    totalAttendees: getTotalAttendees(),
    seatedAttendees: getSeatedAttendees(),
    totalCapacity: getTotalCapacity(),
    unassignedCount: getUnassignedGuests().length,
    completionPercentage:
      getTotalAttendees() > 0
        ? Math.round((getSeatedAttendees() / getTotalAttendees()) * 100)
        : 0,
  });

  return (
    <div class="space-y-8">
      {/* Header with Background */}
      <div
        class={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 via-white to-violet-100 border border-purple-200/50 shadow-xl transition-all duration-1000 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=400&fit=crop&auto=format"
            alt="Wedding reception"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 p-8">
          <div class="flex justify-between items-center">
            <div class="max-w-3xl">
              <h1 class="text-4xl font-light text-gray-800 mb-4 tracking-wide">
                Seating Arrangements
              </h1>
              <p class="text-lg text-gray-600 font-light leading-relaxed">
                Create the perfect seating plan for your wedding reception.
                Arrange your guests thoughtfully to ensure everyone has a
                wonderful time.
              </p>
            </div>

            <div class="flex items-center space-x-4">
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div class="text-center">
                  <div class="text-2xl font-light text-purple-600">
                    {seatingStats().completionPercentage}%
                  </div>
                  <div class="text-sm text-gray-600 font-light">Complete</div>
                </div>
              </div>

              <button
                onClick={() =>
                  setViewMode(viewMode() === "visual" ? "list" : "visual")
                }
                class="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {viewMode() === "visual" ? "List View" : "Visual View"}
              </button>
            </div>
          </div>
        </div>

        <div class="absolute top-4 right-4 w-32 h-32 opacity-5">
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            class="text-purple-300"
          >
            <circle cx="20" cy="20" r="8" />
            <circle cx="50" cy="20" r="8" />
            <circle cx="80" cy="20" r="8" />
            <circle cx="20" cy="50" r="8" />
            <circle cx="80" cy="50" r="8" />
            <circle cx="20" cy="80" r="8" />
            <circle cx="50" cy="80" r="8" />
            <circle cx="80" cy="80" r="8" />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        class={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        {/* Total Tables */}
        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
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
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Total Tables
              </p>
              <p class="text-3xl font-light text-blue-600">
                {props.tables.length}
              </p>
            </div>
          </div>
        </div>

        {/* Seated Guests */}
        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Seated Guests
              </p>
              <p class="text-3xl font-light text-emerald-600">
                {seatingStats().seatedAttendees}
              </p>
              <p class="text-xs text-gray-500 font-light">
                of {seatingStats().totalAttendees} attending
              </p>
            </div>
          </div>
        </div>

        {/* Total Capacity */}
        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Total Capacity
              </p>
              <p class="text-3xl font-light text-purple-600">
                {seatingStats().totalCapacity}
              </p>
              <p class="text-xs text-gray-500 font-light">Available seats</p>
            </div>
          </div>
        </div>

        {/* Unassigned Guests */}
        <div class="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
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
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Unassigned
              </p>
              <p class="text-3xl font-light text-amber-600">
                {seatingStats().unassignedCount}
              </p>
              <p class="text-xs text-gray-500 font-light">Need seating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        class={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg transition-all duration-1000 delay-400 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                Seating Progress
              </h3>
              <p class="text-sm text-gray-500 font-light">
                Guest assignment completion
              </p>
            </div>
          </div>

          <div class="text-right">
            <div class="text-2xl font-light text-gray-900">
              {seatingStats().completionPercentage}%
            </div>
            <div class="text-sm text-gray-500 font-light">Complete</div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-sm text-gray-600">
            <span class="font-medium">
              {seatingStats().seatedAttendees} of{" "}
              {seatingStats().totalAttendees} guests seated
            </span>
            <span class="font-light">
              {seatingStats().unassignedCount > 0
                ? `${seatingStats().unassignedCount} guests remaining`
                : "All guests assigned!"}
            </span>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-gradient-to-r from-indigo-400 to-purple-400 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={`width: ${seatingStats().completionPercentage}%`}
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div
        class={`transition-all duration-1000 delay-600 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <TableControls onAddTable={addTable} />
      </div>

      {/* Main Content Area */}
      <div
        class={`grid grid-cols-1 ${
          getUnassignedGuests().length > 0 ? "lg:grid-cols-4" : ""
        } gap-8 transition-all duration-1000 delay-800 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        {/* Tables Section */}
        <div
          class={
            getUnassignedGuests().length > 0 ? "lg:col-span-3" : "col-span-1"
          }
        >
          <Show when={viewMode() === "visual"}>
            <div class="bg-gradient-to-br from-gray-50/50 via-white/80 to-purple-50/30 rounded-2xl p-8 border border-gray-100 shadow-lg min-h-[600px] relative overflow-hidden">
              {/* Background Pattern */}
              <div class="absolute inset-0 opacity-5">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="dots"
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="20" cy="20" r="1" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#dots)"
                    class="text-purple-300"
                  />
                </svg>
              </div>

              <div class="relative z-10">
                <Show when={props.tables.length === 0}>
                  <div class="text-center py-20">
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-100 shadow-lg max-w-md mx-auto">
                      <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg
                          class="w-12 h-12 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <h3 class="text-xl font-medium text-gray-900 mb-2">
                        No tables yet
                      </h3>
                      <p class="text-gray-600 font-light">
                        Add your first table to start planning your seating
                        arrangement!
                      </p>
                    </div>
                  </div>
                </Show>

                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <For each={props.tables}>
                    {(table, index) => (
                      <div
                        class="transition-all duration-500"
                        style={`animation-delay: ${index() * 100}ms`}
                      >
                        <TableCard
                          table={table}
                          guests={props.guests.filter((guest) =>
                            table.assigned_guests.includes(guest.id)
                          )}
                          onDelete={deleteTable}
                          onUpdateName={updateTableName}
                          onUpdateCapacity={updateTableCapacity}
                          onRemoveGuest={removeGuestFromTable}
                        />
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </Show>

          <Show when={viewMode() === "list"}>
            <div class="space-y-6">
              <For each={props.tables}>
                {(table, index) => (
                  <div
                    class="transition-all duration-500"
                    style={`animation-delay: ${index() * 100}ms`}
                  >
                    <TableCard
                      table={table}
                      guests={props.guests.filter((guest) =>
                        table.assigned_guests.includes(guest.id)
                      )}
                      onDelete={deleteTable}
                      onUpdateName={updateTableName}
                      onUpdateCapacity={updateTableCapacity}
                      onRemoveGuest={removeGuestFromTable}
                    />
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
        {/* Unassigned Guests Section */}
        <Show when={getUnassignedGuests().length > 0}>
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg">
            <h3 class="text-xl font-medium text-gray-900 mb-4">
              Unassigned Guests
            </h3>
            <UnassignedGuests
              guests={getUnassignedGuests()}
              tables={props.tables}
              onAssignGuest={assignGuestToTable}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};
export default SeatingChart;

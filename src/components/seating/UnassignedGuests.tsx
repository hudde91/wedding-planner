import { Component, For, Show, createSignal, createMemo } from "solid-js";
import { Guest, Table } from "../../types";

interface UnassignedGuestsProps {
  guests: Guest[];
  tables: Table[];
  onAssignGuestToSeat: (
    guestId: string,
    tableId: string,
    seatNumber: number
  ) => void;
}

interface Seat {
  number: number;
  isOccupied: boolean;
  occupiedBy?: string;
  guestName?: string;
}

const UnassignedGuests: Component<UnassignedGuestsProps> = (props) => {
  const [selectedGuest, setSelectedGuest] = createSignal<string | null>(null);
  const [selectedTable, setSelectedTable] = createSignal<string | null>(null);
  const [hoveredSeat, setHoveredSeat] = createSignal<number | null>(null);

  // Generate seats for a table based on capacity
  const generateSeats = createMemo(() => (table: Table): Seat[] => {
    const seats: Seat[] = [];
    const assignedGuests = props.guests.filter((guest) =>
      table.assigned_guests?.includes(guest.id)
    );

    // Calculate total attendees (main guests + plus ones)
    const totalAttendees = assignedGuests.reduce((sum, guest) => {
      return sum + 1 + (guest.plus_ones?.length || 0);
    }, 0);

    for (let i = 1; i <= table.capacity; i++) {
      // For now, mark seats as occupied based on total attendees
      // This is a simplified approach - in a more sophisticated system,
      // you'd track specific seat assignments
      const isOccupied = i <= totalAttendees;
      const occupyingGuestIndex = i - 1;
      let occupyingGuest = null;
      let guestName = "";

      if (isOccupied && occupyingGuestIndex < assignedGuests.length) {
        occupyingGuest = assignedGuests[occupyingGuestIndex];
        guestName = occupyingGuest.name;
      } else if (isOccupied) {
        // This would be a plus one - find which guest it belongs to
        let currentIndex = 0;
        for (const guest of assignedGuests) {
          if (occupyingGuestIndex === currentIndex) {
            guestName = guest.name;
            break;
          }
          currentIndex++;

          for (let j = 0; j < (guest.plus_ones?.length || 0); j++) {
            if (occupyingGuestIndex === currentIndex) {
              const plusOne = guest.plus_ones[j];
              guestName = plusOne.name || `${guest.name}'s +1`;
              break;
            }
            currentIndex++;
          }
          if (guestName) break;
        }
      }

      seats.push({
        number: i,
        isOccupied,
        occupiedBy: occupyingGuest?.id,
        guestName,
      });
    }
    return seats;
  });

  const handleGuestClick = (guestId: string) => {
    if (selectedGuest() === guestId) {
      // Deselect if clicking the same guest
      setSelectedGuest(null);
      setSelectedTable(null);
    } else {
      setSelectedGuest(guestId);
      setSelectedTable(null);
    }
  };

  const handleTableClick = (tableId: string) => {
    if (!selectedGuest()) return;

    if (selectedTable() === tableId) {
      setSelectedTable(null);
    } else {
      setSelectedTable(tableId);
    }
  };

  const handleSeatClick = (tableId: string, seatNumber: number) => {
    console.log(
      `Assigning guest ${selectedGuest()} to table ${tableId}, seat ${seatNumber}`
    );
    if (!selectedGuest() || !selectedTable()) return;

    const table = props.tables.find((t) => t.id === tableId);
    if (!table) return;

    const seats = generateSeats()(table);
    const seat = seats.find((s) => s.number === seatNumber);

    if (seat && !seat.isOccupied) {
      props.onAssignGuestToSeat(selectedGuest()!, tableId, seatNumber);
      setSelectedGuest(null);
      setSelectedTable(null);
    }
  };

  const clearSelection = () => {
    setSelectedGuest(null);
    setSelectedTable(null);
  };

  const getSelectedGuestData = createMemo(() => {
    const guestId = selectedGuest();
    return guestId ? props.guests.find((g) => g.id === guestId) : null;
  });

  const getTableAvailableSeats = (table: Table) => {
    const seats = generateSeats()(table);
    return seats.filter((seat) => !seat.isOccupied).length;
  };

  const getGuestPartySize = (guest: Guest) => {
    return {
      mainGuest: 1,
      plusOnes: guest.plus_ones.length,
      total: 1 + guest.plus_ones.length,
    };
  };

  return (
    <div class="space-y-8">
      {/* Selection Status Bar */}
      <Show when={selectedGuest()}>
        <div class="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  class="w-8 h-8 text-white"
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
              <div>
                <h3 class="text-2xl font-medium text-gray-900">
                  {getSelectedGuestData()?.name} Selected
                </h3>
                <div class="flex items-center space-x-4 mt-2">
                  <div class="flex items-center space-x-2 text-purple-700">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span class="font-medium">
                      Main guest +{" "}
                      {getSelectedGuestData()?.plus_ones?.length || 0} plus ones
                    </span>
                  </div>
                  <Show
                    when={getSelectedGuestData()?.plus_ones?.length && 0 > 0}
                  >
                    <div class="text-amber-600 text-sm font-medium bg-amber-50 px-3 py-1 rounded-full">
                      ⚠️ Plus ones need separate seats
                    </div>
                  </Show>
                  <Show when={!selectedTable()}>
                    <div class="text-gray-600 font-light">
                      → Choose a table below
                    </div>
                  </Show>
                  <Show when={selectedTable()}>
                    <div class="text-purple-700 font-medium">
                      → Select specific seat for main guest
                    </div>
                  </Show>
                </div>
              </div>
            </div>
            <button
              onClick={clearSelection}
              class="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-300"
            >
              <svg
                class="w-6 h-6"
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
      </Show>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Unassigned Guests Panel */}
        <div class="xl:col-span-1">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden sticky top-6">
            <div class="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-100/60">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-medium text-gray-900">
                    Unassigned Guests
                  </h3>
                  <p class="text-sm text-gray-600 font-light">
                    {props.guests.length} waiting for seats
                  </p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <Show
                when={props.guests.length > 0}
                fallback={
                  <div class="text-center py-12">
                    <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        class="w-8 h-8 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p class="text-gray-600 font-light">
                      All guests are seated!
                    </p>
                  </div>
                }
              >
                <div class="space-y-3">
                  <For each={props.guests}>
                    {(guest) => {
                      const partyInfo = getGuestPartySize(guest);
                      return (
                        <button
                          onClick={() => handleGuestClick(guest.id)}
                          class={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] ${
                            selectedGuest() === guest.id
                              ? "bg-gradient-to-r from-purple-100 to-violet-100 border-2 border-purple-300 shadow-lg"
                              : "bg-gradient-to-r from-white to-amber-50/30 border border-amber-200/40 hover:border-amber-300/60 hover:shadow-md"
                          }`}
                        >
                          <div class="flex items-center space-x-4">
                            <div
                              class={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
                                selectedGuest() === guest.id
                                  ? "bg-gradient-to-br from-purple-400 to-violet-500"
                                  : "bg-gradient-to-br from-amber-400 to-orange-500"
                              }`}
                            >
                              {guest.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div class="flex-1 min-w-0">
                              <h4 class="font-medium text-gray-900 truncate">
                                {guest.name}
                              </h4>
                              <div class="flex items-center space-x-3 mt-1">
                                <span class="text-xs text-gray-600">
                                  Main guest
                                </span>
                                <Show when={partyInfo.plusOnes > 0}>
                                  <span class="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                    +{partyInfo.plusOnes} plus ones
                                  </span>
                                </Show>
                                <Show when={guest.meal_preference}>
                                  <span class="text-xs text-gray-500">
                                    • {guest.meal_preference}
                                  </span>
                                </Show>
                              </div>
                            </div>
                            <Show when={selectedGuest() === guest.id}>
                              <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <svg
                                  class="w-4 h-4 text-white"
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
                              </div>
                            </Show>
                          </div>
                        </button>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </div>

        {/* Tables and Seating Panel */}
        <div class="xl:col-span-2">
          <div class="space-y-6">
            <Show
              when={props.tables.length > 0}
              fallback={
                <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl p-12 text-center">
                  <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg
                      class="w-12 h-12 text-gray-400"
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
                  <h3 class="text-2xl font-medium text-gray-900 mb-3">
                    No Tables Created
                  </h3>
                  <p class="text-gray-600 font-light">
                    Create some tables first to assign guests to specific seats
                  </p>
                </div>
              }
            >
              <For each={props.tables}>
                {(table) => {
                  const seats = generateSeats()(table);
                  const availableSeats = getTableAvailableSeats(table);
                  const isTableSelected = selectedTable() === table.id;
                  // Fix: Convert to proper boolean values
                  const canSelectTable =
                    selectedGuest() !== null && selectedTable() === null;
                  const hasAvailableSeats = availableSeats > 0;
                  console.log("canSelectTable:", canSelectTable);
                  console.log("hasAvailableSeats:", hasAvailableSeats);

                  return (
                    <div
                      class={`bg-white/90 backdrop-blur-sm rounded-2xl border shadow-xl overflow-hidden transition-all duration-500 ${
                        isTableSelected
                          ? "border-purple-300 shadow-2xl ring-4 ring-purple-100"
                          : canSelectTable && hasAvailableSeats
                          ? "border-green-200 hover:border-green-300 hover:shadow-2xl cursor-pointer"
                          : canSelectTable && !hasAvailableSeats
                          ? "border-red-200 opacity-60"
                          : "border-gray-100"
                      }`}
                    >
                      {/* Table Header */}
                      <div
                        class={`p-6 border-b transition-all duration-300 ${
                          isTableSelected
                            ? "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-100"
                            : canSelectTable && hasAvailableSeats
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 hover:from-green-100 hover:to-emerald-100"
                            : canSelectTable && !hasAvailableSeats
                            ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-100"
                            : "bg-gradient-to-r from-gray-50 to-white border-gray-100"
                        }`}
                        onClick={() =>
                          canSelectTable &&
                          hasAvailableSeats &&
                          handleTableClick(table.id)
                        }
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4">
                            <div
                              class={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                                isTableSelected
                                  ? "bg-gradient-to-br from-purple-400 to-violet-500 text-white"
                                  : canSelectTable && hasAvailableSeats
                                  ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                                  : canSelectTable && !hasAvailableSeats
                                  ? "bg-gradient-to-br from-red-400 to-pink-500 text-white"
                                  : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
                              }`}
                            >
                              <svg
                                class="w-7 h-7"
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
                            <div>
                              <h3 class="text-xl font-medium text-gray-900">
                                {table.name}
                              </h3>
                              <div class="flex items-center space-x-4 mt-1">
                                <span class="text-sm text-gray-600">
                                  {availableSeats} of {table.capacity} seats
                                  available
                                </span>
                                <Show when={canSelectTable}>
                                  <Show when={hasAvailableSeats}>
                                    <span class="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
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
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      Available
                                    </span>
                                  </Show>
                                  <Show when={!hasAvailableSeats}>
                                    <span class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
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
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      Table Full
                                    </span>
                                  </Show>
                                </Show>
                              </div>
                            </div>
                          </div>

                          <Show when={isTableSelected}>
                            <div class="text-purple-700 font-medium text-lg">
                              Select a Seat →
                            </div>
                          </Show>

                          <Show
                            when={
                              canSelectTable &&
                              hasAvailableSeats &&
                              !isTableSelected
                            }
                          >
                            <div class="text-green-700 font-medium">
                              Click to Select Table
                            </div>
                          </Show>
                        </div>
                      </div>

                      {/* Seat Layout */}
                      <Show when={isTableSelected || !selectedGuest()}>
                        <div class="p-8">
                          <div class="text-center mb-8">
                            <h4 class="text-lg font-medium text-gray-900 mb-2">
                              Seat Layout
                            </h4>
                            <p class="text-gray-600 font-light">
                              {isTableSelected
                                ? "Click on an available seat to assign the main guest"
                                : "Overview of current seating"}
                            </p>
                            <Show
                              when={
                                isTableSelected &&
                                (getSelectedGuestData()?.plus_ones?.length ??
                                  0) > 0
                              }
                            >
                              <div class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p class="text-sm text-amber-700">
                                  💡 After assigning the main guest, you'll need
                                  to separately assign each plus one to their
                                  own seats.
                                </p>
                              </div>
                            </Show>
                          </div>

                          {/* Circular Seat Arrangement */}
                          <div class="relative w-80 h-80 mx-auto">
                            {/* Table Surface */}
                            <div class="absolute inset-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full border-4 border-amber-200 shadow-inner">
                              <div class="w-full h-full flex items-center justify-center">
                                <div class="text-center">
                                  <div class="text-2xl font-bold text-amber-800">
                                    {table.name}
                                  </div>
                                  <div class="text-sm text-amber-700 mt-1">
                                    Table {table.capacity}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Seats arranged in circle */}
                            <For each={seats}>
                              {(seat, index) => {
                                const angle = (index() * 360) / seats.length;
                                const radian = (angle * Math.PI) / 180;
                                const radius = 140;
                                const x =
                                  radius +
                                  radius * Math.cos(radian - Math.PI / 2);
                                const y =
                                  radius +
                                  radius * Math.sin(radian - Math.PI / 2);

                                const isClickable =
                                  isTableSelected && !seat.isOccupied;
                                const isHovered = hoveredSeat() === seat.number;

                                return (
                                  <button
                                    class={`absolute w-12 h-12 rounded-full transition-all duration-300 transform flex items-center justify-center text-sm font-bold shadow-lg ${
                                      seat.isOccupied
                                        ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white cursor-not-allowed"
                                        : isClickable
                                        ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white hover:scale-110 hover:shadow-xl cursor-pointer"
                                        : "bg-gradient-to-br from-blue-200 to-indigo-200 text-blue-800"
                                    } ${
                                      isHovered ? "scale-110 shadow-xl" : ""
                                    }`}
                                    style={`left: ${x - 24}px; top: ${
                                      y - 24
                                    }px;`}
                                    onClick={() =>
                                      isClickable &&
                                      handleSeatClick(table.id, seat.number)
                                    }
                                    onMouseEnter={() =>
                                      setHoveredSeat(seat.number)
                                    }
                                    onMouseLeave={() => setHoveredSeat(null)}
                                    disabled={!isClickable}
                                    title={
                                      seat.isOccupied
                                        ? `Occupied by ${seat.guestName}`
                                        : `Seat ${seat.number} - Available`
                                    }
                                  >
                                    {seat.isOccupied ? (
                                      <svg
                                        class="w-6 h-6"
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
                                    ) : (
                                      seat.number
                                    )}
                                  </button>
                                );
                              }}
                            </For>
                          </div>

                          {/* Seat Legend */}
                          <div class="flex justify-center space-x-8 mt-8">
                            <div class="flex items-center space-x-2">
                              <div class="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full"></div>
                              <span class="text-sm text-gray-600">
                                Available
                              </span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <div class="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full"></div>
                              <span class="text-sm text-gray-600">
                                Occupied
                              </span>
                            </div>
                            <Show when={isTableSelected}>
                              <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full animate-pulse"></div>
                                <span class="text-sm text-purple-600 font-medium">
                                  Click to Assign Main Guest
                                </span>
                              </div>
                            </Show>
                          </div>

                          {/* Occupied Seats List */}
                          <Show when={seats.some((seat) => seat.isOccupied)}>
                            <div class="mt-8 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50">
                              <h5 class="text-sm font-medium text-gray-900 mb-3">
                                Current Seating
                              </h5>
                              <div class="grid grid-cols-2 gap-2">
                                <For
                                  each={seats.filter((seat) => seat.isOccupied)}
                                >
                                  {(seat) => (
                                    <div class="flex items-center space-x-2 text-sm">
                                      <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                                        {seat.number}
                                      </div>
                                      <span class="text-gray-800 truncate">
                                        {seat.guestName}
                                      </span>
                                    </div>
                                  )}
                                </For>
                              </div>
                            </div>
                          </Show>
                        </div>
                      </Show>
                    </div>
                  );
                }}
              </For>
            </Show>
          </div>
        </div>
      </div>

      {/* Instructions Panel */}
      <Show when={!selectedGuest()}>
        <div class="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-8 border border-blue-100/50">
          <div class="flex items-center space-x-6">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-medium text-gray-900 mb-4">
                How to Assign Seats
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <span class="text-blue-800">
                    Click a guest from the left panel
                  </span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <span class="text-blue-800">
                    Select a table with available seats
                  </span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <span class="text-blue-800">
                    Click on the specific seat number
                  </span>
                </div>
              </div>
              <div class="mt-4 p-4 bg-amber-50/50 rounded-lg border border-amber-200/50">
                <p class="text-sm text-amber-800">
                  <span class="font-medium">📝 Note:</span> Each guest
                  (including plus ones) needs their own individual seat
                  assignment. After assigning the main guest, repeat the process
                  for each plus one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default UnassignedGuests;

import {
  createSignal,
  createMemo,
  For,
  onMount,
  onCleanup,
  Component,
} from "solid-js";
import {
  Table,
  Guest,
  Attendee,
  TableFormData,
  SeatingStats,
  TableShape,
} from "../types";

interface SeatingChartProps {
  tables: Table[];
  guests: Guest[];
  updateSeatingPlan: (tables: Table[]) => void;
}

const SeatingChart: Component<SeatingChartProps> = (props) => {
  const [showAddTableForm, setShowAddTableForm] = createSignal(false);
  const [editingTable, setEditingTable] = createSignal<Table | null>(null);
  const [draggedGuest, setDraggedGuest] = createSignal<Attendee | null>(null);
  const [draggedFromSeat, setDraggedFromSeat] = createSignal<{
    tableId: number;
    seatId: number;
  } | null>(null);
  const [tableForm, setTableForm] = createSignal<TableFormData>({
    name: "",
    seats: 8,
    shape: "round",
  });

  const availableGuests = createMemo((): Attendee[] => {
    const attendingGuests = props.guests.filter(
      (guest) => guest.rsvp_status === "attending"
    );
    const allAttendees: Attendee[] = [];

    attendingGuests.forEach((guest) => {
      // Add the main guest
      allAttendees.push({
        id: guest.id,
        name: guest.name,
        type: "main",
        parentGuestId: null,
      });

      // Add their plus ones as individual attendees
      if (
        guest.plus_ones &&
        Array.isArray(guest.plus_ones) &&
        guest.plus_ones.length > 0
      ) {
        guest.plus_ones.forEach((plusOne, index) => {
          // Ensure plus one has an ID, create one if missing
          const plusOneId = plusOne.id || `${guest.id}_plus_${index}`;
          allAttendees.push({
            id: plusOneId,
            name: plusOne.name || `${guest.name}'s plus one ${index + 1}`,
            type: "plus_one",
            parentGuestId: guest.id,
          });
        });
      }
    });

    return allAttendees;
  });

  // Get guests who are not yet seated
  const unseatedGuests = createMemo((): Attendee[] => {
    const seatedGuestIds = new Set<string>();
    props.tables.forEach((table) => {
      table.seats.forEach((seat) => {
        if (seat.guestId) seatedGuestIds.add(seat.guestId);
      });
    });
    return availableGuests().filter(
      (attendee) => !seatedGuestIds.has(attendee.id)
    );
  });

  const resetTableForm = (): void => {
    setTableForm({ name: "", seats: 8, shape: "round" });
    setShowAddTableForm(false);
    setEditingTable(null);
  };

  const handleTableSubmit = (e: Event): void => {
    e.preventDefault();
    const form = tableForm();

    if (!form.name.trim()) {
      alert("Table name is required");
      return;
    }

    const seats = Array.from({ length: form.seats }, (_, i) => ({
      id: i + 1,
      guestId: null,
      guestName: "",
    }));

    if (editingTable()) {
      // Update existing table - ensure complete new objects
      const updatedTables = props.tables.map((table) =>
        table.id === editingTable()!.id
          ? {
              id: table.id,
              name: form.name,
              shape: form.shape,
              seats: [...seats], // New array
            }
          : {
              id: table.id,
              name: table.name,
              shape: table.shape,
              seats: [...table.seats], // New array for unchanged tables too
            }
      );
      props.updateSeatingPlan(updatedTables);
    } else {
      // Add new table
      const newTable: Table = {
        id: Date.now(), // Use Date.now() for internal table ID
        name: form.name,
        shape: form.shape,
        seats: [...seats], // Ensure new array
      };
      props.updateSeatingPlan([...props.tables, newTable]);
    }

    resetTableForm();
  };

  const startEditTable = (table: Table): void => {
    setTableForm({
      name: table.name,
      seats: table.seats.length,
      shape: table.shape,
    });
    setEditingTable(table);
    setShowAddTableForm(true);
  };

  const deleteTable = (tableId: number): void => {
    if (
      confirm(
        "Are you sure you want to delete this table? All seating assignments will be lost."
      )
    ) {
      const updatedTables = props.tables.filter(
        (table) => table.id !== tableId
      );
      props.updateSeatingPlan([...updatedTables]); // Ensure new array reference
    }
  };

  const [isDragging, setIsDragging] = createSignal(false);
  const [dragPosition, setDragPosition] = createSignal({ x: 0, y: 0 });
  const [hoveredSeat, setHoveredSeat] = createSignal<{
    tableId: number;
    seatId: number;
  } | null>(null);

  const handleMouseDown = (
    attendee: Attendee,
    fromSeat?: { tableId: number; seatId: number }
  ): void => {
    setDraggedGuest(attendee);
    setDraggedFromSeat(fromSeat || null);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (isDragging() && draggedGuest()) {
      setDragPosition({ x: e.clientX, y: e.clientY });

      // Find seat under cursor for hover effect
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const seatElement = element?.closest(
        "[data-seat-id]"
      ) as HTMLElement | null;

      if (seatElement) {
        const tableId = parseInt(
          seatElement.getAttribute("data-table-id") || "0"
        );
        const seatId = parseInt(
          seatElement.getAttribute("data-seat-id") || "0"
        );
        setHoveredSeat({ tableId, seatId });
      } else {
        setHoveredSeat(null);
      }
    }
  };

  const handleMouseUp = (e: MouseEvent): void => {
    if (!isDragging() || !draggedGuest()) {
      setIsDragging(false);
      setDraggedGuest(null);
      setDraggedFromSeat(null);
      return;
    }

    // Find the seat element under the mouse
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const seatElement = element?.closest(
      "[data-seat-id]"
    ) as HTMLElement | null;

    if (seatElement) {
      const tableId = parseInt(
        seatElement.getAttribute("data-table-id") || "0"
      );
      const seatId = parseInt(seatElement.getAttribute("data-seat-id") || "0");
      handleDrop(e, tableId, seatId);
    } else {
      console.log("No valid drop target found");
    }

    // Always clean up drag state
    setIsDragging(false);
    setDraggedGuest(null);
    setDraggedFromSeat(null);
    setHoveredSeat(null);
  };

  // Function to check if a seat is being hovered during drag
  const isSeatHovered = (tableId: number, seatId: number): boolean => {
    const hovered = hoveredSeat();
    return hovered
      ? hovered.tableId === tableId && hovered.seatId === seatId
      : false;
  };

  // Add global mouse event listeners using onMount to ensure proper initialization
  onMount(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      // Cleanup on component unmount
      onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      });
    }
  });

  const handleDrop = (e: Event, tableId: number, seatId: number): void => {
    e.preventDefault();
    const attendee = draggedGuest();
    const fromSeat = draggedFromSeat();

    if (!attendee) return;

    // Create completely new tables array with proper immutability
    const newTables = props.tables.map((table) => {
      // Create new seats array for each table
      const newSeats = table.seats.map((seat) => {
        if (table.id === tableId && seat.id === seatId) {
          // This is the target seat - place the attendee here
          return {
            id: seat.id,
            guestId: attendee.id,
            guestName: attendee.name,
          };
        } else if (
          fromSeat &&
          fromSeat.tableId &&
          table.id === fromSeat.tableId &&
          seat.id === fromSeat.seatId
        ) {
          // This is the source seat - remove the attendee
          return {
            id: seat.id,
            guestId: null,
            guestName: "",
          };
        } else {
          // Keep seat as-is but create new object for immutability
          return {
            id: seat.id,
            guestId: seat.guestId,
            guestName: seat.guestName,
          };
        }
      });

      // Return new table object
      return {
        id: table.id,
        name: table.name,
        shape: table.shape,
        seats: newSeats,
      };
    });

    props.updateSeatingPlan(newTables);
  };

  const removeGuestFromSeat = (tableId: number, seatId: number): void => {
    const newTables = props.tables.map((table) => {
      const newSeats = table.seats.map((seat) => {
        if (table.id === tableId && seat.id === seatId) {
          // Remove guest from this seat
          return {
            id: seat.id,
            guestId: null,
            guestName: "",
          };
        } else {
          // Keep seat as-is but create new object for immutability
          return {
            id: seat.id,
            guestId: seat.guestId,
            guestName: seat.guestName,
          };
        }
      });

      // Return new table object
      return {
        id: table.id,
        name: table.name,
        shape: table.shape,
        seats: newSeats,
      };
    });

    props.updateSeatingPlan(newTables);
  };

  const getSeatStyle = (
    index: number,
    total: number,
    shape: TableShape
  ): string => {
    if (shape === "rectangular") {
      // Distribute seats symmetrically along the sides with proper clearance
      const longSide = Math.ceil(total / 2); // Half on long sides
      const shortSide = Math.floor(total / 2); // Half on short sides

      if (index < longSide) {
        // Top side - positioned above table with clearance
        const progress = longSide > 1 ? index / (longSide - 1) : 0.5;
        return `top: 4px; left: ${
          25 + progress * 50
        }%; transform: translateX(-50%);`;
      } else {
        // Bottom side - positioned below table with clearance
        const bottomIndex = index - longSide;
        const progress = shortSide > 1 ? bottomIndex / (shortSide - 1) : 0.5;
        return `bottom: 4px; left: ${
          25 + progress * 50
        }%; transform: translateX(-50%);`;
      }
    } else {
      // Round table: seats positioned exactly on the table edge
      const angle = (index * 360) / total - 90; // Start from top
      const tableRadiusPx = 48; // Table is now 96px diameter (w-24), so 48px radius
      const seatOffsetPx = 12; // Small offset to position seats just outside the border
      const totalRadiusPx = tableRadiusPx + seatOffsetPx; // 60px from center

      // Convert to percentage relative to container (144px container with 16px padding = 112px usable)
      const usableSize = 112; // Container minus padding (144 - 32)
      const radiusPercent = (totalRadiusPx / usableSize) * 100;

      const x = 50 + radiusPercent * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radiusPercent * Math.sin((angle * Math.PI) / 180);
      return `left: ${x}%; top: ${y}%; transform: translate(-50%, -50%);`;
    }
  };

  const stats = createMemo((): SeatingStats => {
    const totalSeats = props.tables.reduce(
      (sum, table) => sum + table.seats.length,
      0
    );
    const occupiedSeats = props.tables.reduce(
      (sum, table) => sum + table.seats.filter((seat) => seat.guestId).length,
      0
    );
    return {
      totalSeats,
      occupiedSeats,
      unseatedGuests: unseatedGuests().length,
    };
  });

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Seating Chart</h2>
        <button
          onClick={() => setShowAddTableForm(!showAddTableForm())}
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
        >
          {showAddTableForm() ? "Cancel" : "Add Table"}
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">
            {props.tables.length}
          </div>
          <div class="text-sm text-blue-800">Tables</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-green-600">
            {stats().occupiedSeats}/{stats().totalSeats}
          </div>
          <div class="text-sm text-green-800">Seats Filled</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-orange-600">
            {stats().unseatedGuests}
          </div>
          <div class="text-sm text-orange-800">Unseated Guests</div>
        </div>
      </div>

      {/* Add/Edit Table Form */}
      {showAddTableForm() && (
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">
            {editingTable() ? "Edit Table" : "Add New Table"}
          </h3>
          <form onSubmit={handleTableSubmit} class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Table Name *
                </label>
                <input
                  type="text"
                  value={tableForm().name}
                  onInput={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      name: (e.target as HTMLInputElement).value,
                    }))
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Head Table, Table 1"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <input
                  type="number"
                  value={tableForm().seats}
                  onInput={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      seats:
                        parseInt((e.target as HTMLInputElement).value) || 4,
                    }))
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="2"
                  max="16"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Table Shape
                </label>
                <select
                  value={tableForm().shape}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      shape: (e.target as HTMLSelectElement)
                        .value as TableShape,
                    }))
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="round">Round</option>
                  <option value="rectangular">Rectangular</option>
                </select>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                type="submit"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
              >
                {editingTable() ? "Update Table" : "Add Table"}
              </button>
              <button
                type="button"
                onClick={resetTableForm}
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Unseated Guests */}
      {unseatedGuests().length > 0 && (
        <div class="bg-yellow-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-yellow-800 mb-3">
            Unseated Guests
          </h3>
          <div class="flex flex-wrap gap-2">
            <For each={unseatedGuests()}>
              {(attendee) => (
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleMouseDown(attendee);
                  }}
                  class={`px-3 py-1 rounded-full cursor-move hover:bg-yellow-300 transition-colors text-sm select-none ${
                    attendee.type === "plus_one"
                      ? "bg-orange-200 text-orange-800 hover:bg-orange-300"
                      : "bg-yellow-200 text-yellow-800"
                  } ${
                    isDragging() && draggedGuest()?.id === attendee.id
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
          <p class="text-sm text-yellow-700 mt-2">
            Drag attendees to available seats on tables. Plus ones are shown in
            orange.
          </p>
        </div>
      )}

      {/* Tables */}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <For each={props.tables}>
          {(table) => (
            <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-base font-semibold text-gray-800 truncate">
                  {table.name}
                </h3>
                <div class="flex space-x-1">
                  <button
                    onClick={() => startEditTable(table)}
                    class="text-blue-500 hover:text-blue-700 p-1"
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
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteTable(table.id)}
                    class="text-red-500 hover:text-red-700 p-1"
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
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="relative w-full aspect-square max-h-36 border-2 border-dashed border-gray-300 rounded-lg overflow-visible p-4">
                {/* Table representation */}
                <div
                  class={`absolute ${
                    table.shape === "round"
                      ? "w-24 h-24 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      : "inset-6 rounded-lg"
                  } bg-amber-100 border-2 border-amber-300`}
                ></div>

                {/* Seats */}
                <For each={table.seats}>
                  {(seat, index) => (
                    <div
                      class="absolute"
                      style={getSeatStyle(
                        index(),
                        table.seats.length,
                        table.shape
                      )}
                    >
                      <div
                        data-table-id={table.id}
                        data-seat-id={seat.id}
                        class={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                          seat.guestId
                            ? "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200"
                            : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200 border-dashed"
                        } ${
                          isDragging() && isSeatHovered(table.id, seat.id)
                            ? seat.guestId
                              ? "ring-2 ring-orange-300 bg-orange-100"
                              : "ring-2 ring-green-300 bg-green-100"
                            : isDragging()
                            ? "ring-1 ring-purple-300"
                            : ""
                        }`}
                        title={
                          isDragging() && isSeatHovered(table.id, seat.id)
                            ? seat.guestId
                              ? `Replace ${seat.guestName}?`
                              : `Drop ${draggedGuest()?.name} here`
                            : seat.guestId
                            ? `${seat.guestName} - Click to remove`
                            : "Drop guest here"
                        }
                        onClick={(e) => {
                          if (seat.guestId && !isDragging()) {
                            e.stopPropagation();
                            removeGuestFromSeat(table.id, seat.id);
                          }
                        }}
                      >
                        {seat.guestId ? (
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const attendee = availableGuests().find(
                                (a) => a.id === seat.guestId
                              );
                              if (attendee) {
                                handleMouseDown(attendee, {
                                  tableId: table.id,
                                  seatId: seat.id,
                                });
                              }
                            }}
                            class="text-center leading-tight cursor-move w-full h-full flex items-center justify-center pointer-events-auto select-none text-xs"
                          >
                            {seat.guestName
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        ) : (
                          <div class="text-center pointer-events-none text-xs">
                            +
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </For>
              </div>

              <div class="text-center text-xs text-gray-500 mt-2">
                {table.seats.filter((seat) => seat.guestId).length} /{" "}
                {table.seats.length} seats filled
              </div>
            </div>
          )}
        </For>
      </div>

      {props.tables.length === 0 && (
        <div class="text-center py-12 text-gray-500">
          <div class="text-4xl mb-4">🪑</div>
          <p class="text-lg font-medium mb-2">No tables created yet</p>
          <p>Add your first table to start planning the seating arrangement!</p>
        </div>
      )}

      {/* Floating drag preview */}
      {isDragging() && draggedGuest() && (
        <div
          class="fixed pointer-events-none z-50 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={`left: ${dragPosition().x}px; top: ${dragPosition().y}px;`}
        >
          {draggedGuest()!.name}
        </div>
      )}
    </div>
  );
};

export default SeatingChart;

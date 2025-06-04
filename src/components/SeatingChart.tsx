import {
  createSignal,
  createMemo,
  For,
  onMount,
  onCleanup,
  Component,
  Show,
  createEffect,
} from "solid-js";

// Mock types for this demo
type RSVPStatus = "pending" | "attending" | "declined";
type TableShape = "round" | "rectangular";

interface PlusOne {
  id: string;
  name: string;
  meal_preference: string;
  notes: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp_status: RSVPStatus;
  meal_preference: string;
  plus_ones: PlusOne[];
  notes: string;
}

interface Seat {
  id: number;
  guestId: string | null;
  guestName: string;
}

interface Table {
  id: number;
  name: string;
  seats: Seat[];
  shape: TableShape;
}

interface Attendee {
  id: string;
  name: string;
  type: "main" | "plus_one";
  parentGuestId: string | null;
}

interface TableFormData {
  name: string;
  seats: number;
  shape: TableShape;
}

interface SeatingStats {
  totalSeats: number;
  occupiedSeats: number;
  unseatedGuests: number;
}

const SeatingChart: Component = () => {
  // Mock data for demonstration
  const [tables, setTables] = createSignal<Table[]>([
    {
      id: 1,
      name: "Round Table 1",
      shape: "round",
      seats: [
        { id: 1, guestId: "guest1", guestName: "John Doe" },
        { id: 2, guestId: null, guestName: "" },
        { id: 3, guestId: "guest2", guestName: "Jane Smith" },
        { id: 4, guestId: null, guestName: "" },
        { id: 5, guestId: null, guestName: "" },
        { id: 6, guestId: null, guestName: "" },
        { id: 7, guestId: null, guestName: "" },
        { id: 8, guestId: null, guestName: "" },
      ],
    },
    {
      id: 2,
      name: "Rectangular Table",
      shape: "rectangular",
      seats: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        guestId: null,
        guestName: "",
      })),
    },
    {
      id: 3,
      name: "Large Round Table",
      shape: "round",
      seats: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        guestId: null,
        guestName: "",
      })),
    },
  ]);

  const guests: Guest[] = [
    {
      id: "guest1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      rsvp_status: "attending",
      meal_preference: "Vegetarian",
      plus_ones: [],
      notes: "",
    },
    {
      id: "guest2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      rsvp_status: "attending",
      meal_preference: "Regular",
      plus_ones: [],
      notes: "",
    },
    {
      id: "guest3",
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "555-123-4567",
      rsvp_status: "attending",
      meal_preference: "Vegan",
      plus_ones: [],
      notes: "",
    },
    {
      id: "guest4",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "555-987-6543",
      rsvp_status: "attending",
      meal_preference: "Regular",
      plus_ones: [],
      notes: "",
    },
    {
      id: "guest5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "555-246-8135",
      rsvp_status: "attending",
      meal_preference: "Vegetarian",
      plus_ones: [],
      notes: "",
    },
  ];

  // Table management state
  const [showAddTableForm, setShowAddTableForm] = createSignal(false);
  const [editingTable, setEditingTable] = createSignal<Table | null>(null);
  const [tableForm, setTableForm] = createSignal<TableFormData>({
    name: "",
    seats: 8,
    shape: "round",
  });

  // Guest drag state
  const [isDragging, setIsDragging] = createSignal(false);
  const [dragPosition, setDragPosition] = createSignal({ x: 0, y: 0 });
  const [hoveredSeat, setHoveredSeat] = createSignal<{
    tableId: number;
    seatId: number;
  } | null>(null);
  const [draggedGuest, setDraggedGuest] = createSignal<Attendee | null>(null);
  const [draggedFromSeat, setDraggedFromSeat] = createSignal<{
    tableId: number;
    seatId: number;
  } | null>(null);

  // Computed values
  const availableGuests = createMemo((): Attendee[] => {
    const attendingGuests = guests.filter(
      (guest) => guest.rsvp_status === "attending"
    );
    const allAttendees: Attendee[] = [];

    attendingGuests.forEach((guest) => {
      allAttendees.push({
        id: guest.id,
        name: guest.name,
        type: "main",
        parentGuestId: null,
      });

      if (
        guest.plus_ones &&
        Array.isArray(guest.plus_ones) &&
        guest.plus_ones.length > 0
      ) {
        guest.plus_ones.forEach((plusOne, index) => {
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

  const unseatedGuests = createMemo((): Attendee[] => {
    const seatedGuestIds = new Set<string>();
    tables().forEach((table) => {
      table.seats.forEach((seat) => {
        if (seat.guestId) seatedGuestIds.add(seat.guestId);
      });
    });
    return availableGuests().filter(
      (attendee) => !seatedGuestIds.has(attendee.id)
    );
  });

  const stats = createMemo((): SeatingStats => {
    const totalSeats = tables().reduce(
      (sum, table) => sum + table.seats.length,
      0
    );
    const occupiedSeats = tables().reduce(
      (sum, table) => sum + table.seats.filter((seat) => seat.guestId).length,
      0
    );
    return {
      totalSeats,
      occupiedSeats,
      unseatedGuests: unseatedGuests().length,
    };
  });

  const getTableSize = (
    seatCount: number,
    shape: TableShape
  ): { width: number; height: number } => {
    if (shape === "rectangular") {
      const dotsPerSide = Math.ceil(seatCount / 2);
      const remainingDots = seatCount - dotsPerSide;
      const maxDotsOnSide = Math.max(dotsPerSide, remainingDots);

      const baseWidth = 120;
      const baseHeight = 50;

      // Scale width based on maximum dots on any side
      // Each additional dot needs about 30-35px of spacing
      const widthPerDot = 32;
      const calculatedWidth = Math.max(
        baseWidth,
        maxDotsOnSide * widthPerDot + 40
      );

      return { width: calculatedWidth, height: baseHeight };
    } else {
      const baseSize = 40; // Minimum table size
      const sizePerSeat = 3; // Additional size per seat
      const maxSize = 70;

      const calculatedSize = Math.min(
        maxSize,
        baseSize + seatCount * sizePerSeat
      );
      return { width: calculatedSize, height: calculatedSize };
    }
  };

  const getContainerSize = (
    seatCount: number,
    shape: TableShape
  ): { width: number; height: number } => {
    const tableSize = getTableSize(seatCount, shape);

    if (shape === "rectangular") {
      // Container needs to accommodate the table plus space for seats
      const width = tableSize.width + 80; // Extra space on sides
      const height = tableSize.height + 100; // Space for seats above and below

      return { width: Math.max(250, width), height: Math.max(150, height) };
    } else {
      // Round tables
      const size = Math.max(120, tableSize.width + 64);
      return { width: size, height: size };
    }
  };

  const getGridClasses = createMemo((): string => {
    const tablesData = tables();
    if (tablesData.length === 0) return "grid-cols-1";

    // Calculate the maximum container width needed
    const maxContainerWidth = Math.max(
      ...tablesData.map((table) => {
        const containerSize = getContainerSize(table.seats.length, table.shape);
        return containerSize.width;
      })
    );

    // Define breakpoints and column counts based on max container width
    // These values ensure tables don't overlap
    if (maxContainerWidth <= 200) {
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    } else if (maxContainerWidth <= 280) {
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else if (maxContainerWidth <= 350) {
      return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    } else if (maxContainerWidth <= 450) {
      return "grid-cols-1 lg:grid-cols-2";
    } else {
      // For very large tables, use single column
      return "grid-cols-1";
    }
  });

  const getSeatStyle = (
    index: number,
    total: number,
    shape: TableShape
  ): string => {
    if (shape === "rectangular") {
      const tableSize = getTableSize(total, shape);
      const containerSize = getContainerSize(total, shape);

      const dotsPerSide = Math.ceil(total / 2);
      const remainingDots = total - dotsPerSide;

      if (index < dotsPerSide) {
        // Top side dots - evenly spaced across the width
        const topSpacing = tableSize.width / (dotsPerSide + 1);
        const x =
          (containerSize.width - tableSize.width) / 2 +
          topSpacing * (index + 1);
        const y = (containerSize.height - tableSize.height) / 2 - 32; // 32px above table
        return `left: ${x}px; top: ${y}px; transform: translateX(-50%);`;
      } else {
        // Bottom side dots - evenly spaced across the width
        const bottomIndex = index - dotsPerSide;
        const bottomSpacing = tableSize.width / (remainingDots + 1);
        const x =
          (containerSize.width - tableSize.width) / 2 +
          bottomSpacing * (bottomIndex + 1);
        const y =
          (containerSize.height - tableSize.height) / 2 + tableSize.height;
        return `left: ${x}px; top: ${y}px; transform: translateX(-50%);`;
      }
    } else {
      const tableSize = getTableSize(total, shape);
      const containerSize = getContainerSize(total, shape);

      const angleStep = (2 * Math.PI) / total;
      const angle = index * angleStep - Math.PI / 2;

      const tableRadius = tableSize.width / 2;
      const seatDistance = 18;
      const seatRadius = tableRadius + seatDistance;

      const centerX = containerSize.width / 2;
      const centerY = containerSize.height / 2;

      const x = centerX + seatRadius * Math.cos(angle);
      const y = centerY + seatRadius * Math.sin(angle);

      return `left: ${x}px; top: ${y}px; transform: translate(-50%, -50%);`;
    }
  };

  // Table management functions
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
      const updatedTables = tables().map((table) =>
        table.id === editingTable()!.id
          ? {
              id: table.id,
              name: form.name,
              shape: form.shape,
              seats: [...seats],
            }
          : {
              id: table.id,
              name: table.name,
              shape: table.shape,
              seats: [...table.seats],
            }
      );
      setTables(updatedTables);
    } else {
      const newTable: Table = {
        id: Date.now(),
        name: form.name,
        shape: form.shape,
        seats: [...seats],
      };
      setTables([...tables(), newTable]);
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
      const updatedTables = tables().filter((table) => table.id !== tableId);
      setTables([...updatedTables]);
    }
  };

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
    }

    setIsDragging(false);
    setDraggedGuest(null);
    setDraggedFromSeat(null);
    setHoveredSeat(null);
  };

  const isSeatHovered = (tableId: number, seatId: number): boolean => {
    const hovered = hoveredSeat();
    return hovered
      ? hovered.tableId === tableId && hovered.seatId === seatId
      : false;
  };

  const handleDrop = (e: Event, tableId: number, seatId: number): void => {
    e.preventDefault();
    const attendee = draggedGuest();
    const fromSeat = draggedFromSeat();

    if (!attendee) return;

    const newTables = tables().map((table) => {
      const newSeats = table.seats.map((seat) => {
        if (table.id === tableId && seat.id === seatId) {
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
          return {
            id: seat.id,
            guestId: null,
            guestName: "",
          };
        } else {
          return {
            id: seat.id,
            guestId: seat.guestId,
            guestName: seat.guestName,
          };
        }
      });

      return {
        id: table.id,
        name: table.name,
        shape: table.shape,
        seats: newSeats,
      };
    });

    setTables(newTables);
  };

  const removeGuestFromSeat = (tableId: number, seatId: number): void => {
    const newTables = tables().map((table) => {
      const newSeats = table.seats.map((seat) => {
        if (table.id === tableId && seat.id === seatId) {
          return {
            id: seat.id,
            guestId: null,
            guestName: "",
          };
        } else {
          return {
            id: seat.id,
            guestId: seat.guestId,
            guestName: seat.guestName,
          };
        }
      });

      return {
        id: table.id,
        name: table.name,
        shape: table.shape,
        seats: newSeats,
      };
    });

    setTables(newTables);
  };

  // Event listeners
  onMount(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      });
    }
  });

  return (
    <div class="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">
          Perfect Seating Chart Demo
        </h2>
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
          <div class="text-2xl font-bold text-blue-600">{tables().length}</div>
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
        <div class="bg-white p-6 rounded-lg shadow-sm border">
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
                  max="20"
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
        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 class="text-lg font-semibold text-yellow-800 mb-3">
            Unseated Guests (Drag to seats)
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
        </div>
      )}

      {/* Tables */}
      <div class={`grid ${getGridClasses()} gap-6`}>
        <For each={tables()}>
          {(table) => (
            <div class="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
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

              {(() => {
                const tableSize = getTableSize(table.seats.length, table.shape);
                const containerSize = getContainerSize(
                  table.seats.length,
                  table.shape
                );

                return (
                  <div
                    class="relative border-2 border-dashed border-gray-300 rounded-lg overflow-visible p-4 mx-auto"
                    style={`width: ${containerSize.width}px; height: ${containerSize.height}px;`}
                  >
                    {/* Table representation */}
                    <div
                      class={`absolute ${
                        table.shape === "round" ? "rounded-full" : "rounded-lg"
                      } bg-amber-100 border-2 border-amber-300`}
                      style={`width: ${tableSize.width}px; height: ${
                        tableSize.height
                      }px; left: ${
                        (containerSize.width - tableSize.width) / 2
                      }px; top: ${
                        (containerSize.height - tableSize.height) / 2
                      }px;`}
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
                );
              })()}

              <div class="text-center text-xs text-gray-500 mt-2">
                {table.seats.filter((seat) => seat.guestId).length} /{" "}
                {table.seats.length} seats filled
              </div>
            </div>
          )}
        </For>
      </div>

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

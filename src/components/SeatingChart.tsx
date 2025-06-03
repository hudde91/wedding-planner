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

// Predefined table formations
interface TableFormation {
  id: string;
  name: string;
  description: string;
  icon: string;
  tables: Array<{
    name: string;
    seats: number;
    shape: TableShape;
    x?: number;
    y?: number;
  }>;
  maxGuests: number;
  minGuests: number;
}

const tableFormations: TableFormation[] = [
  {
    id: "intimate",
    name: "Intimate Gathering",
    description: "Perfect for small, cozy celebrations",
    icon: "💕",
    tables: [
      { name: "Head Table", seats: 10, shape: "rectangular" },
      { name: "Family Table", seats: 8, shape: "round" },
      { name: "Friends Table", seats: 8, shape: "round" },
    ],
    maxGuests: 26,
    minGuests: 15,
  },
  {
    id: "classic",
    name: "Classic Wedding",
    description: "Traditional layout for medium-sized weddings",
    icon: "💒",
    tables: [
      { name: "Head Table", seats: 12, shape: "rectangular" },
      { name: "Table 1", seats: 8, shape: "round" },
      { name: "Table 2", seats: 8, shape: "round" },
      { name: "Table 3", seats: 8, shape: "round" },
      { name: "Table 4", seats: 8, shape: "round" },
      { name: "Table 5", seats: 8, shape: "round" },
    ],
    maxGuests: 52,
    minGuests: 35,
  },
  {
    id: "grand",
    name: "Grand Reception",
    description: "Elegant setup for large celebrations",
    icon: "✨",
    tables: [
      { name: "Head Table", seats: 14, shape: "rectangular" },
      { name: "Table 1", seats: 10, shape: "round" },
      { name: "Table 2", seats: 10, shape: "round" },
      { name: "Table 3", seats: 10, shape: "round" },
      { name: "Table 4", seats: 10, shape: "round" },
      { name: "Table 5", seats: 10, shape: "round" },
      { name: "Table 6", seats: 10, shape: "round" },
      { name: "Table 7", seats: 10, shape: "round" },
      { name: "Table 8", seats: 10, shape: "round" },
    ],
    maxGuests: 94,
    minGuests: 65,
  },
  {
    id: "family_style",
    name: "Family Style",
    description: "Long tables for a communal dining experience",
    icon: "🍽️",
    tables: [
      { name: "Long Table 1", seats: 16, shape: "rectangular" },
      { name: "Long Table 2", seats: 16, shape: "rectangular" },
      { name: "Long Table 3", seats: 16, shape: "rectangular" },
      { name: "Head Table", seats: 12, shape: "rectangular" },
    ],
    maxGuests: 60,
    minGuests: 40,
  },
  {
    id: "cocktail",
    name: "Cocktail Reception",
    description: "Standing tables and lounge areas",
    icon: "🍸",
    tables: [
      { name: "Cocktail Table 1", seats: 4, shape: "round" },
      { name: "Cocktail Table 2", seats: 4, shape: "round" },
      { name: "Cocktail Table 3", seats: 4, shape: "round" },
      { name: "Cocktail Table 4", seats: 4, shape: "round" },
      { name: "Cocktail Table 5", seats: 4, shape: "round" },
      { name: "Cocktail Table 6", seats: 4, shape: "round" },
      { name: "Lounge Area 1", seats: 6, shape: "round" },
      { name: "Lounge Area 2", seats: 6, shape: "round" },
    ],
    maxGuests: 36,
    minGuests: 20,
  },
];

const SeatingChart: Component<SeatingChartProps> = (props) => {
  // Core state
  const [currentView, setCurrentView] = createSignal<"formations" | "custom">(
    "formations"
  );
  const [selectedFormation, setSelectedFormation] =
    createSignal<TableFormation | null>(null);
  const [totalGuestsInput, setTotalGuestsInput] = createSignal<number>(0);
  const [showFormationCustomizer, setShowFormationCustomizer] =
    createSignal(false);

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

  // Table arrangement state
  const [isDraggingTable, setIsDraggingTable] = createSignal(false);
  const [draggedTable, setDraggedTable] = createSignal<Table | null>(null);
  const [tablePositions, setTablePositions] = createSignal<
    Record<number, { x: number; y: number }>
  >({});

  // Computed values
  const availableGuests = createMemo((): Attendee[] => {
    const attendingGuests = props.guests.filter(
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
    props.tables.forEach((table) => {
      table.seats.forEach((seat) => {
        if (seat.guestId) seatedGuestIds.add(seat.guestId);
      });
    });
    return availableGuests().filter(
      (attendee) => !seatedGuestIds.has(attendee.id)
    );
  });

  const totalAttendees = createMemo(() => availableGuests().length);

  const getRecommendedFormation = createMemo(() => {
    const attendeeCount = totalAttendees();
    return (
      tableFormations.find(
        (formation) =>
          attendeeCount >= formation.minGuests &&
          attendeeCount <= formation.maxGuests
      ) || tableFormations[1]
    ); // Default to classic
  });

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

  // Initialize guest count when component loads
  createEffect(() => {
    if (totalGuestsInput() === 0) {
      setTotalGuestsInput(totalAttendees());
    }
  });

  // Initialize table positions when tables change
  createEffect(() => {
    const currentPositions = tablePositions();
    const newPositions: Record<number, { x: number; y: number }> = {};

    props.tables.forEach((table, index) => {
      if (currentPositions[table.id]) {
        newPositions[table.id] = currentPositions[table.id];
      } else {
        const cols = Math.min(props.tables.length, 4);
        const row = Math.floor(index / cols);
        const col = index % cols;

        const cellWidth = 350 / cols;
        const cellHeight = 80;

        newPositions[table.id] = {
          x: 50 + col * cellWidth,
          y: 100 + row * cellHeight,
        };
      }
    });

    setTablePositions(newPositions);
  });

  // Formation functions
  const handleFormationSelect = (formation: TableFormation) => {
    setSelectedFormation(formation);
    setTotalGuestsInput(Math.max(totalAttendees(), formation.minGuests));
    setShowFormationCustomizer(true);
  };

  const applyFormation = () => {
    const formation = selectedFormation();
    if (!formation) return;

    const guestCount = totalGuestsInput();

    const newTables: Table[] = formation.tables.map((tableTemplate, index) => {
      let adjustedSeats = tableTemplate.seats;

      const seatsUsedSoFar = formation.tables
        .slice(0, index)
        .reduce((sum, t) => sum + t.seats, 0);
      const remainingGuests = guestCount - seatsUsedSoFar;

      if (remainingGuests > 0 && remainingGuests < tableTemplate.seats) {
        adjustedSeats = Math.max(remainingGuests, 2);
      }

      const seats = Array.from({ length: adjustedSeats }, (_, i) => ({
        id: i + 1,
        guestId: null,
        guestName: "",
      }));

      return {
        id: Date.now() + index,
        name: tableTemplate.name,
        shape: tableTemplate.shape,
        seats: seats,
      };
    });

    props.updateSeatingPlan(newTables);
    setCurrentView("custom");
    setShowFormationCustomizer(false);
    setSelectedFormation(null);
  };

  const resetToFormations = () => {
    setCurrentView("formations");
    setShowFormationCustomizer(false);
    setSelectedFormation(null);
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
      const updatedTables = props.tables.map((table) =>
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
      props.updateSeatingPlan(updatedTables);
    } else {
      const newTable: Table = {
        id: Date.now(),
        name: form.name,
        shape: form.shape,
        seats: [...seats],
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
      props.updateSeatingPlan([...updatedTables]);
    }
  };

  // Table drag functions
  const handleTableMouseDown = (table: Table, e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedTable(table);
    setIsDraggingTable(true);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setDragPosition({
      x: e.clientX - centerX,
      y: e.clientY - centerY,
    });
  };

  const handleTableMouseMove = (e: MouseEvent): void => {
    if (isDraggingTable() && draggedTable()) {
      e.preventDefault();

      const previewContainer = document.querySelector(
        "[data-preview-container]"
      ) as HTMLElement;
      if (!previewContainer) return;

      const containerRect = previewContainer.getBoundingClientRect();

      const newX = e.clientX - containerRect.left - dragPosition().x;
      const newY = e.clientY - containerRect.top - dragPosition().y;

      const constrainedX = Math.max(
        20,
        Math.min(newX, containerRect.width - 100)
      );
      const constrainedY = Math.max(
        20,
        Math.min(newY, containerRect.height - 80)
      );

      setTablePositions((prev) => ({
        ...prev,
        [draggedTable()!.id]: { x: constrainedX, y: constrainedY },
      }));
    }
  };

  const handleTableMouseUp = (): void => {
    setIsDraggingTable(false);
    setDraggedTable(null);
    setDragPosition({ x: 0, y: 0 });
  };

  // Guest drag functions
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

    const newTables = props.tables.map((table) => {
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

    props.updateSeatingPlan(newTables);
  };

  const removeGuestFromSeat = (tableId: number, seatId: number): void => {
    const newTables = props.tables.map((table) => {
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

    props.updateSeatingPlan(newTables);
  };

  const getSeatStyle = (
    index: number,
    total: number,
    shape: TableShape
  ): string => {
    if (shape === "rectangular") {
      const longSide = Math.ceil(total / 2);
      const shortSide = Math.floor(total / 2);

      if (index < longSide) {
        const progress = longSide > 1 ? index / (longSide - 1) : 0.5;
        return `top: 4px; left: ${
          25 + progress * 50
        }%; transform: translateX(-50%);`;
      } else {
        const bottomIndex = index - longSide;
        const progress = shortSide > 1 ? bottomIndex / (shortSide - 1) : 0.5;
        return `bottom: 4px; left: ${
          25 + progress * 50
        }%; transform: translateX(-50%);`;
      }
    } else {
      const angle = (index * 360) / total - 90;
      const tableRadiusPx = 48;
      const seatOffsetPx = 12;
      const totalRadiusPx = tableRadiusPx + seatOffsetPx;

      const usableSize = 112;
      const radiusPercent = (totalRadiusPx / usableSize) * 100;

      const x = 50 + radiusPercent * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radiusPercent * Math.sin((angle * Math.PI) / 180);
      return `left: ${x}%; top: ${y}%; transform: translate(-50%, -50%);`;
    }
  };

  // Event listeners
  onMount(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleTableMouseMove);
      document.addEventListener("mouseup", handleTableMouseUp);

      onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleTableMouseMove);
        document.removeEventListener("mouseup", handleTableMouseUp);
      });
    }
  });

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Seating Chart</h2>
        <div class="flex space-x-2">
          <Show when={currentView() === "custom" && props.tables.length > 0}>
            <button
              onClick={resetToFormations}
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
            >
              Change Layout
            </button>
          </Show>
          <Show when={currentView() === "custom"}>
            <button
              onClick={() => setShowAddTableForm(!showAddTableForm())}
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
            >
              {showAddTableForm() ? "Cancel" : "Add Table"}
            </button>
          </Show>
        </div>
      </div>

      {/* Formation Selection View */}
      <Show when={currentView() === "formations" && props.tables.length === 0}>
        <div class="space-y-6">
          {/* Guest Count Info */}
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-blue-900 mb-1">
                  👥 Total Attendees: {totalAttendees()}
                </h3>
                <p class="text-sm text-blue-700">
                  Choose a seating formation that fits your guest count
                </p>
              </div>
              <Show when={totalAttendees() > 0}>
                <div class="text-right">
                  <div class="text-sm text-blue-600">Recommended:</div>
                  <div class="font-semibold text-blue-800">
                    {getRecommendedFormation().name}
                  </div>
                </div>
              </Show>
            </div>
          </div>

          {/* Formation Cards */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={tableFormations}>
              {(formation) => {
                const isRecommended =
                  formation.id === getRecommendedFormation().id;
                const isViable =
                  totalAttendees() >= formation.minGuests &&
                  totalAttendees() <= formation.maxGuests;

                return (
                  <div
                    class={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isRecommended
                        ? "border-green-300 bg-green-50 hover:border-green-400"
                        : isViable
                        ? "border-purple-300 bg-purple-50 hover:border-purple-400"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 opacity-75"
                    }`}
                    onClick={() => handleFormationSelect(formation)}
                  >
                    {isRecommended && (
                      <div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Recommended
                      </div>
                    )}

                    <div class="text-center mb-4">
                      <div class="text-4xl mb-2">{formation.icon}</div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">
                        {formation.name}
                      </h3>
                      <p class="text-sm text-gray-600 mb-3">
                        {formation.description}
                      </p>
                    </div>

                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Tables:</span>
                        <span class="font-medium">
                          {formation.tables.length}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Total Seats:</span>
                        <span class="font-medium">
                          {formation.tables.reduce(
                            (sum, table) => sum + table.seats,
                            0
                          )}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Guest Range:</span>
                        <span class="font-medium">
                          {formation.minGuests}-{formation.maxGuests}
                        </span>
                      </div>
                    </div>

                    <Show when={!isViable && totalAttendees() > 0}>
                      <div class="mt-3 text-xs text-red-600 font-medium">
                        {totalAttendees() < formation.minGuests
                          ? `Need ${
                              formation.minGuests - totalAttendees()
                            } more guests`
                          : `Exceeds capacity by ${
                              totalAttendees() - formation.maxGuests
                            } guests`}
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>

          {/* Custom Option */}
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
            onClick={() => setCurrentView("custom")}
          >
            <div class="text-4xl mb-3">🛠️</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Custom Layout
            </h3>
            <p class="text-gray-600">
              Create your own unique seating arrangement from scratch
            </p>
          </div>
        </div>
      </Show>

      {/* Formation Customizer Modal */}
      <Show when={showFormationCustomizer() && selectedFormation()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-gray-900">
                  {selectedFormation()?.icon} {selectedFormation()?.name}
                </h3>
                <button
                  onClick={() => setShowFormationCustomizer(false)}
                  class="text-gray-400 hover:text-gray-600 p-1"
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
                    ></path>
                  </svg>
                </button>
              </div>

              <div class="space-y-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-3">
                    Adjust Guest Count
                  </h4>
                  <div class="flex items-center space-x-4">
                    <label class="text-sm font-medium text-gray-700">
                      Total Expected Guests:
                    </label>
                    <input
                      type="number"
                      min={selectedFormation()?.minGuests}
                      max={selectedFormation()?.maxGuests}
                      value={totalGuestsInput()}
                      onInput={(e) =>
                        setTotalGuestsInput(
                          parseInt((e.target as HTMLInputElement).value) || 0
                        )
                      }
                      class="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span class="text-sm text-gray-500">
                      (Range: {selectedFormation()?.minGuests}-
                      {selectedFormation()?.maxGuests})
                    </span>
                  </div>
                </div>

                <div>
                  <h4 class="font-semibold text-gray-900 mb-3">
                    Table Overview
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <For each={selectedFormation()?.tables}>
                      {(table, index) => (
                        <div class="border border-gray-200 rounded-lg p-3">
                          <div class="flex justify-between items-center">
                            <span class="font-medium text-gray-900">
                              {table.name}
                            </span>
                            <span class="text-sm text-gray-600">
                              {table.seats} seats • {table.shape}
                            </span>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-900 mb-2">
                    Formation Summary
                  </h4>
                  <div class="text-sm text-blue-800">
                    <div>
                      Total Tables: {selectedFormation()?.tables.length}
                    </div>
                    <div>
                      Total Seats:{" "}
                      {selectedFormation()?.tables.reduce(
                        (sum, table) => sum + table.seats,
                        0
                      )}
                    </div>
                    <div>Expected Guests: {totalGuestsInput()}</div>
                  </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowFormationCustomizer(false)}
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFormation}
                    class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
                  >
                    Apply Formation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Custom View - Show when there are tables or in custom mode */}
      <Show when={currentView() === "custom" || props.tables.length > 0}>
        {/* Venue Layout Preview */}
        <Show when={props.tables.length > 0}>
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="text-2xl mr-2">🏛️</span>
              Venue Layout Preview
            </h3>

            <div
              class="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 relative overflow-hidden"
              style="min-height: 400px;"
              data-preview-container
            >
              {/* Tables Layout */}
              <div class="absolute inset-0 w-full h-full">
                <For each={props.tables}>
                  {(table) => {
                    const isHeadTable = table.name
                      .toLowerCase()
                      .includes("head");
                    const occupiedSeats = table.seats.filter(
                      (seat) => seat.guestId
                    ).length;
                    const occupancyPercentage =
                      (occupiedSeats / table.seats.length) * 100;
                    const position = tablePositions()[table.id] || {
                      x: 50,
                      y: 100,
                    };
                    const isDraggedNow =
                      isDraggingTable() && draggedTable()?.id === table.id;

                    return (
                      <div
                        class={`absolute transition-all duration-200 cursor-move select-none ${
                          isDraggedNow
                            ? "z-50 scale-110 shadow-lg"
                            : "z-10 hover:scale-105 hover:shadow-md"
                        }`}
                        style={`left: ${position.x}px; top: ${position.y}px; transform: translate(-50%, -50%);`}
                        onMouseDown={(e) => handleTableMouseDown(table, e)}
                      >
                        <div class="flex flex-col items-center space-y-1">
                          {/* Table Shape */}
                          <div
                            class={`relative ${
                              table.shape === "round"
                                ? "w-16 h-16 rounded-full"
                                : "w-20 h-12 rounded-lg"
                            } border-2 transition-all duration-200 ${
                              isHeadTable
                                ? "bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400"
                                : occupancyPercentage === 100
                                ? "bg-gradient-to-br from-green-200 to-green-300 border-green-400"
                                : occupancyPercentage > 0
                                ? "bg-gradient-to-br from-blue-200 to-blue-300 border-blue-400"
                                : "bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400"
                            } flex items-center justify-center shadow-sm ${
                              isDraggedNow
                                ? "shadow-lg ring-2 ring-purple-300"
                                : ""
                            }`}
                            title={`${table.name}: ${occupiedSeats}/${table.seats.length} seats filled - Drag to rearrange`}
                          >
                            {/* Table Icon */}
                            <span class="text-lg pointer-events-none">
                              {isHeadTable
                                ? "👑"
                                : table.shape === "round"
                                ? "⭕"
                                : "⬜"}
                            </span>

                            {/* Occupancy Indicator */}
                            <Show when={occupiedSeats > 0}>
                              <div class="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold pointer-events-none">
                                {occupiedSeats}
                              </div>
                            </Show>
                          </div>

                          {/* Table Label */}
                          <div class="text-center pointer-events-none">
                            <div class="text-xs font-medium text-gray-800 truncate max-w-20">
                              {table.name}
                            </div>
                            <div class="text-xs text-gray-600">
                              {table.seats.length} seats
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </For>

                {/* Drop zone indicator when dragging */}
                <Show when={isDraggingTable()}>
                  <div class="absolute inset-4 border-2 border-dashed border-purple-400 bg-purple-50 bg-opacity-30 rounded-lg flex items-center justify-center pointer-events-none">
                    <div class="text-purple-600 font-medium text-sm">
                      🎯 Drop table anywhere in this area
                    </div>
                  </div>
                </Show>
              </div>

              {/* Legend */}
              <div class="absolute top-4 right-4 bg-white bg-opacity-90 border border-gray-300 rounded-lg p-3 text-xs space-y-1">
                <div class="font-semibold text-gray-800 mb-2">Legend:</div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-gradient-to-br from-yellow-200 to-yellow-300 border border-yellow-400 rounded"></div>
                  <span>Head Table</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-gradient-to-br from-green-200 to-green-300 border border-green-400 rounded"></div>
                  <span>Fully Occupied</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-gradient-to-br from-blue-200 to-blue-300 border border-blue-400 rounded"></div>
                  <span>Partially Filled</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-gradient-to-br from-gray-200 to-gray-300 border border-gray-400 rounded"></div>
                  <span>Empty</span>
                </div>
              </div>
            </div>

            {/* Preview Stats */}
            <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div class="bg-white rounded-lg p-3 text-center border border-purple-200">
                <div class="font-semibold text-purple-600">
                  {props.tables.length}
                </div>
                <div class="text-gray-600">Total Tables</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center border border-purple-200">
                <div class="font-semibold text-purple-600">
                  {stats().totalSeats}
                </div>
                <div class="text-gray-600">Total Seats</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center border border-purple-200">
                <div class="font-semibold text-purple-600">
                  {Math.round(
                    (stats().occupiedSeats / stats().totalSeats) * 100
                  ) || 0}
                  %
                </div>
                <div class="text-gray-600">Occupied</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center border border-purple-200">
                <div class="font-semibold text-purple-600">
                  {stats().unseatedGuests}
                </div>
                <div class="text-gray-600">Unseated</div>
              </div>
            </div>

            <p class="text-xs text-gray-600 mt-3 text-center">
              💡 This preview shows how your tables would be arranged in the
              venue. Drag tables to rearrange them, then scroll down to assign
              specific guests to seats.
            </p>
          </div>
        </Show>

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
              Drag attendees to available seats on tables. Plus ones are shown
              in orange.
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

        {/* Empty state for custom view */}
        <Show when={props.tables.length === 0 && currentView() === "custom"}>
          <div class="text-center py-12 text-gray-500">
            <div class="text-4xl mb-4">🪑</div>
            <p class="text-lg font-medium mb-2">No tables created yet</p>
            <p>
              Add your first table to start planning the seating arrangement!
            </p>
            <button
              onClick={() => setCurrentView("formations")}
              class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
            >
              Choose a Formation Instead
            </button>
          </div>
        </Show>

        {/* Floating drag preview */}
        {isDragging() && draggedGuest() && (
          <div
            class="fixed pointer-events-none z-50 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={`left: ${dragPosition().x}px; top: ${dragPosition().y}px;`}
          >
            {draggedGuest()!.name}
          </div>
        )}
      </Show>
    </div>
  );
};

export default SeatingChart;

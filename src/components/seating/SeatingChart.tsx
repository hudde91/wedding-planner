import { createSignal, Component, For, Show, createMemo } from "solid-js";
import { Table, Guest, TableShape, SeatAssignment } from "../../types";
import {
  generateId,
  getInitials,
  isValidNumber,
  pluralize,
  sanitizeInput,
  truncateText,
} from "../../utils/validation";
import { getUnassignedAttendees } from "../../utils/guest";

interface SeatingChartProps {
  tables: Table[];
  guests: Guest[];
  onUpdateTables: (tables: Table[]) => void;
}

interface TableFormData {
  name: string;
  capacity: number;
  shape: TableShape;
}

const SeatingChart: Component<SeatingChartProps> = (props) => {
  const [selectedGuestId, setSelectedGuestId] = createSignal<string | null>(
    null
  );
  const [selectedTableId, setSelectedTableId] = createSignal<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = createSignal<1 | 2 | 3>(1);
  const [showTableForm, setShowTableForm] = createSignal(false);
  const [editingTable, setEditingTable] = createSignal<Table | null>(null);
  const [viewingTableId, setViewingTableId] = createSignal<string | null>(null);
  const [isSaving, setIsSaving] = createSignal(false);
  const [tableForm, setTableForm] = createSignal<TableFormData>({
    name: "",
    capacity: 8,
    shape: "round",
  });

  // Get all seat assignments from table data (load from existing data)
  const seatAssignments = createMemo(() => {
    const assignments: SeatAssignment[] = [];
    props.tables.forEach((table) => {
      if (table.seatAssignments) {
        assignments.push(...table.seatAssignments);
      }
    });
    return assignments;
  });

  // Helper function to update tables with seat assignments and save automatically
  const updateTablesWithAssignments = async (
    newAssignments: SeatAssignment[]
  ) => {
    setIsSaving(true);

    const updatedTables = props.tables.map((table) => {
      const tableAssignments = newAssignments.filter(
        (a) => a.tableId === table.id
      );
      return {
        ...table,
        seatAssignments: tableAssignments,
        assigned_guests: tableAssignments.map((a) => a.guestId), // Keep compatibility with existing structure
      };
    });

    // Automatically save to database
    props.onUpdateTables(updatedTables);

    // Show saved indicator briefly
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Get all attending guests (main guests + plus ones as separate entities)
  const allAttendees = createMemo(() => {
    const assignedIds = seatAssignments().map((a) => a.guestId);
    return getUnassignedAttendees(props.guests, assignedIds);
  });
  // Get unassigned attendees
  const unassignedAttendees = createMemo(() => {
    const assignedIds = new Set(seatAssignments().map((a) => a.guestId));
    return allAttendees().filter((attendee) => !assignedIds.has(attendee.id));
  });

  // Get available tables (tables with at least one empty seat)
  const availableTables = createMemo(() => {
    return props.tables.filter((table) => {
      const assignedSeats = seatAssignments().filter(
        (a) => a.tableId === table.id
      ).length;
      return assignedSeats < table.capacity;
    });
  });

  // Get occupied seats for a specific table
  const getOccupiedSeats = (tableId: string) => {
    return seatAssignments().filter((a) => a.tableId === tableId);
  };

  const handleGuestSelect = (guestId: string) => {
    setSelectedGuestId(guestId);
    setSelectedTableId(null);
    setCurrentStep(2);
  };

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setCurrentStep(3);
  };

  const handleSeatSelect = (seatNumber: number) => {
    const guestId = selectedGuestId();
    const tableId = selectedTableId();

    if (!guestId || !tableId) return;

    const guest = allAttendees().find((a) => a.id === guestId);
    if (!guest) return;

    // Create new seat assignment
    const newAssignment: SeatAssignment = {
      tableId,
      seatNumber,
      guestId,
      guestName: guest.name,
    };

    // Add to existing assignments and save automatically
    const updatedAssignments = [...seatAssignments(), newAssignment];
    updateTablesWithAssignments(updatedAssignments);

    // Reset selections
    setSelectedGuestId(null);
    setSelectedTableId(null);
    setCurrentStep(1);
  };

  const handleRemoveAssignment = (guestId: string) => {
    // Remove assignment and save automatically
    const updatedAssignments = seatAssignments().filter(
      (a) => a.guestId !== guestId
    );
    updateTablesWithAssignments(updatedAssignments);
  };

  const resetSelection = () => {
    setSelectedGuestId(null);
    setSelectedTableId(null);
    setCurrentStep(1);
  };

  // Table Management Functions
  const handleAddTable = () => {
    const form = tableForm();
    if (!form.name.trim()) return;

    const newTable: Table = {
      id: generateId(),
      name: form.name.trim(),
      capacity: form.capacity,
      shape: form.shape,
      assigned_guests: [],
      seatAssignments: [],
    };

    props.onUpdateTables([...props.tables, newTable]);

    setTableForm({ name: "", capacity: 8, shape: "round" });
    setShowTableForm(false);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setTableForm({
      name: table.name,
      capacity: table.capacity,
      shape: table.shape || "round",
    });
    setShowTableForm(true);
  };

  // Automatic table update function - triggers on any form field change
  const handleAutoUpdateTable = (
    field: keyof TableFormData,
    value: string | number | TableShape
  ) => {
    const editing = editingTable();
    if (!editing) return;

    // Update the form state
    const updatedForm = { ...tableForm(), [field]: value };
    setTableForm(updatedForm);

    // Don't save if name is empty
    if (field === "name" && typeof value === "string" && !value.trim()) {
      return;
    }

    // Apply the update immediately to database
    const updatedTables = props.tables.map((table) =>
      table.id === editing.id
        ? {
            ...table,
            name:
              typeof updatedForm.name === "string"
                ? updatedForm.name.trim()
                : updatedForm.name,
            capacity: updatedForm.capacity,
            shape: updatedForm.shape,
          }
        : table
    );

    // Remove seat assignments that exceed new capacity when capacity is reduced
    const updatedAssignments = seatAssignments().filter(
      (assignment) =>
        assignment.tableId !== editing.id ||
        assignment.seatNumber <= updatedForm.capacity
    );

    // Update tables with valid assignments
    const finalTables = updatedTables.map((table) => {
      const tableAssignments = updatedAssignments.filter(
        (a) => a.tableId === table.id
      );
      return {
        ...table,
        seatAssignments: tableAssignments,
        assigned_guests: tableAssignments.map((a) => a.guestId),
      };
    });

    props.onUpdateTables(finalTables);
  };

  const handleDeleteTable = (tableId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this table? All seat assignments will be removed."
      )
    ) {
      // Remove table and its seat assignments, then save automatically
      const updatedTables = props.tables.filter(
        (table) => table.id !== tableId
      );
      const updatedAssignments = seatAssignments().filter(
        (a) => a.tableId !== tableId
      );

      // Update tables with remaining assignments
      const finalTables = updatedTables.map((table) => {
        const tableAssignments = updatedAssignments.filter(
          (a) => a.tableId === table.id
        );
        return {
          ...table,
          seatAssignments: tableAssignments,
          assigned_guests: tableAssignments.map((a) => a.guestId),
        };
      });

      props.onUpdateTables(finalTables);

      if (selectedTableId() === tableId) {
        resetSelection();
      }
      if (viewingTableId() === tableId) {
        setViewingTableId(null);
      }
    }
  };

  const handleCancelTableForm = () => {
    setTableForm({ name: "", capacity: 8, shape: "round" });
    setEditingTable(null);
    setShowTableForm(false);
  };

  const handleViewTable = (tableId: string) => {
    setViewingTableId(viewingTableId() === tableId ? null : tableId);
  };

  // Seat positioning logic for different table shapes
  const getSeatPosition = (
    seatNumber: number,
    totalSeats: number,
    shape: TableShape
  ) => {
    if (shape === "rectangular") {
      // Rectangular table logic with FIXED centering
      const dotsPerSide = Math.ceil(totalSeats / 2);
      const remainingDots = totalSeats - dotsPerSide;
      const minWidth = 200;
      const maxWidth = 500;
      const seatSpacing = 40;
      const maxSeatsOnSide = Math.max(dotsPerSide, remainingDots);

      const calculatedWidth = Math.max(
        minWidth,
        (maxSeatsOnSide + 1) * seatSpacing
      );
      const tableWidth = Math.min(maxWidth, calculatedWidth);
      const baseHeight = 80;
      const tableHeight = Math.max(baseHeight, Math.min(150, tableWidth * 0.3));
      const seatOffset = 30;

      // FIXED: Use static center coordinates (like before)
      const centerX = 140;
      const centerY = 140;

      if (seatNumber <= dotsPerSide) {
        const topSpacing = tableWidth / (dotsPerSide + 1);
        const x = centerX - tableWidth / 2 + topSpacing * seatNumber;
        const y = centerY - tableHeight / 2 - seatOffset;
        return { x, y, tableWidth, tableHeight };
      } else {
        const bottomIndex = seatNumber - dotsPerSide;
        const bottomSpacing = tableWidth / (remainingDots + 1);
        const x = centerX - tableWidth / 2 + bottomSpacing * bottomIndex;
        const y = centerY + tableHeight / 2 + seatOffset;
        return { x, y, tableWidth, tableHeight };
      }
    } else {
      // Round table - dynamic radius calculation
      const minRadius = 80; // Minimum radius for small tables
      const maxRadius = 180; // Maximum radius for large tables
      const minSeatSpacing = 50; // Minimum arc length between seats (in pixels)

      // Calculate required radius to maintain minimum spacing
      const requiredRadius = (minSeatSpacing * totalSeats) / (2 * Math.PI);
      const radius = Math.max(minRadius, Math.min(maxRadius, requiredRadius));

      // Calculate table circle diameter for visual representation
      const tableRadius = Math.max(60, radius * 0.6); // Table is smaller than seat radius

      // Center point for the round table layout
      const centerX = 140;
      const centerY = 140;

      // Calculate seat positions around the circle
      const angleStep = (2 * Math.PI) / totalSeats;
      const angle = (seatNumber - 1) * angleStep - Math.PI / 2; // Start from top (12 o'clock)

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return { x, y, radius, tableRadius };
    }
  };

  const getTableDimensions = (totalSeats: number, shape: TableShape) => {
    if (totalSeats === 0)
      return { width: 200, height: 80, radius: 80, tableRadius: 60 };

    const firstSeatPos = getSeatPosition(1, totalSeats, shape);

    if (shape === "rectangular") {
      return {
        width: firstSeatPos.tableWidth || 200,
        height: firstSeatPos.tableHeight || 80,
        radius: 0,
        tableRadius: 0,
      };
    } else {
      return {
        width: 0,
        height: 0,
        radius: firstSeatPos.radius || 80,
        tableRadius: firstSeatPos.tableRadius || 60,
      };
    }
  };

  const selectedGuest = createMemo(() => {
    const id = selectedGuestId();
    return id ? allAttendees().find((a) => a.id === id) : null;
  });

  const selectedTable = createMemo(() => {
    const id = selectedTableId();
    return id ? props.tables.find((t) => t.id === id) : null;
  });

  const viewingTable = createMemo(() => {
    const id = viewingTableId();
    return id ? props.tables.find((t) => t.id === id) : null;
  });

  const viewingTableSeatPositions = createMemo(() => {
    const table = viewingTable();
    if (!table) return [];

    return Array.from({ length: table.capacity }, (_, i) => {
      const seatNumber = i + 1;
      return {
        seatNumber,
        position: getSeatPosition(
          seatNumber,
          table.capacity,
          table.shape || "round"
        ),
      };
    });
  });

  const selectedTableSeatPositions = createMemo(() => {
    const table = selectedTable();
    if (!table) return [];

    return Array.from({ length: table.capacity }, (_, i) => {
      const seatNumber = i + 1;
      return {
        seatNumber,
        position: getSeatPosition(
          seatNumber,
          table.capacity,
          table.shape || "round"
        ),
      };
    });
  });

  const viewingTableDimensions = createMemo(() =>
    getTableDimensions(
      viewingTable()?.capacity || 0,
      viewingTable()?.shape || "round"
    )
  );

  const selectedTableDimensions = createMemo(() =>
    getTableDimensions(
      selectedTable()?.capacity || 0,
      selectedTable()?.shape || "round"
    )
  );

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div class="max-w-7xl mx-auto p-8">
        {/* Elegant Header */}
        <div class="text-center mb-12 relative">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl shadow-xl mb-6">
            <svg
              class="w-10 h-10 text-white"
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
          <h1 class="text-5xl font-light text-gray-800 mb-4 tracking-wide">
            Seating Arrangements
          </h1>
          <p class="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Create the perfect seating plan with our elegant three-step process
          </p>

          {/* Auto-save indicator */}
          <Show when={isSaving()}>
            <div class="absolute top-0 right-0 flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full shadow-lg animate-pulse">
              <svg
                class="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="text-sm font-medium">Saving...</span>
            </div>
          </Show>
        </div>

        {/* Progress Steps */}
        <div class="flex justify-center mb-12">
          <div class="flex items-center space-x-8">
            <div
              class={`flex items-center space-x-3 ${
                currentStep() >= 1 ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                class={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  currentStep() >= 1
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <span class="font-medium">Select Guest</span>
            </div>

            <div
              class={`w-16 h-0.5 ${
                currentStep() >= 2 ? "bg-purple-600" : "bg-gray-300"
              }`}
            ></div>

            <div
              class={`flex items-center space-x-3 ${
                currentStep() >= 2 ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                class={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  currentStep() >= 2
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span class="font-medium">Choose Table</span>
            </div>

            <div
              class={`w-16 h-0.5 ${
                currentStep() >= 3 ? "bg-purple-600" : "bg-gray-300"
              }`}
            ></div>

            <div
              class={`flex items-center space-x-3 ${
                currentStep() >= 3 ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                class={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  currentStep() >= 3
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <span class="font-medium">Pick Seat</span>
            </div>
          </div>
        </div>

        {/* Table Management Section */}
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">
                  Table Management
                </h2>
                <p class="text-gray-600 font-light">
                  {pluralize(props.tables.length, "table")} configured
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTableForm(true)}
              class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Add Table
            </button>
          </div>

          {/* Table Form */}
          <Show when={showTableForm()}>
            <div class="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl p-6 border border-indigo-200/50 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  {editingTable() ? "Edit Table" : "Add New Table"}
                </h3>
                <Show when={editingTable()}>
                  <div class="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
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
                    <span class="text-sm font-medium">Auto-saving changes</span>
                  </div>
                </Show>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Table Name
                  </label>
                  <input
                    type="text"
                    value={tableForm().name}
                    onInput={(e) => {
                      const value = sanitizeInput(
                        (e.target as HTMLInputElement).value
                      );
                      if (editingTable()) {
                        handleAutoUpdateTable("name", value);
                      } else {
                        setTableForm((prev) => ({ ...prev, name: value }));
                      }
                    }}
                    placeholder="e.g., Head Table, Family Table"
                    class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={tableForm().capacity}
                    onInput={(e) => {
                      const inputValue = (e.target as HTMLInputElement).value;
                      if (isValidNumber(inputValue)) {
                        const value = Number(inputValue);
                        if (editingTable()) {
                          handleAutoUpdateTable("capacity", value);
                        } else {
                          setTableForm((prev) => ({
                            ...prev,
                            capacity: value,
                          }));
                        }
                      }
                    }}
                    class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
                  />
                  <Show when={editingTable()}>
                    <p class="text-xs text-amber-600 mt-1">
                      ⚠️ Reducing capacity will remove excess seat assignments
                    </p>
                  </Show>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Shape
                  </label>
                  <select
                    value={tableForm().shape}
                    onChange={(e) => {
                      const value = (e.target as HTMLSelectElement)
                        .value as TableShape;
                      if (editingTable()) {
                        handleAutoUpdateTable("shape", value);
                      } else {
                        setTableForm((prev) => ({ ...prev, shape: value }));
                      }
                    }}
                    class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
                  >
                    <option value="round">Round</option>
                    <option value="rectangular">Rectangular</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">
                    {tableForm().shape === "rectangular"
                      ? "Seats only on long sides"
                      : "Seats arranged in circle"}
                  </p>
                </div>
              </div>
              <div class="flex space-x-3 mt-6">
                <Show
                  when={!editingTable()}
                  fallback={
                    <button
                      onClick={handleCancelTableForm}
                      class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                    >
                      Done Editing
                    </button>
                  }
                >
                  <button
                    onClick={handleAddTable}
                    disabled={!tableForm().name.trim()}
                    class={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      tableForm().name.trim()
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Create Table
                  </button>
                  <button
                    onClick={handleCancelTableForm}
                    class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                  >
                    Cancel
                  </button>
                </Show>
              </div>
            </div>
          </Show>

          {/* Existing Tables List */}
          <Show when={props.tables.length > 0}>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <For each={props.tables}>
                {(table) => {
                  const occupiedSeats = getOccupiedSeats(table.id);
                  const availableSeats = table.capacity - occupiedSeats.length;

                  return (
                    <div
                      class={`bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-4 border transition-all duration-300 cursor-pointer ${
                        viewingTableId() === table.id
                          ? "border-purple-300 shadow-lg ring-2 ring-purple-100"
                          : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                      }`}
                      onClick={() => handleViewTable(table.id)}
                    >
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-3">
                          <div
                            class={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md ${
                              (table.shape || "round") === "rectangular"
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            }`}
                          >
                            {(table.shape || "round") === "rectangular" ? (
                              <svg
                                class="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <rect
                                  x="2"
                                  y="6"
                                  width="20"
                                  height="12"
                                  rx="2"
                                  ry="2"
                                  stroke="currentColor"
                                  stroke-width="1.5"
                                  fill="none"
                                />
                                <path
                                  d="M2 8h20M2 16h20"
                                  stroke="currentColor"
                                  stroke-width="1.5"
                                />
                              </svg>
                            ) : (
                              <svg
                                class="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="9"
                                  stroke="currentColor"
                                  stroke-width="1.5"
                                  fill="none"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="6"
                                  stroke="currentColor"
                                  stroke-width="1"
                                  opacity="0.5"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 class="font-semibold text-gray-900">
                              {table.name}
                            </h4>
                            <p class="text-sm text-gray-600">
                              {(table.shape || "round") === "rectangular"
                                ? "Rectangular"
                                : "Round"}{" "}
                              • {availableSeats}/{table.capacity} available
                            </p>
                          </div>
                        </div>
                        <div class="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTable(table);
                            }}
                            class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-300"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTable(table.id);
                            }}
                            class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300"
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
                        </div>
                      </div>

                      {/* Mini table preview */}
                      <Show when={occupiedSeats.length > 0}>
                        <div class="text-xs text-gray-500 space-y-1">
                          <For each={occupiedSeats.slice(0, 3)}>
                            {(assignment) => (
                              <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                                  {assignment.seatNumber}
                                </div>
                                <span>
                                  {truncateText(assignment.guestName, 20)}
                                </span>
                              </div>
                            )}
                          </For>
                          <Show when={occupiedSeats.length > 3}>
                            <div class="text-gray-400">
                              +{occupiedSeats.length - 3} more...
                            </div>
                          </Show>
                        </div>
                      </Show>

                      {/* Click hint */}
                      <div class="mt-3 pt-3 border-t border-gray-100">
                        <p class="text-xs text-gray-400 text-center">
                          {viewingTableId() === table.id
                            ? "Click to close view"
                            : "Click to view table layout"}
                        </p>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>

        {/* Table Viewing Section */}
        <Show when={viewingTable()}>
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden mb-8">
            <div class="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                      (viewingTable()?.shape || "round") === "rectangular"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    }`}
                  >
                    {(viewingTable()?.shape || "round") === "rectangular" ? (
                      <svg
                        class="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="2"
                          y="6"
                          width="20"
                          height="12"
                          rx="2"
                          ry="2"
                          stroke="currentColor"
                          stroke-width="1.5"
                          fill="none"
                        />
                        <path
                          d="M2 8h20M2 16h20"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        class="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          stroke-width="1.5"
                          fill="none"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="6"
                          stroke="currentColor"
                          stroke-width="1"
                          opacity="0.5"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 class="text-2xl font-semibold text-gray-900">
                      {viewingTable()?.name}
                    </h3>
                    <p class="text-gray-600 font-light">
                      {(viewingTable()?.shape || "round") === "rectangular"
                        ? "Rectangular"
                        : "Round"}{" "}
                      table •{getOccupiedSeats(viewingTableId()!).length}/
                      {viewingTable()?.capacity} seats occupied
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingTableId(null)}
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                  title="Close view"
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

            <div class="p-8">
              <div class="relative w-96 h-96 mx-auto">
                {/* Table Surface */}
                <Show
                  when={(viewingTable()?.shape || "round") === "rectangular"}
                  fallback={
                    // Round table
                    <div
                      class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-full border-4 border-amber-200 shadow-xl"
                      style={`left: ${
                        140 - viewingTableDimensions().tableRadius
                      }px; top: ${
                        140 - viewingTableDimensions().tableRadius
                      }px; width: ${
                        viewingTableDimensions().tableRadius * 2
                      }px; height: ${
                        viewingTableDimensions().tableRadius * 2
                      }px;`}
                    >
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-center">
                          <div class="text-2xl font-bold text-amber-800">
                            {viewingTable()?.name}
                          </div>
                          <div class="text-sm text-amber-700 mt-1">
                            Round Table • {viewingTable()?.capacity} seats
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  {/* Rectangular table */}
                  <div
                    class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border-4 border-amber-200 shadow-xl"
                    style={`left: ${
                      140 - viewingTableDimensions().width / 2
                    }px; top: ${
                      140 - viewingTableDimensions().height / 2
                    }px; width: ${viewingTableDimensions().width}px; height: ${
                      viewingTableDimensions().height
                    }px;`}
                  >
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="text-center">
                        <div class="text-xl font-bold text-amber-800">
                          {viewingTable()?.name}
                        </div>
                        <div class="text-xs text-amber-700 mt-1">
                          Rectangular • {viewingTable()?.capacity} seats
                        </div>
                      </div>
                    </div>
                  </div>
                </Show>

                {/* Seats arranged based on table shape */}
                <For each={viewingTableSeatPositions()}>
                  {(seatData) => {
                    const occupiedBy = getOccupiedSeats(viewingTableId()!).find(
                      (a) => a.seatNumber === seatData.seatNumber
                    );
                    const isOccupied = !!occupiedBy;

                    return (
                      <div
                        class={`absolute w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center text-sm font-bold shadow-lg ${
                          isOccupied
                            ? "bg-gradient-to-br from-purple-400 to-violet-500 text-white"
                            : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                        }`}
                        style={`left: ${seatData.position.x - 28}px; top: ${
                          seatData.position.y - 28
                        }px;`}
                        title={
                          isOccupied
                            ? `Seat ${seatData.seatNumber} - ${occupiedBy?.guestName}`
                            : `Seat ${seatData.seatNumber} - Available`
                        }
                      >
                        {isOccupied ? (
                          <svg
                            class="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        ) : (
                          seatData.seatNumber
                        )}
                      </div>
                    );
                  }}
                </For>
              </div>

              {/* Guest List for this table */}
              <div class="mt-8">
                <Show
                  when={getOccupiedSeats(viewingTableId()!).length > 0}
                  fallback={
                    <div class="text-center py-8">
                      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg
                          class="w-8 h-8 text-gray-400"
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
                      <p class="text-gray-600 font-light">
                        No guests seated at this table
                      </p>
                    </div>
                  }
                >
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">
                    Seated Guests
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <For
                      each={getOccupiedSeats(viewingTableId()!).sort(
                        (a, b) => a.seatNumber - b.seatNumber
                      )}
                    >
                      {(assignment) => (
                        <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg border border-purple-100/50">
                          <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            {assignment.seatNumber}
                          </div>
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">
                              {assignment.guestName}
                            </p>
                            <p class="text-purple-600 text-sm">
                              Seat {assignment.seatNumber}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveAssignment(assignment.guestId)
                            }
                            class="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                            title="Remove from seat"
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
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </Show>

        <Show when={selectedGuest()}>
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-xl p-6 mb-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-lg">
                    {getInitials(selectedGuest()?.name || "")}
                  </span>
                </div>
                <div>
                  <h3 class="text-2xl font-semibold text-gray-900">
                    {selectedGuest()?.name}
                  </h3>
                  <p class="text-purple-600 font-medium">
                    {selectedGuest()?.type === "main"
                      ? "Main Guest"
                      : "Plus One"}{" "}
                    •
                    <Show
                      when={!selectedTable()}
                      fallback={` Table: ${selectedTable()?.name}`}
                    >
                      {` Step ${currentStep()}: ${
                        currentStep() === 2
                          ? "Select a table"
                          : "Choose your seat"
                      }`}
                    </Show>
                  </p>
                </div>
              </div>
              <button
                onClick={resetSelection}
                class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium"
              >
                Start Over
              </button>
            </div>
          </div>
        </Show>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step 1: Guest Selection */}
          <div
            class={`${
              currentStep() === 1 ? "lg:col-span-2" : "lg:col-span-1"
            } transition-all duration-500`}
          >
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-6">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
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
                    <h3 class="text-xl font-semibold text-gray-900">
                      Available Guests
                    </h3>
                    <p class="text-gray-600 font-light">
                      {pluralize(unassignedAttendees().length, "guest")}{" "}
                      awaiting seats
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <Show
                  when={unassignedAttendees().length > 0}
                  fallback={
                    <div class="text-center py-12">
                      <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg
                          class="w-8 h-8 text-emerald-600"
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
                        All guests have been seated!
                      </p>
                    </div>
                  }
                >
                  <div class="space-y-3 max-h-96 overflow-y-auto">
                    <For each={unassignedAttendees()}>
                      {(attendee) => (
                        <button
                          onClick={() => handleGuestSelect(attendee.id)}
                          class={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] border ${
                            selectedGuestId() === attendee.id
                              ? "bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 shadow-lg"
                              : "bg-gradient-to-r from-white to-gray-50/50 border-gray-200 hover:border-emerald-300 hover:shadow-md"
                          }`}
                        >
                          <div class="flex items-center space-x-4">
                            <div
                              class={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                                selectedGuestId() === attendee.id
                                  ? "bg-gradient-to-br from-purple-500 to-violet-600"
                                  : attendee.type === "main"
                                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                  : "bg-gradient-to-br from-amber-500 to-orange-600"
                              }`}
                            >
                              {attendee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div class="flex-1">
                              <h4 class="font-semibold text-gray-900">
                                {attendee.name}
                              </h4>
                              <p
                                class={`text-sm ${
                                  attendee.type === "main"
                                    ? "text-emerald-600"
                                    : "text-amber-600"
                                }`}
                              >
                                {attendee.type === "main"
                                  ? "Main Guest"
                                  : "Plus One"}
                              </p>
                            </div>
                            <Show when={selectedGuestId() === attendee.id}>
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
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </div>
          </div>

          {/* Step 2: Table Selection */}
          <Show when={currentStep() >= 2}>
            <div
              class={`${
                currentStep() === 2 ? "lg:col-span-2" : "lg:col-span-1"
              } transition-all duration-500`}
            >
              <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
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
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900">
                        Available Tables
                      </h3>
                      <p class="text-gray-600 font-light">
                        {pluralize(availableTables().length, "table")} with
                        space
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-6">
                  <Show
                    when={availableTables().length > 0}
                    fallback={
                      <div class="text-center py-12">
                        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg
                            class="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <p class="text-gray-600 font-light">
                          All tables are full!
                        </p>
                      </div>
                    }
                  >
                    <div class="space-y-4 max-h-96 overflow-y-auto">
                      <For each={availableTables()}>
                        {(table) => {
                          const occupiedSeats = getOccupiedSeats(table.id);
                          const availableSeats =
                            table.capacity - occupiedSeats.length;

                          return (
                            <button
                              onClick={() => handleTableSelect(table.id)}
                              class={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] border ${
                                selectedTableId() === table.id
                                  ? "bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 shadow-lg"
                                  : "bg-gradient-to-r from-white to-blue-50/30 border-blue-200 hover:border-blue-300 hover:shadow-md"
                              }`}
                            >
                              <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                  <div
                                    class={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                                      selectedTableId() === table.id
                                        ? "bg-gradient-to-br from-purple-500 to-violet-600"
                                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                                    }`}
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
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 class="font-semibold text-gray-900">
                                      {table.name}
                                    </h4>
                                    <p class="text-blue-600 text-sm">
                                      {pluralize(availableSeats, "seat")} of{" "}
                                      {table.capacity} available
                                    </p>
                                  </div>
                                </div>
                                <Show when={selectedTableId() === table.id}>
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
          </Show>

          {/* Step 3: Seat Selection */}
          <Show when={currentStep() === 3 && selectedTable()}>
            <div class="lg:col-span-2">
              <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div class="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 p-6">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
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
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900">
                        {truncateText(selectedTable()?.name || "", 15)}
                      </h3>
                      <p class="text-gray-600 font-light">
                        Choose a seat for {selectedGuest()?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-8">
                  <div class="relative w-96 h-96 mx-auto">
                    {/* Table Surface */}
                    <Show
                      when={
                        (selectedTable()?.shape || "round") === "rectangular"
                      }
                      fallback={
                        // Round table
                        <div
                          class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-full border-4 border-amber-200 shadow-xl"
                          style={`left: ${
                            140 - viewingTableDimensions().tableRadius
                          }px; top: ${
                            140 - viewingTableDimensions().tableRadius
                          }px; width: ${
                            viewingTableDimensions().tableRadius * 2
                          }px; height: ${
                            viewingTableDimensions().tableRadius * 2
                          }px;`}
                        >
                          <div class="w-full h-full flex items-center justify-center">
                            <div class="text-center">
                              <div class="text-2xl font-bold text-amber-800">
                                {selectedTable()?.name}
                              </div>
                              <div class="text-sm text-amber-700 mt-1">
                                Round Table • {selectedTable()?.capacity} seats
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    >
                      {/* Rectangular table */}
                      <div
                        class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border-4 border-amber-200 shadow-xl"
                        style={`left: ${
                          140 - selectedTableDimensions().width / 2
                        }px; top: ${
                          140 - selectedTableDimensions().height / 2
                        }px; width: ${
                          selectedTableDimensions().width
                        }px; height: ${selectedTableDimensions().height}px;`}
                      >
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="text-center">
                            <div class="text-xl font-bold text-amber-800">
                              {selectedTable()?.name}
                            </div>
                            <div class="text-xs text-amber-700 mt-1">
                              Rectangular • {selectedTable()?.capacity} seats
                            </div>
                          </div>
                        </div>
                      </div>
                    </Show>

                    {/* Seats arranged based on table shape */}
                    <For each={selectedTableSeatPositions()}>
                      {(seatData) => {
                        const occupiedBy = getOccupiedSeats(
                          selectedTableId()!
                        ).find((a) => a.seatNumber === seatData.seatNumber);
                        const isAvailable = !occupiedBy;

                        return (
                          <button
                            class={`absolute w-14 h-14 rounded-full transition-all duration-300 transform flex items-center justify-center text-sm font-bold shadow-lg ${
                              isAvailable
                                ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white hover:scale-110 hover:shadow-xl cursor-pointer"
                                : "bg-gradient-to-br from-gray-400 to-gray-500 text-white cursor-not-allowed"
                            }`}
                            style={`left: ${seatData.position.x - 28}px; top: ${
                              seatData.position.y - 28
                            }px;`}
                            onClick={() =>
                              isAvailable &&
                              handleSeatSelect(seatData.seatNumber)
                            }
                            disabled={!isAvailable}
                            title={
                              isAvailable
                                ? `Seat ${seatData.seatNumber} - Available`
                                : `Seat ${seatData.seatNumber} - ${occupiedBy?.guestName}`
                            }
                          >
                            {isAvailable ? (
                              seatData.seatNumber
                            ) : (
                              <svg
                                class="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
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
                      <span class="text-sm text-gray-600">Available</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full"></div>
                      <span class="text-sm text-gray-600">Occupied</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div
                        class={`w-4 h-4 rounded ${
                          (selectedTable()?.shape || "round") === "rectangular"
                            ? "bg-emerald-200"
                            : "bg-orange-200"
                        }`}
                      ></div>
                      <span class="text-sm text-gray-600">
                        {(selectedTable()?.shape || "round") === "rectangular"
                          ? "Rectangular Table"
                          : "Round Table"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default SeatingChart;

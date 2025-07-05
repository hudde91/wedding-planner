import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  Show,
} from "solid-js";
import { Table, Guest, SeatAssignment, TableShape } from "../../types";
import { getUnassignedAttendees } from "../../utils/guest";
import { generateId, pluralize } from "../../utils/validation";

import SeatingSteps from "./SeatingSteps";
import TableSelection from "./TableSelection";
import TableAssignment from "./TableAssignment";
import SeatingOverview from "./SeatingOverview";

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
  // State management
  const [selectedTableId, setSelectedTableId] = createSignal<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = createSignal<1 | 2>(1);
  const [isSaving, setIsSaving] = createSignal(false);
  const [overviewExpanded, setOverviewExpanded] = createSignal(false);

  // Table management state
  const [showTableForm, setShowTableForm] = createSignal(false);
  const [editingTable, setEditingTable] = createSignal<Table | null>(null);
  const [tableFormData, setTableFormData] = createSignal<TableFormData>({
    name: "",
    capacity: 8,
    shape: "round",
  });

  // Get all seat assignments from table data
  const seatAssignments = createMemo(() => {
    const assignments: SeatAssignment[] = [];
    props.tables.forEach((table) => {
      if (table.seatAssignments) {
        assignments.push(...table.seatAssignments);
      }
    });
    return assignments;
  });

  // Check if all guests are seated
  const allGuestsSeated = createMemo(() => {
    const assignedIds = seatAssignments().map((a) => a.guestId);
    const unassigned = getUnassignedAttendees(props.guests, assignedIds);
    return unassigned.length === 0;
  });

  // Auto-expand overview when all guests are seated
  createEffect(() => {
    if (allGuestsSeated()) {
      setOverviewExpanded(true);
    }
  });

  // Get unassigned attendees
  const unassignedAttendees = createMemo(() => {
    const assignedIds = seatAssignments().map((a) => a.guestId);
    return getUnassignedAttendees(props.guests, assignedIds);
  });

  // Get selected table
  const selectedTable = createMemo(() => {
    const id = selectedTableId();
    return id ? props.tables.find((t) => t.id === id) : null;
  });

  // Table management functions
  const handleAddTable = (presetData?: { name: string; capacity: number }) => {
    if (presetData) {
      // Quick add from preset
      const newTable: Table = {
        id: generateId(),
        name: presetData.name,
        capacity: presetData.capacity,
        shape: "round",
        assigned_guests: [],
        seatAssignments: [],
      };
      props.onUpdateTables([...props.tables, newTable]);
    } else {
      // Show form for custom table
      setTableFormData({ name: "", capacity: 8, shape: "round" });
      setEditingTable(null);
      setShowTableForm(true);
    }
  };

  const handleEditTable = (table: Table) => {
    setTableFormData({
      name: table.name,
      capacity: table.capacity,
      shape: table.shape || "round",
    });
    setEditingTable(table);
    setShowTableForm(true);
  };

  const handleSaveTable = () => {
    const formData = tableFormData();
    if (!formData.name.trim()) return;

    const editing = editingTable();

    if (editing) {
      // Update existing table
      const updatedTables = props.tables.map((table) => {
        if (table.id === editing.id) {
          // If capacity is reduced, remove excess assignments
          const validAssignments = (table.seatAssignments || []).filter(
            (assignment) => assignment.seatNumber <= formData.capacity
          );

          return {
            ...table,
            name: formData.name.trim(),
            capacity: formData.capacity,
            shape: formData.shape,
            seatAssignments: validAssignments,
            assigned_guests: validAssignments.map((a) => a.guestId),
          };
        }
        return table;
      });
      props.onUpdateTables(updatedTables);
    } else {
      // Create new table
      const newTable: Table = {
        id: generateId(),
        name: formData.name.trim(),
        capacity: formData.capacity,
        shape: formData.shape,
        assigned_guests: [],
        seatAssignments: [],
      };
      props.onUpdateTables([...props.tables, newTable]);
    }

    setShowTableForm(false);
    setEditingTable(null);
  };

  const handleDeleteTable = (tableId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this table? All seat assignments will be removed."
      )
    ) {
      const updatedTables = props.tables.filter(
        (table) => table.id !== tableId
      );
      props.onUpdateTables(updatedTables);

      if (selectedTableId() === tableId) {
        setSelectedTableId(null);
        setCurrentStep(1);
      }
    }
  };

  const handleCancelTableForm = () => {
    setShowTableForm(false);
    setEditingTable(null);
    setTableFormData({ name: "", capacity: 8, shape: "round" });
  };

  // Helper function to update tables with seat assignments
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
        assigned_guests: tableAssignments.map((a) => a.guestId),
      };
    });

    props.onUpdateTables(updatedTables);
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Event handlers
  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setCurrentStep(2);
    setOverviewExpanded(false);
  };

  const handleSeatAssign = (seatNumber: number, guestId: string) => {
    const tableId = selectedTableId();
    if (!tableId) return;

    const guest = unassignedAttendees().find((a) => a.id === guestId);
    if (!guest) return;

    const newAssignment: SeatAssignment = {
      tableId,
      seatNumber,
      guestId,
      guestName: guest.name,
    };

    const updatedAssignments = [...seatAssignments(), newAssignment];
    updateTablesWithAssignments(updatedAssignments);
  };

  const handleRemoveAssignment = (guestId: string) => {
    const updatedAssignments = seatAssignments().filter(
      (a) => a.guestId !== guestId
    );
    updateTablesWithAssignments(updatedAssignments);
  };

  const handleBackToTableSelection = () => {
    setSelectedTableId(null);
    setCurrentStep(1);
  };

  const handleViewTable = (tableId: string) => {
    setSelectedTableId(tableId);
    setCurrentStep(2);
    setOverviewExpanded(false);
  };

  const handleEditTableFromOverview = (tableId: string) => {
    const table = props.tables.find((t) => t.id === tableId);
    if (table) {
      handleEditTable(table);
    }
  };

  const handleBackToAssignment = () => {
    setOverviewExpanded(false);
    setSelectedTableId(null);
    setCurrentStep(1);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div class="max-w-7xl mx-auto mobile-px mobile-py">
        {/* Elegant Header */}
        <div class="animate-fade-in-up text-center mb-8 sm:mb-12 relative">
          <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl shadow-xl mb-4 sm:mb-6">
            <svg
              class="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-800 mb-3 sm:mb-4 tracking-wide">
            {allGuestsSeated()
              ? "Seating Plan Complete"
              : "Seating Arrangements"}
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            {allGuestsSeated()
              ? "Review and manage your finalized seating arrangements"
              : "Manage tables and assign guests to individual seats"}
          </p>

          {/* Mobile-optimized controls */}
          <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => handleAddTable()}
              class="btn-mobile px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <svg
                class="w-5 h-5 mr-2 inline"
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
              Add Table
            </button>

            <Show when={selectedTable()}>
              <button
                onClick={() => handleEditTable(selectedTable()!)}
                class="btn-mobile px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <svg
                  class="w-5 h-5 mr-2 inline"
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
                <span class="hidden sm:inline">Edit Table</span>
                <span class="sm:hidden">Edit</span>
              </button>

              <button
                onClick={() => handleDeleteTable(selectedTable()!.id)}
                class="btn-mobile px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <svg
                  class="w-5 h-5 mr-2 inline"
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
                <span class="hidden sm:inline">Delete Table</span>
                <span class="sm:hidden">Delete</span>
              </button>
            </Show>
          </div>

          {/* Auto-save indicator */}
          <Show when={isSaving()}>
            <div class="absolute top-0 right-0 flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3 py-2 rounded-full shadow-lg animate-pulse">
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

        {/* Mobile-optimized table form modal */}
        <Show when={showTableForm()}>
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-900">
                  {editingTable() ? "Edit Table" : "Add New Table"}
                </h3>
                <button
                  onClick={handleCancelTableForm}
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 touch-manipulation"
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

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Table Name
                  </label>
                  <input
                    type="text"
                    value={tableFormData().name}
                    onInput={(e) =>
                      setTableFormData((prev) => ({
                        ...prev,
                        name: (e.target as HTMLInputElement).value,
                      }))
                    }
                    placeholder="e.g., Head Table, Family Table"
                    class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 text-mobile-readable"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seats
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={tableFormData().capacity}
                    onInput={(e) =>
                      setTableFormData((prev) => ({
                        ...prev,
                        capacity:
                          Number((e.target as HTMLInputElement).value) || 8,
                      }))
                    }
                    class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 text-mobile-readable"
                  />
                  <Show when={editingTable()}>
                    <p class="text-xs text-amber-600 mt-1">
                      ⚠️ Reducing capacity will remove excess seat assignments
                    </p>
                  </Show>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Table Shape
                  </label>
                  <select
                    value={tableFormData().shape}
                    onChange={(e) =>
                      setTableFormData((prev) => ({
                        ...prev,
                        shape: (e.target as HTMLSelectElement)
                          .value as TableShape,
                      }))
                    }
                    class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 text-mobile-readable"
                  >
                    <option value="round">Round</option>
                    <option value="rectangular">Rectangular</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">
                    {tableFormData().shape === "rectangular"
                      ? "Seats only on long sides"
                      : "Seats arranged in circle"}
                  </p>
                </div>

                <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={handleSaveTable}
                    disabled={!tableFormData().name.trim()}
                    class={`btn-mobile flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      tableFormData().name.trim()
                        ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {editingTable() ? "Save Changes" : "Create Table"}
                  </button>
                  <button
                    onClick={handleCancelTableForm}
                    class="btn-mobile px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Show>

        {/* Quick Add Presets - Mobile optimized */}
        <Show when={!showTableForm() && props.tables.length === 0}>
          <div class="animate-fade-in-up-delay-200 mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8">
            <h4 class="text-lg font-medium text-gray-900 mb-4">
              Quick Add Common Tables
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Head Table",
                  capacity: 8,
                  description: "For the wedding party",
                },
                {
                  name: "Family Table",
                  capacity: 10,
                  description: "Close family members",
                },
                {
                  name: "Friends Table",
                  capacity: 8,
                  description: "College friends",
                },
              ].map((preset) => (
                <button
                  onClick={() =>
                    handleAddTable({
                      name: preset.name,
                      capacity: preset.capacity,
                    })
                  }
                  class="group p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 text-left touch-manipulation"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h5 class="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                        {preset.name}
                      </h5>
                      <p class="text-sm text-gray-600 font-light mt-1 group-hover:text-indigo-600 transition-colors duration-300">
                        {preset.description}
                      </p>
                      <div class="flex items-center mt-2 text-xs text-gray-500">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>{pluralize(preset.capacity, "seat")}</span>
                      </div>
                    </div>
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        class="w-5 h-5 text-indigo-500"
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
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Show>

        {/* Collapsible Overview - Mobile optimized */}
        <Show when={currentStep() === 1 && !showTableForm()}>
          <div class="animate-fade-in-up-delay-400 mb-6 sm:mb-8">
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <button
                onClick={() => setOverviewExpanded(!overviewExpanded())}
                class="w-full p-4 sm:p-6 text-left hover:bg-gray-50/50 transition-all duration-300 touch-manipulation"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3 sm:space-x-4">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                        Seating Overview
                      </h3>
                      <p class="text-sm sm:text-base text-gray-600 font-light">
                        {seatAssignments().length} guests seated •{" "}
                        {props.tables.length} tables
                        {allGuestsSeated()
                          ? " • Complete!"
                          : ` • ${unassignedAttendees().length} remaining`}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg
                      class={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        overviewExpanded() ? "rotate-180" : ""
                      }`}
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
              </button>

              <Show when={overviewExpanded()}>
                <div class="border-t border-gray-200 p-4 sm:p-6 bg-gradient-to-r from-gray-50/50 to-white">
                  <SeatingOverview
                    tables={props.tables}
                    guests={props.guests}
                    seatAssignments={seatAssignments()}
                    onEditTable={handleEditTableFromOverview}
                    onViewTable={handleViewTable}
                    onBackToAssignment={handleBackToAssignment}
                  />
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* Progress Steps - Mobile optimized */}
        <Show when={props.tables.length > 0}>
          <div class="animate-fade-in-up-delay-600">
            <SeatingSteps currentStep={currentStep()} />
          </div>
        </Show>

        {/* Selected Table Header - Mobile optimized */}
        <Show when={selectedTable()}>
          <div class="animate-fade-in-up-delay-800 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center space-x-4 sm:space-x-6">
                <div
                  class={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                    (selectedTable()?.shape || "round") === "rectangular"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
                >
                  {(selectedTable()?.shape || "round") === "rectangular" ? (
                    <svg
                      class="w-6 h-6 sm:w-8 sm:h-8"
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
                    </svg>
                  ) : (
                    <svg
                      class="w-6 h-6 sm:w-8 sm:h-8"
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
                    </svg>
                  )}
                </div>
                <div>
                  <h3 class="text-xl sm:text-2xl font-semibold text-gray-900">
                    {selectedTable()?.name}
                  </h3>
                  <p class="text-sm sm:text-base text-purple-600 font-medium">
                    {(selectedTable()?.shape || "round") === "rectangular"
                      ? "Rectangular"
                      : "Round"}{" "}
                    table • {selectedTable()?.capacity} seats •{" "}
                    {
                      seatAssignments().filter(
                        (a) => a.tableId === selectedTableId()
                      ).length
                    }{" "}
                    assigned
                  </p>
                </div>
              </div>
              <button
                onClick={handleBackToTableSelection}
                class="btn-mobile px-4 sm:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium"
              >
                <span class="hidden sm:inline">Choose Different Table</span>
                <span class="sm:hidden">Back to Tables</span>
              </button>
            </div>
          </div>
        </Show>

        {/* Main Assignment Interface */}
        <Show when={props.tables.length === 0}>
          <div class="animate-fade-in-up-delay-200 text-center py-12 sm:py-16">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg
                class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
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
            <h3 class="text-xl sm:text-2xl font-light text-gray-600 mb-3 sm:mb-4">
              Start by adding your first table
            </h3>
            <p class="text-gray-500 font-light max-w-md mx-auto">
              Create tables for your wedding reception and begin organizing your
              seating arrangements
            </p>
          </div>
        </Show>

        <Show when={props.tables.length > 0}>
          <Show
            when={currentStep() === 1}
            fallback={
              <Show when={currentStep() === 2 && selectedTable()}>
                <div class="animate-fade-in-up">
                  <TableAssignment
                    table={selectedTable()!}
                    unassignedAttendees={unassignedAttendees()}
                    seatAssignments={seatAssignments()}
                    onSeatAssign={handleSeatAssign}
                    onRemoveAssignment={handleRemoveAssignment}
                  />
                </div>
              </Show>
            }
          >
            <div class="animate-fade-in-up">
              <TableSelection
                tables={props.tables}
                seatAssignments={seatAssignments()}
                selectedTableId={selectedTableId()}
                onTableSelect={handleTableSelect}
              />
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default SeatingChart;

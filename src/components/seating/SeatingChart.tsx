import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  Show,
} from "solid-js";
import { Table, Guest, SeatAssignment } from "../../types";
import { getUnassignedAttendees } from "../../utils/guest";

import SeatingSteps from "./SeatingSteps";
import TableSelection from "./TableSelection";
import TableAssignment from "./TableAssignment";
import SeatingOverview from "./SeatingOverview";

interface SeatingChartProps {
  tables: Table[];
  guests: Guest[];
  onUpdateTables: (tables: Table[]) => void;
}

const SeatingChart: Component<SeatingChartProps> = (props) => {
  // State management
  const [selectedTableId, setSelectedTableId] = createSignal<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = createSignal<1 | 2>(1);
  const [isSaving, setIsSaving] = createSignal(false);
  const [overviewExpanded, setOverviewExpanded] = createSignal(false);

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
    setOverviewExpanded(false); // Collapse overview when starting assignment
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
    // Navigate to table assignment for viewing/editing
    setSelectedTableId(tableId);
    setCurrentStep(2);
    setOverviewExpanded(false);
  };

  const handleEditTable = (tableId: string) => {
    // Same as view table in this simplified flow
    handleViewTable(tableId);
  };

  const handleBackToAssignment = () => {
    setOverviewExpanded(false);
    setSelectedTableId(null);
    setCurrentStep(1);
  };

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
            {allGuestsSeated()
              ? "Seating Plan Complete"
              : "Seating Arrangements"}
          </h1>
          <p class="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            {allGuestsSeated()
              ? "Review and manage your finalized seating arrangements"
              : "Select a table and assign guests to individual seats"}
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

        {/* Collapsible Overview - Always Available */}
        <div class="mb-8">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <button
              onClick={() => setOverviewExpanded(!overviewExpanded())}
              class="w-full p-6 text-left hover:bg-gray-50/50 transition-all duration-300"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
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
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900">
                      Seating Overview
                    </h3>
                    <p class="text-gray-600 font-light">
                      {seatAssignments().length} guests seated •{" "}
                      {props.tables.length} tables •
                      {allGuestsSeated()
                        ? " Complete!"
                        : ` ${unassignedAttendees().length} remaining`}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <Show when={allGuestsSeated()}>
                    <div class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Complete
                    </div>
                  </Show>
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

            {/* Collapsible Content */}
            <Show when={overviewExpanded()}>
              <div class="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50/50 to-white">
                <SeatingOverview
                  tables={props.tables}
                  guests={props.guests}
                  seatAssignments={seatAssignments()}
                  onEditTable={handleEditTable}
                  onViewTable={handleViewTable}
                  onBackToAssignment={handleBackToAssignment}
                />
              </div>
            </Show>
          </div>
        </div>

        {/* Progress Steps */}
        <SeatingSteps currentStep={currentStep()} />

        {/* Selected Table Header */}
        <Show when={selectedTable()}>
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-xl p-6 mb-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div
                  class={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                    (selectedTable()?.shape || "round") === "rectangular"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
                >
                  {(selectedTable()?.shape || "round") === "rectangular" ? (
                    <svg
                      class="w-8 h-8"
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
                      class="w-8 h-8"
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
                  <h3 class="text-2xl font-semibold text-gray-900">
                    {selectedTable()?.name}
                  </h3>
                  <p class="text-purple-600 font-medium">
                    {(selectedTable()?.shape || "round") === "rectangular"
                      ? "Rectangular"
                      : "Round"}{" "}
                    table • {selectedTable()?.capacity} seats •
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
                class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium"
              >
                Choose Different Table
              </button>
            </div>
          </div>
        </Show>

        {/* Main Assignment Interface */}
        <Show
          when={currentStep() === 1}
          fallback={
            <Show when={currentStep() === 2 && selectedTable()}>
              <TableAssignment
                table={selectedTable()!}
                unassignedAttendees={unassignedAttendees()}
                seatAssignments={seatAssignments()}
                onSeatAssign={handleSeatAssign}
                onRemoveAssignment={handleRemoveAssignment}
              />
            </Show>
          }
        >
          <TableSelection
            tables={props.tables}
            seatAssignments={seatAssignments()}
            selectedTableId={selectedTableId()}
            onTableSelect={handleTableSelect}
          />
        </Show>
      </div>
    </div>
  );
};

export default SeatingChart;

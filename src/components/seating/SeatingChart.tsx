// ===== CLEAN: EnhancedSeatingChart.tsx (No shouldShowOverview) =====
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
import GuestSelection from "./GuestSelection";
import TableSelection from "./TableSelection";
import SeatSelection from "./SeatSelection";
import TableView from "./TableView";
import SeatingOverview from "./SeatingOverview";

interface SeatingChartProps {
  tables: Table[];
  guests: Guest[];
  onUpdateTables: (tables: Table[]) => void;
}

const EnhancedSeatingChart: Component<SeatingChartProps> = (props) => {
  // State management
  const [selectedGuestId, setSelectedGuestId] = createSignal<string | null>(
    null
  );
  const [selectedTableId, setSelectedTableId] = createSignal<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = createSignal<1 | 2 | 3>(1);
  const [viewingTableId, setViewingTableId] = createSignal<string | null>(null);
  const [isSaving, setIsSaving] = createSignal(false);
  const [isEditing, setIsEditing] = createSignal(false);
  const [overviewExpanded, setOverviewExpanded] = createSignal(false); // Always available overview

  // Helper function to reset selection (defined early to avoid hoisting issues)
  const resetSelection = () => {
    setSelectedGuestId(null);
    setSelectedTableId(null);
    setCurrentStep(1);
  };

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

  // Show overview expanded by default when all guests are seated (unless actively editing)
  createEffect(() => {
    if (allGuestsSeated()) {
      setOverviewExpanded(true);
    }
  });

  // Get unassigned attendees
  const allAttendees = createMemo(() => {
    const assignedIds = seatAssignments().map((a) => a.guestId);
    return getUnassignedAttendees(props.guests, assignedIds);
  });

  // Get selected guest
  const selectedGuest = createMemo(() => {
    const id = selectedGuestId();
    return id ? allAttendees().find((a) => a.id === id) : null;
  });

  // Get selected table
  const selectedTable = createMemo(() => {
    const id = selectedTableId();
    return id ? props.tables.find((t) => t.id === id) : null;
  });

  // Get viewing table
  const viewingTable = createMemo(() => {
    const id = viewingTableId();
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
  const handleGuestSelect = (guestId: string) => {
    setSelectedGuestId(guestId);
    setSelectedTableId(null);
    setCurrentStep(2);
    // Close overview when starting assignment to focus on the task
    setOverviewExpanded(false);
  };

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setCurrentStep(3);
    // Close overview when progressing to seat selection
    setOverviewExpanded(false);
  };

  const handleSeatSelect = (seatNumber: number) => {
    const guestId = selectedGuestId();
    const tableId = selectedTableId();

    if (!guestId || !tableId) return;

    const guest = allAttendees().find((a) => a.id === guestId);
    if (!guest) return;

    const newAssignment: SeatAssignment = {
      tableId,
      seatNumber,
      guestId,
      guestName: guest.name,
    };

    const updatedAssignments = [...seatAssignments(), newAssignment];
    updateTablesWithAssignments(updatedAssignments);

    resetSelection();

    // Check if editing is complete (all guests seated again)
    const newUnassigned = getUnassignedAttendees(
      props.guests,
      updatedAssignments.map((a) => a.guestId)
    );
    if (newUnassigned.length === 0) {
      // All guests are seated again, exit editing mode and expand overview
      setIsEditing(false);
      setOverviewExpanded(true);
    }
  };

  const handleRemoveAssignment = (guestId: string) => {
    const updatedAssignments = seatAssignments().filter(
      (a) => a.guestId !== guestId
    );
    updateTablesWithAssignments(updatedAssignments);

    // If removing creates unassigned guests, set editing mode and collapse overview
    const newUnassigned = getUnassignedAttendees(
      props.guests,
      updatedAssignments.map((a) => a.guestId)
    );
    if (newUnassigned.length > 0) {
      setIsEditing(true);
      setOverviewExpanded(false);
    }
  };

  const handleViewTable = (tableId: string) => {
    // Set the table to view and stay in current mode
    setViewingTableId(viewingTableId() === tableId ? null : tableId);
  };

  const handleEditTable = (tableId: string) => {
    // Set editing mode and collapse overview to focus on editing
    setIsEditing(true);
    setOverviewExpanded(false);

    // Unassign all guests from this specific table to make them available for reassignment
    const updatedAssignments = seatAssignments().filter(
      (a) => a.tableId !== tableId
    );
    updateTablesWithAssignments(updatedAssignments);

    // Set the table for viewing so user can see the empty table
    setViewingTableId(tableId);
    resetSelection();

    // Small delay to let the assignments update, then auto-select first unassigned guest
    setTimeout(() => {
      const unassigned = getUnassignedAttendees(
        props.guests,
        updatedAssignments.map((a) => a.guestId)
      );
      if (unassigned.length > 0) {
        handleGuestSelect(unassigned[0].id);
      }
    }, 100);
  };

  const handleBackToAssignment = () => {
    setIsEditing(true); // Set editing mode
    setOverviewExpanded(false); // Collapse overview to focus on assignment
    setViewingTableId(null);
    resetSelection();
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
              : "Create the perfect seating plan with our elegant three-step process"}
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
                        : ` ${allAttendees().length} remaining`}
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
                  onViewTable={(tableId: string) =>
                    setViewingTableId(
                      viewingTableId() === tableId ? null : tableId
                    )
                  }
                  onBackToAssignment={handleBackToAssignment}
                />
              </div>
            </Show>
          </div>
        </div>

        {/* Assignment Interface */}
        {/* Show editing mode indicator */}
        <Show when={isEditing()}>
          <div class="bg-amber-100 border border-amber-200 rounded-xl p-4 mb-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg
                  class="w-5 h-5 text-amber-600"
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
                <div>
                  <p class="text-amber-800 font-medium">Editing Mode Active</p>
                  <p class="text-amber-700 text-sm">
                    Make your changes, then click "Done Editing" to return to
                    overview
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setOverviewExpanded(true);
                }}
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-300"
              >
                Done Editing
              </button>
            </div>
          </div>
        </Show>

        {/* Progress Steps */}
        <SeatingSteps currentStep={currentStep()} />

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
                      table •
                      {
                        seatAssignments().filter(
                          (a) => a.tableId === viewingTableId()
                        ).length
                      }
                      /{viewingTable()?.capacity} seats occupied
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
            <TableView
              table={viewingTable()!}
              seatAssignments={seatAssignments()}
              onRemoveAssignment={handleRemoveAssignment}
            />
          </div>
        </Show>

        {/* Selected Guest Status - Always visible during assignment */}
        <Show when={selectedGuest()}>
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-xl p-6 mb-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-lg">
                    {selectedGuest()
                      ?.name.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
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

        {/* Main Selection Interface - Only show current step */}
        <Show
          when={currentStep() === 1}
          fallback={
            <Show
              when={currentStep() === 2}
              fallback={
                <Show when={currentStep() === 3 && selectedTable()}>
                  <SeatSelection
                    table={selectedTable()!}
                    seatAssignments={seatAssignments()}
                    selectedGuestName={selectedGuest()?.name || ""}
                    onSeatSelect={handleSeatSelect}
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
          }
        >
          <GuestSelection
            guests={props.guests}
            seatAssignments={seatAssignments()}
            selectedGuestId={selectedGuestId()}
            onGuestSelect={handleGuestSelect}
          />
        </Show>
      </div>
    </div>
  );
};

export default EnhancedSeatingChart;

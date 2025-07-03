import { Component, For, Show, createMemo, createSignal } from "solid-js";
import { Table, Guest, SeatAssignment } from "../../types";
import { truncateText } from "../../utils/validation";
import { getTableDimensions, getSeatPosition } from "../../utils/guest";

interface SeatingOverviewProps {
  tables: Table[];
  guests: Guest[];
  seatAssignments: SeatAssignment[];
  onEditTable: (tableId: string) => void;
  onViewTable: (tableId: string) => void;
  onBackToAssignment: () => void;
}

const SeatingOverview: Component<SeatingOverviewProps> = (props) => {
  const [viewingTableId, setViewingTableId] = createSignal<string | null>(null);

  // Mobile-friendly container dimensions
  const CONTAINER_WIDTH = 320;
  const CONTAINER_HEIGHT = 320;
  const CENTER_X = CONTAINER_WIDTH / 2;
  const CENTER_Y = CONTAINER_HEIGHT / 2;

  const seatingStats = createMemo(() => {
    const tables = props.tables || [];
    const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);
    const seatAssignments = props.seatAssignments || [];
    const occupiedSeats = seatAssignments.length;
    const totalTables = tables.length;
    const fullTables = tables.filter((table) => {
      const tableSeats = seatAssignments.filter(
        (a) => a.tableId === table.id
      ).length;
      return tableSeats === table.capacity;
    }).length;

    const attendingGuests = (props.guests || []).filter(
      (g) => g.rsvp_status === "attending"
    );
    const totalAttendees = attendingGuests.reduce((sum, guest) => {
      return sum + 1 + (guest.plus_ones?.length || 0);
    }, 0);

    return {
      totalSeats,
      occupiedSeats,
      totalTables,
      fullTables,
      totalAttendees,
      seatUtilization:
        totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0,
    };
  });

  const getTableOccupancy = (table: Table) => {
    const seatAssignments = props.seatAssignments || [];
    const occupiedSeats = seatAssignments.filter(
      (a) => a.tableId === table.id
    ).length;
    const percentage = Math.round((occupiedSeats / table.capacity) * 100);
    return { occupied: occupiedSeats, percentage };
  };

  const getTableGuests = (tableId: string) => {
    const seatAssignments = props.seatAssignments || [];
    return seatAssignments
      .filter((a) => a.tableId === tableId)
      .sort((a, b) => a.seatNumber - b.seatNumber);
  };

  const viewingTable = createMemo(() => {
    const id = viewingTableId();
    const tables = props.tables || [];
    return id ? tables.find((t) => t.id === id) : null;
  });

  const viewingTableDimensions = createMemo(() => {
    const table = viewingTable();
    if (!table) return null;
    return getTableDimensions(table.capacity, table.shape || "round");
  });

  const viewingTableSeatPositions = createMemo(() => {
    const table = viewingTable();
    if (!table) return [];

    return Array.from({ length: table.capacity }, (_, i) => {
      const seatNumber = i + 1;
      const position = getSeatPosition(
        seatNumber,
        table.capacity,
        table.shape || "round"
      );

      return {
        seatNumber,
        x: position.x + (CENTER_X - 120), // Adjusted for mobile
        y: position.y + (CENTER_Y - 120),
      };
    });
  });

  const handleViewTableLocal = (tableId: string) => {
    setViewingTableId(viewingTableId() === tableId ? null : tableId);
  };

  const handleEditTable = (tableId: string) => {
    props.onEditTable(tableId);
  };

  return (
    <div class="animate-fade-in-up space-y-6 sm:space-y-8">
      {/* Mobile Table Detail View */}
      <Show when={viewingTable()}>
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center space-x-3 sm:space-x-4">
                <div
                  class={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                    (viewingTable()?.shape || "round") === "rectangular"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
                >
                  {(viewingTable()?.shape || "round") === "rectangular" ? (
                    <svg
                      class="w-5 h-5 sm:w-7 sm:h-7"
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
                      class="w-5 h-5 sm:w-7 sm:h-7"
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
                <div class="flex-1">
                  <h3 class="text-lg sm:text-2xl font-semibold text-gray-900">
                    {viewingTable()?.name}
                  </h3>
                  <p class="text-sm sm:text-base text-gray-600 font-light">
                    {(viewingTable()?.shape || "round") === "rectangular"
                      ? "Rectangular"
                      : "Round"}{" "}
                    table • {getTableGuests(viewingTableId()!).length}/
                    {viewingTable()?.capacity} seats occupied
                  </p>
                </div>
              </div>
              <div class="flex space-x-2 sm:space-x-3">
                <button
                  onClick={() => handleEditTable(viewingTableId()!)}
                  class="btn-mobile px-3 py-2 sm:px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  <span class="hidden sm:inline">Edit This Table</span>
                  <span class="sm:hidden">Edit</span>
                </button>
                <button
                  onClick={() => setViewingTableId(null)}
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 touch-manipulation"
                >
                  <svg
                    class="w-5 h-5 sm:w-6 sm:h-6"
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
          </div>

          {/* Mobile Table Layout Display */}
          <div class="p-4 sm:p-8">
            <div class="relative w-80 h-80 mx-auto">
              {/* Table Surface */}
              {(viewingTable()?.shape || "round") === "rectangular" ? (
                <div
                  class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border-4 border-amber-200 shadow-xl"
                  style={`left: ${
                    CENTER_X - (viewingTableDimensions()?.width || 160) / 2
                  }px; top: ${
                    CENTER_Y - (viewingTableDimensions()?.height || 60) / 2
                  }px; width: ${
                    viewingTableDimensions()?.width || 160
                  }px; height: ${viewingTableDimensions()?.height || 60}px;`}
                >
                  <div class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-sm sm:text-xl font-bold text-amber-800">
                        {truncateText(viewingTable()?.name || "", 10)}
                      </div>
                      <div class="text-xs text-amber-700 mt-1">
                        {viewingTable()?.capacity} seats
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  class="absolute bg-gradient-to-br from-amber-100 to-orange-100 rounded-full border-4 border-amber-200 shadow-xl"
                  style={`left: ${
                    CENTER_X - (viewingTableDimensions()?.tableRadius || 60)
                  }px; top: ${
                    CENTER_Y - (viewingTableDimensions()?.tableRadius || 60)
                  }px; width: ${
                    (viewingTableDimensions()?.tableRadius || 60) * 2
                  }px; height: ${
                    (viewingTableDimensions()?.tableRadius || 60) * 2
                  }px;`}
                >
                  <div class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-lg sm:text-2xl font-bold text-amber-800">
                        {truncateText(viewingTable()?.name || "", 8)}
                      </div>
                      <div class="text-xs sm:text-sm text-amber-700 mt-1">
                        {viewingTable()?.capacity} seats
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Seats */}
              <For each={viewingTableSeatPositions()}>
                {(seatData) => {
                  const assignment = getTableGuests(viewingTableId()!).find(
                    (a) => a.seatNumber === seatData.seatNumber
                  );
                  const isOccupied = !!assignment;

                  return (
                    <div
                      class={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                        isOccupied
                          ? "bg-gradient-to-br from-purple-400 to-violet-500 text-white"
                          : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                      }`}
                      style={`left: ${seatData.x - 20}px; top: ${
                        seatData.y - 20
                      }px;`}
                    >
                      {isOccupied ? (
                        <svg
                          class="w-4 h-4 sm:w-6 sm:h-6"
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

            {/* Mobile Guest List */}
            <div class="mt-6 sm:mt-8">
              <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Seated Guests
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <For each={getTableGuests(viewingTableId()!)}>
                  {(assignment) => (
                    <div class="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg border border-purple-100/50">
                      <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md text-xs sm:text-sm">
                        {assignment.seatNumber}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {assignment.guestName}
                        </p>
                        <p class="text-purple-600 text-xs sm:text-sm">
                          Seat {assignment.seatNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Mobile Seating Statistics */}
      <div class="animate-fade-in-up-delay-200 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-2xl sm:text-3xl font-bold text-gray-900">
                {seatingStats().totalAttendees}
              </p>
              <p class="text-xs sm:text-sm text-gray-600 font-medium">
                Total Guests
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-2xl sm:text-3xl font-bold text-gray-900">
                {seatingStats().totalTables}
              </p>
              <p class="text-xs sm:text-sm text-gray-600 font-medium">
                Tables Setup
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-2xl sm:text-3xl font-bold text-gray-900">
                {seatingStats().occupiedSeats}
              </p>
              <p class="text-xs sm:text-sm text-gray-600 font-medium">
                Seats Filled
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-2xl sm:text-3xl font-bold text-gray-900">
                {seatingStats().seatUtilization}%
              </p>
              <p class="text-xs sm:text-sm text-gray-600 font-medium">
                Seat Efficiency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Table Overview Grid */}
      <div class="animate-fade-in-up-delay-400 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
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
              <h3 class="text-lg sm:text-2xl font-semibold text-gray-900">
                Table Overview
              </h3>
              <p class="text-sm sm:text-base text-gray-600 font-light">
                Tap any table to view details or make adjustments
              </p>
            </div>
          </div>
          <div class="text-xs sm:text-sm text-gray-500">
            {seatingStats().fullTables} of {seatingStats().totalTables} tables
            at full capacity
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <For each={props.tables || []}>
            {(table) => {
              const occupancy = getTableOccupancy(table);
              const tableGuests = getTableGuests(table.id);
              const isFull = occupancy.occupied === table.capacity;

              return (
                <div class="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden touch-manipulation">
                  <div
                    class={`p-4 sm:p-5 border-b transition-all duration-300 ${
                      isFull
                        ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                        : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
                    }`}
                    onClick={() => handleViewTableLocal(table.id)}
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center space-x-3">
                        <div
                          class={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md ${
                            (table.shape || "round") === "rectangular"
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                              : "bg-gradient-to-br from-blue-500 to-indigo-600"
                          }`}
                        >
                          {(table.shape || "round") === "rectangular" ? (
                            <svg
                              class="w-4 h-4 sm:w-5 sm:h-5"
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
                              class="w-4 h-4 sm:w-5 sm:h-5"
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
                        <div class="flex-1 min-w-0">
                          <h4 class="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {table.name}
                          </h4>
                          <p class="text-xs sm:text-sm text-gray-600">
                            {(table.shape || "round") === "rectangular"
                              ? "Rectangular"
                              : "Round"}{" "}
                            • {table.capacity} seats
                          </p>
                        </div>
                      </div>
                      <Show when={isFull}>
                        <div class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                          Full
                        </div>
                      </Show>
                    </div>

                    {/* Occupancy Bar */}
                    <div class="mb-3">
                      <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>
                          {occupancy.occupied}/{table.capacity} seated
                        </span>
                        <span>{occupancy.percentage}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class={`h-2 rounded-full transition-all duration-300 ${
                            isFull
                              ? "bg-gradient-to-r from-emerald-400 to-green-500"
                              : occupancy.percentage > 75
                              ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                              : "bg-gradient-to-r from-amber-400 to-orange-500"
                          }`}
                          style={`width: ${occupancy.percentage}%`}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div class="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTableLocal(table.id);
                        }}
                        class={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                          viewingTableId() === table.id
                            ? "bg-blue-200 text-blue-800"
                            : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                        }`}
                      >
                        {viewingTableId() === table.id
                          ? "Hide Layout"
                          : "View Layout"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTable(table.id);
                        }}
                        class="flex-1 py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 touch-manipulation"
                      >
                        Edit Seats
                      </button>
                    </div>
                  </div>

                  {/* Guest List Preview */}
                  <div class="p-3 sm:p-4">
                    <h5 class="font-medium text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm">
                      Seated Guests
                    </h5>
                    <div class="space-y-1 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto overflow-touch">
                      <Show
                        when={tableGuests.length > 0}
                        fallback={
                          <p class="text-gray-500 text-xs italic">
                            No guests assigned
                          </p>
                        }
                      >
                        <For each={tableGuests.slice(0, 3)}>
                          {(assignment) => (
                            <div class="flex items-center space-x-2">
                              <div class="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {assignment.seatNumber}
                              </div>
                              <span class="text-xs sm:text-sm text-gray-700 flex-1 truncate">
                                {assignment.guestName}
                              </span>
                            </div>
                          )}
                        </For>
                        <Show when={tableGuests.length > 3}>
                          <div class="text-xs text-gray-500 ml-7 sm:ml-8">
                            +{tableGuests.length - 3} more guests...
                          </div>
                        </Show>
                      </Show>
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div class="animate-fade-in-up-delay-600 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
        <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Quick Actions
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => {
              alert("Export functionality coming soon!");
            }}
            class="p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-left group touch-manipulation"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm sm:text-base">
                  Export Seating Chart
                </p>
                <p class="text-xs sm:text-sm text-gray-600">Download as PDF</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              alert("Share functionality coming soon!");
            }}
            class="p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300 text-left group touch-manipulation"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm sm:text-base">
                  Share with Venue
                </p>
                <p class="text-xs sm:text-sm text-gray-600">
                  Send seating plan
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={props.onBackToAssignment}
            class="p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 text-left group hover:scale-105 touch-manipulation"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
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
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm sm:text-base">
                  Make Adjustments
                </p>
                <p class="text-xs sm:text-sm text-gray-600">
                  Modify seating plan
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatingOverview;

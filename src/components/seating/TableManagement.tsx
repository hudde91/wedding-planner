import { Component, createSignal, Show, For } from "solid-js";
import { Table, TableShape } from "../../types";
import { generateId, pluralize, truncateText } from "../../utils/validation";

import TableForm from "./TableForm";
import PresetTables from "./PresetTables";
import PlanningTips from "./PlanningTips";
import TableView from "./TableView";

interface TableManagementProps {
  tables: Table[];
  onUpdateTables: (tables: Table[]) => void;
}

interface TableFormData {
  name: string;
  capacity: number;
  shape: TableShape;
}

const TableManagement: Component<TableManagementProps> = (props) => {
  const [showTableForm, setShowTableForm] = createSignal(false);
  const [editingTable, setEditingTable] = createSignal<Table | null>(null);
  const [viewingTableId, setViewingTableId] = createSignal<string | null>(null);

  const handleAddTable = (tableData?: { name: string; capacity: number }) => {
    const newTable: Table = {
      id: generateId(),
      name: tableData?.name || "",
      capacity: tableData?.capacity || 8,
      shape: "round",
      assigned_guests: [],
      seatAssignments: [],
    };

    props.onUpdateTables([...props.tables, newTable]);
    setShowTableForm(false);
  };

  const handleSaveTable = (formData: TableFormData) => {
    const editing = editingTable();

    if (editing) {
      // Update existing table
      const updatedTables = props.tables.map((table) =>
        table.id === editing.id
          ? {
              ...table,
              name: formData.name.trim(),
              capacity: formData.capacity,
              shape: formData.shape,
            }
          : table
      );

      // Remove seat assignments that exceed new capacity
      const updatedTablesWithValidSeats = updatedTables.map((table) => {
        if (table.id === editing.id) {
          const validAssignments =
            table.seatAssignments?.filter(
              (assignment) => assignment.seatNumber <= formData.capacity
            ) || [];

          return {
            ...table,
            seatAssignments: validAssignments,
            assigned_guests: validAssignments.map((a) => a.guestId),
          };
        }
        return table;
      });

      props.onUpdateTables(updatedTablesWithValidSeats);
    } else {
      // Create new table
      handleAddTable({ name: formData.name, capacity: formData.capacity });
    }
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setShowTableForm(true);
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

      if (viewingTableId() === tableId) {
        setViewingTableId(null);
      }
    }
  };

  const handleCancelTableForm = () => {
    setShowTableForm(false);
    setEditingTable(null);
  };

  const handleViewTable = (tableId: string) => {
    setViewingTableId(viewingTableId() === tableId ? null : tableId);
  };

  const getOccupiedSeats = (tableId: string) => {
    const table = props.tables.find((t) => t.id === tableId);
    return table?.seatAssignments || [];
  };

  const viewingTable = () => {
    const id = viewingTableId();
    return id ? props.tables.find((t) => t.id === id) : null;
  };

  return (
    <div class="space-y-8">
      {/* Table Management Header */}
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8">
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
          <TableForm
            editingTable={editingTable()}
            onSave={handleSaveTable}
            onCancel={handleCancelTableForm}
            autoSave={!!editingTable()}
          />
        </Show>

        {/* Existing Tables List */}
        <Show when={props.tables.length > 0}>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                            •{availableSeats}/{table.capacity} available
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

                    {/* Mini preview */}
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

        {/* Quick Add Presets */}
        <PresetTables onAddTable={handleAddTable} />

        {/* Planning Tips */}
        <PlanningTips />
      </div>

      {/* Table Viewing Section */}
      <Show when={viewingTable()}>
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
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

          <TableView
            table={viewingTable()!}
            seatAssignments={getOccupiedSeats(viewingTableId()!)}
          />
        </div>
      </Show>
    </div>
  );
};

export default TableManagement;

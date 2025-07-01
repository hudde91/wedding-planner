import { Component, For, Show, createMemo } from "solid-js";
import { Table, SeatAssignment } from "../../types";
import { pluralize } from "../../utils/validation";

interface TableSelectionProps {
  tables: Table[];
  seatAssignments: SeatAssignment[];
  selectedTableId: string | null;
  onTableSelect: (tableId: string) => void;
}

const TableSelection: Component<TableSelectionProps> = (props) => {
  const availableTables = createMemo(() => {
    return props.tables.filter((table) => {
      const assignedSeats = props.seatAssignments.filter(
        (a) => a.tableId === table.id
      ).length;
      return assignedSeats < table.capacity;
    });
  });

  return (
    <div class="animate-fade-in-up bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
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
              {pluralize(availableTables().length, "table")} with space
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
              <p class="text-gray-600 font-light">All tables are full!</p>
            </div>
          }
        >
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <For each={availableTables()}>
              {(table) => {
                const occupiedSeats = props.seatAssignments.filter(
                  (a) => a.tableId === table.id
                ).length;
                const availableSeats = table.capacity - occupiedSeats;

                return (
                  <button
                    onClick={() => props.onTableSelect(table.id)}
                    class={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] border ${
                      props.selectedTableId === table.id
                        ? "bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 shadow-lg"
                        : "bg-gradient-to-r from-white to-blue-50/30 border-blue-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div
                          class={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                            props.selectedTableId === table.id
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
                      <Show when={props.selectedTableId === table.id}>
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
  );
};

export default TableSelection;

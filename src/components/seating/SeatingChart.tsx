import {
  createSignal,
  createMemo,
  For,
  onMount,
  onCleanup,
  Component,
  Show,
} from "solid-js";
import { Table, Guest, Attendee, TableFormData } from "../../types";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import TableComponent from "./TableComponent";
import TableForm from "./TableForm";
import UnseatedGuests from "./UnseatedGuests";
import SeatingStats from "./SeatingStats";

interface SeatingChartProps {
  tables: Table[];
  guests: Guest[];
  updateSeatingPlan: (tables: Table[]) => void;
}

const SeatingChart: Component<SeatingChartProps> = (props) => {
  // Table management state
  const [showAddTableForm, setShowAddTableForm] = createSignal(false);
  const [editingTable, setEditingTable] = createSignal<Table | null>(null);

  // Initialize drag and drop
  const {
    isDragging,
    draggedGuest,
    draggedFromSeat,
    dragPosition,
    hoveredSeat,
    handleMouseDown,
    handleMouseUp,
  } = useDragAndDrop();

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

  const stats = createMemo(() => {
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

  // Table management functions
  const handleTableSubmit = (tableData: TableFormData): void => {
    const seats = Array.from({ length: tableData.seats }, (_, i) => ({
      id: i + 1,
      guestId: null,
      guestName: "",
    }));

    if (editingTable()) {
      // Update existing table
      const updatedTables = props.tables.map((table) =>
        table.id === editingTable()!.id
          ? {
              id: table.id,
              name: tableData.name,
              shape: tableData.shape,
              seats: [...seats],
            }
          : table
      );
      props.updateSeatingPlan(updatedTables);
    } else {
      const newTable: Table = {
        id: Math.floor(Date.now()),
        name: tableData.name,
        shape: tableData.shape,
        seats: [...seats],
      };
      props.updateSeatingPlan([...props.tables, newTable]);
    }

    resetTableForm();
  };

  const resetTableForm = (): void => {
    setShowAddTableForm(false);
    setEditingTable(null);
  };

  const startEditTable = (table: Table): void => {
    setEditingTable(table);
    setShowAddTableForm(true);
  };

  // TODO: The delete happens even if I click "Cancel" in the confirmation dialog this is a bug
  // Fix this
  const deleteTable = (tableId: number): void => {
    if (
      confirm(
        "Are you sure you want to delete this table? All seating assignments will be lost."
      )
    ) {
      const updatedTables = props.tables.filter(
        (table) => table.id !== tableId
      );
      props.updateSeatingPlan(updatedTables);
    }
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

  const getGridClasses = createMemo((): string => {
    const tablesData = props.tables;
    if (tablesData.length === 0) return "grid-cols-1";

    // Simple responsive grid based on number of tables
    if (tablesData.length === 1) return "grid-cols-1";
    if (tablesData.length === 2) return "grid-cols-1 md:grid-cols-2";
    if (tablesData.length <= 4)
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  });

  // Event listeners
  onMount(() => {
    if (typeof document !== "undefined") {
      const handleMouseUpWrapper = (e: MouseEvent) => {
        handleMouseUp(e, handleDrop);
      };

      document.addEventListener("mouseup", handleMouseUpWrapper);

      onCleanup(() => {
        document.removeEventListener("mouseup", handleMouseUpWrapper);
      });
    }
  });

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Seating Chart</h2>
        <button
          onClick={() => {
            if (showAddTableForm()) {
              resetTableForm();
            } else {
              setShowAddTableForm(true);
            }
          }}
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
        >
          {showAddTableForm() ? "Cancel" : "Add Table"}
        </button>
      </div>

      {/* Stats */}
      <SeatingStats
        totalTables={props.tables.length}
        occupiedSeats={stats().occupiedSeats}
        totalSeats={stats().totalSeats}
        unseatedGuests={stats().unseatedGuests}
      />

      {/* Add/Edit Table Form */}
      <Show when={showAddTableForm()}>
        <TableForm
          editingTable={editingTable()}
          onSubmit={handleTableSubmit}
          onCancel={resetTableForm}
        />
      </Show>

      {/* Unseated Guests */}
      <Show when={unseatedGuests().length > 0}>
        <UnseatedGuests
          guests={unseatedGuests()}
          onMouseDown={handleMouseDown}
          isDragging={isDragging()}
          draggedGuest={draggedGuest()}
        />
      </Show>

      {/* Tables */}
      <Show when={props.tables.length > 0}>
        <div class={`grid ${getGridClasses()} gap-6`}>
          <For each={props.tables}>
            {(table) => (
              <TableComponent
                table={table}
                availableGuests={availableGuests()}
                isDragging={isDragging()}
                draggedGuest={draggedGuest()}
                hoveredSeat={hoveredSeat()}
                onEditTable={startEditTable}
                onDeleteTable={deleteTable}
                onMouseDownGuest={handleMouseDown}
                onRemoveGuest={removeGuestFromSeat}
              />
            )}
          </For>
        </div>
      </Show>

      <Show when={props.tables.length === 0}>
        <div class="text-center py-12 text-gray-500">
          <div class="text-4xl mb-4">🪑</div>
          <p class="text-lg font-medium mb-2">No tables created yet</p>
          <p>Add your first table above to start arranging your seating!</p>
        </div>
      </Show>

      {/* Floating drag preview */}
      <Show when={isDragging() && draggedGuest()}>
        <div
          class="fixed pointer-events-none z-50 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={`left: ${dragPosition().x}px; top: ${dragPosition().y}px;`}
        >
          {draggedGuest()!.name}
        </div>
      </Show>
    </div>
  );
};

export default SeatingChart;

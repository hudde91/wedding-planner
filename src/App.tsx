import { createSignal, onMount, Show, Component } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { nanoid } from "nanoid";
import WeddingDetails from "./components/WeddingDetails";
import TodoList from "./components/TodoList";
import GuestList from "./components/GuestList";
import SeatingChart from "./components/SeatingChart";
import Navigation from "./components/Navigation";
import { WeddingPlan, TodoItem, Guest, GuestFormData, Table } from "./types";

type AppState = "loading" | "loaded";
type TabId = "details" | "todos" | "guests" | "seating";

const App: Component = () => {
  const [appState, setAppState] = createSignal<AppState>("loading");
  const [activeTab, setActiveTab] = createSignal<TabId>("details");
  const [weddingPlan, setWeddingPlan] = createSignal<WeddingPlan>({
    couple_name1: "",
    couple_name2: "",
    wedding_date: "",
    budget: 0,
    todos: [],
    guests: [],
    tables: [],
  });

  const defaultTodos: TodoItem[] = [
    { id: 1, text: "Set wedding date and venue", completed: false },
    { id: 2, text: "Book photographer", completed: false },
    { id: 3, text: "Choose wedding attire", completed: false },
    { id: 4, text: "Order wedding cake", completed: false },
    { id: 5, text: "Send invitations", completed: false },
    { id: 6, text: "Arrange transportation", completed: false },
    { id: 7, text: "Book honeymoon", completed: false },
    { id: 8, text: "Purchase rings", completed: false },
    { id: 9, text: "Plan reception menu", completed: false },
    { id: 10, text: "Hire DJ/band", completed: false },
  ];

  onMount(async () => {
    try {
      const savedPlan = await invoke<WeddingPlan>("load_wedding_plan");
      const plan: WeddingPlan = {
        ...savedPlan,
        todos:
          savedPlan.todos && savedPlan.todos.length > 0
            ? savedPlan.todos
            : defaultTodos,
        guests: savedPlan.guests || [],
        tables: savedPlan.tables || [],
      };
      setWeddingPlan(plan);
      setAppState("loaded");
    } catch (error) {
      console.error("Failed to load wedding plan:", error);
      setWeddingPlan((prev) => ({ ...prev, todos: defaultTodos, tables: [] }));
      setAppState("loaded");
    }
  });

  const savePlanToBackend = async (plan: WeddingPlan): Promise<void> => {
    try {
      await invoke("save_wedding_plan", { plan });
      console.log("Saved to backend successfully");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const updateWeddingDetails = (
    field: keyof WeddingPlan,
    value: string | number
  ): void => {
    setWeddingPlan((prev) => {
      const updated = { ...prev, [field]: value };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const addTodo = (text: string): void => {
    setWeddingPlan((prev) => {
      const newId =
        prev.todos.length > 0
          ? Math.max(...prev.todos.map((t) => t.id)) + 1
          : 1;
      const newTodo: TodoItem = { id: newId, text: text, completed: false };
      const updated = { ...prev, todos: [...prev.todos, newTodo] };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const toggleTodo = (id: number): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const deleteTodo = (id: number): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        todos: prev.todos.filter((todo) => todo.id !== id),
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const addGuest = (guestData: GuestFormData): void => {
    setWeddingPlan((prev) => {
      // Convert temporary plus one IDs to permanent nanoid IDs
      const processedPlusOnes =
        guestData.plus_ones?.map((plusOne) => ({
          ...plusOne,
          id: plusOne.id?.toString().startsWith("temp_")
            ? nanoid()
            : plusOne.id || nanoid(),
        })) || [];

      const newGuest: Guest = {
        id: nanoid(),
        ...guestData,
        plus_ones: processedPlusOnes,
      };

      const updated = {
        ...prev,
        guests: [...prev.guests, newGuest],
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const updateGuest = (id: string, guestData: GuestFormData): void => {
    setWeddingPlan((prev) => {
      const oldGuest = prev.guests.find((g) => g.id === id);
      const wasAttending = oldGuest?.rsvp_status === "attending";
      const nowAttending = guestData.rsvp_status === "attending";

      // Convert temporary plus one IDs to permanent nanoid IDs
      const processedPlusOnes =
        guestData.plus_ones?.map((plusOne) => ({
          ...plusOne,
          id: plusOne.id?.toString().startsWith("temp_")
            ? nanoid()
            : plusOne.id || nanoid(),
        })) || [];

      // If guest is no longer attending, remove them and their plus ones from all seats
      let updatedTables = prev.tables;
      if (wasAttending && !nowAttending) {
        console.log("Guest no longer attending, removing from seating chart");

        // Get all guest IDs to remove (main guest + plus ones)
        const guestIdsToRemove = new Set([id]);
        if (oldGuest?.plus_ones) {
          oldGuest.plus_ones.forEach((plusOne) =>
            guestIdsToRemove.add(plusOne.id)
          );
        }

        updatedTables = prev.tables.map((table) => ({
          id: table.id,
          name: table.name,
          shape: table.shape,
          seats: table.seats.map((seat) =>
            guestIdsToRemove.has(seat.guestId || "")
              ? { id: seat.id, guestId: null, guestName: "" }
              : {
                  id: seat.id,
                  guestId: seat.guestId,
                  guestName: seat.guestName,
                }
          ),
        }));
      }

      const updated = {
        ...prev,
        guests: prev.guests.map((guest) =>
          guest.id === id
            ? { ...guest, ...guestData, plus_ones: processedPlusOnes }
            : guest
        ),
        tables: updatedTables,
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const deleteGuest = (id: string): void => {
    setWeddingPlan((prev) => {
      const guestToDelete = prev.guests.find((g) => g.id === id);

      // Get all guest IDs to remove (main guest + plus ones)
      const guestIdsToRemove = new Set([id]);
      if (guestToDelete?.plus_ones) {
        guestToDelete.plus_ones.forEach((plusOne) =>
          guestIdsToRemove.add(plusOne.id)
        );
      }

      // Remove guest and their plus ones from all seats when deleting
      const updatedTables = prev.tables.map((table) => ({
        id: table.id,
        name: table.name,
        shape: table.shape,
        seats: table.seats.map((seat) =>
          guestIdsToRemove.has(seat.guestId || "")
            ? { id: seat.id, guestId: null, guestName: "" }
            : { id: seat.id, guestId: seat.guestId, guestName: seat.guestName }
        ),
      }));

      const updated = {
        ...prev,
        guests: prev.guests.filter((guest) => guest.id !== id),
        tables: updatedTables,
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const updateSeatingPlan = (tables: Table[]): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        tables: tables.map((table) => ({
          id: table.id,
          name: table.name,
          shape: table.shape,
          seats: table.seats.map((seat) => ({
            id: seat.id,
            guestId: seat.guestId,
            guestName: seat.guestName,
          })),
        })),
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <Show when={appState() === "loading"}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading your wedding plan...</p>
          </div>
        </div>
      </Show>

      <Show when={appState() === "loaded"}>
        <div class="container mx-auto px-4 py-8 max-w-4xl">
          <header class="text-center mb-8">
            <h1 class="text-3xl font-bold text-purple-800 mb-2">
              Wedding Planner
            </h1>
            <Show
              when={weddingPlan().couple_name1 && weddingPlan().couple_name2}
            >
              <p class="text-gray-600">
                {weddingPlan().couple_name1} & {weddingPlan().couple_name2}
              </p>
            </Show>
          </header>

          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <main class="bg-white rounded-lg shadow-md p-6">
            <Show when={activeTab() === "details"}>
              <WeddingDetails
                weddingPlan={weddingPlan()}
                updateWeddingDetails={updateWeddingDetails}
              />
            </Show>

            <Show when={activeTab() === "todos"}>
              <TodoList
                todos={weddingPlan().todos}
                addTodo={addTodo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
              />
            </Show>

            <Show when={activeTab() === "guests"}>
              <GuestList
                guests={weddingPlan().guests}
                addGuest={addGuest}
                updateGuest={updateGuest}
                deleteGuest={deleteGuest}
              />
            </Show>

            <Show when={activeTab() === "seating"}>
              <SeatingChart
                tables={weddingPlan().tables}
                guests={weddingPlan().guests}
                updateSeatingPlan={updateSeatingPlan}
              />
            </Show>
          </main>
        </div>
      </Show>
    </div>
  );
};

export default App;

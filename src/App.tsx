import { createSignal, onMount, Show, Component } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { nanoid } from "nanoid";
import WeddingDetails from "./components/WeddingDetails";
import TodoList from "./components/TodoList";
import GuestList from "./components/GuestList";
import SeatingChart from "./components/SeatingChart";
import Overview from "./components/Overview";
import Sidebar from "./components/Sidebar";
import {
  WeddingPlan,
  TodoItem,
  Guest,
  GuestFormData,
  Table,
  TodoFormData,
} from "./types";

type AppState = "loading" | "loaded";
type TabId = "overview" | "details" | "todos" | "guests" | "seating";

const App: Component = () => {
  const [appState, setAppState] = createSignal<AppState>("loading");
  const [activeTab, setActiveTab] = createSignal<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
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

  const updateTodo = (id: number, todoData: TodoFormData): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                ...todoData,
                completion_date:
                  todoData.cost || todoData.vendor_name || todoData.notes
                    ? new Date().toISOString().split("T")[0]
                    : todo.completion_date,
              }
            : todo
        ),
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
    <div class="min-h-screen bg-gray-50 flex">
      <Show when={appState() === "loading"}>
        <div class="flex items-center justify-center min-h-screen w-full">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading your wedding plan...</p>
          </div>
        </div>
      </Show>

      <Show when={appState() === "loaded"}>
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          weddingPlan={weddingPlan()}
        />

        {/* Main Content */}
        <div
          class={`flex-1 transition-all duration-300 ${
            sidebarOpen() ? "ml-64" : "ml-16"
          }`}
        >
          {/* Top Header */}
          <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen())}
                  class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">
                    {(() => {
                      switch (activeTab()) {
                        case "overview":
                          return "Wedding Overview";
                        case "details":
                          return "Wedding Details";
                        case "todos":
                          return "Wedding Checklist";
                        case "guests":
                          return "Guest Management";
                        case "seating":
                          return "Seating Chart";
                        default:
                          return "Wedding Planner";
                      }
                    })()}
                  </h1>
                  <Show
                    when={
                      weddingPlan().couple_name1 && weddingPlan().couple_name2
                    }
                  >
                    <p class="text-sm text-gray-600">
                      {weddingPlan().couple_name1} &{" "}
                      {weddingPlan().couple_name2}
                    </p>
                  </Show>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-500">
                  <span class="inline-flex items-center">
                    <svg
                      class="w-4 h-4 mr-1 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Auto-saved
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main class="p-6">
            <div class="max-w-7xl mx-auto">
              <Show when={activeTab() === "overview"}>
                <Overview weddingPlan={weddingPlan()} />
              </Show>

              <Show when={activeTab() === "details"}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <WeddingDetails
                    weddingPlan={weddingPlan()}
                    updateWeddingDetails={updateWeddingDetails}
                  />
                </div>
              </Show>

              <Show when={activeTab() === "todos"}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <TodoList
                    todos={weddingPlan().todos}
                    addTodo={addTodo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                    updateTodo={updateTodo}
                  />
                </div>
              </Show>

              <Show when={activeTab() === "guests"}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <GuestList
                    guests={weddingPlan().guests}
                    addGuest={addGuest}
                    updateGuest={updateGuest}
                    deleteGuest={deleteGuest}
                  />
                </div>
              </Show>

              <Show when={activeTab() === "seating"}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <SeatingChart
                    tables={weddingPlan().tables}
                    guests={weddingPlan().guests}
                    updateSeatingPlan={updateSeatingPlan}
                  />
                </div>
              </Show>
            </div>
          </main>
        </div>
      </Show>
    </div>
  );
};

export default App;

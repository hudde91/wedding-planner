import { createSignal, onMount, Show, Component } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { nanoid } from "nanoid";
import type {
  WeddingPlan,
  TodoItem,
  Guest,
  GuestFormData,
  Table,
  TodoFormData,
  TabId,
} from "./types";

import LoadingSpinner from "./components/common/LoadingSpinner";
import MainLayout from "./components/layout/MainLayout";

import Overview from "./components/overview/Overview";
import WeddingDetails from "./components/wedding-details/WeddingDetails";
import TodoList from "./components/todos/TodoList";
import GuestList from "./components/guests/GuestList";
import SeatingChart from "./components/seating/SeatingChart";
import Timeline from "./components/timeline/Timeline";

type AppState = "loading" | "loaded";

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

      // Clean up any tables with old structure to prevent errors
      const cleanedTables =
        savedPlan.tables?.filter((table: any) => {
          // Only keep tables that have the new structure
          return "capacity" in table && "assigned_guests" in table;
        }) || [];

      const plan: WeddingPlan = {
        ...savedPlan,
        todos:
          savedPlan.todos && savedPlan.todos.length > 0
            ? savedPlan.todos
            : defaultTodos,
        guests: savedPlan.guests || [],
        tables: cleanedTables,
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

  // Todo functions
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

  // Guest functions
  const addGuest = (guestData: GuestFormData): void => {
    setWeddingPlan((prev) => {
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
      const updated = { ...prev, guests: [...prev.guests, newGuest] };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const updateGuest = (id: string, guestData: GuestFormData): void => {
    setWeddingPlan((prev) => {
      const oldGuest = prev.guests.find((g) => g.id === id);
      const wasAttending = oldGuest?.rsvp_status === "attending";
      const nowAttending = guestData.rsvp_status === "attending";

      const processedPlusOnes =
        guestData.plus_ones?.map((plusOne) => ({
          ...plusOne,
          id: plusOne.id?.toString().startsWith("temp_")
            ? nanoid()
            : plusOne.id || nanoid(),
        })) || [];

      let updatedTables = prev.tables;
      if (wasAttending && !nowAttending) {
        // Remove guest from tables if they're no longer attending
        updatedTables = prev.tables.map((table) => ({
          ...table,
          assigned_guests: table.assigned_guests.filter(
            (guestId) => guestId !== id
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
      // Remove guest from any tables they're assigned to
      const updatedTables = prev.tables.map((table) => ({
        ...table,
        assigned_guests: table.assigned_guests.filter(
          (guestId) => guestId !== id
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

  // Seating functions
  const updateTables = (tables: Table[]): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        tables: tables,
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <Show when={appState() === "loading"}>
        <LoadingSpinner />
      </Show>

      <Show when={appState() === "loaded"}>
        <MainLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          weddingPlan={weddingPlan()}
        >
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
            <SeatingChart
              tables={weddingPlan().tables}
              guests={weddingPlan().guests}
              onUpdateTables={updateTables}
            />
          </Show>

          <Show when={activeTab() === "timeline"}>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Timeline
                weddingPlan={weddingPlan()}
                onToggleTodo={toggleTodo}
                onDeleteTodo={deleteTodo}
                onUpdateTodo={updateTodo}
                onAddTodo={addTodo}
              />
            </div>
          </Show>
        </MainLayout>
      </Show>
    </div>
  );
};

export default App;

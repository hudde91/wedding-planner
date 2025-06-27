import { createSignal, onMount, Show, Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/tauri";
import { nanoid } from "nanoid";
import type {
  WeddingPlan,
  TodoItem,
  Guest,
  GuestFormData,
  Table,
  TodoFormData,
  WishlistItem,
  WishlistFormData,
  MediaItem,
  MediaUploadData,
} from "./types";

import LoadingSpinner from "./components/common/LoadingSpinner";
import CoupleLayout from "./components/layout/CoupleLayout";
import GuestLayout from "./components/layout/GuestLayout";

// Couple Pages
import Overview from "./components/overview/Overview";
import WeddingDetails from "./components/wedding-details/WeddingDetails";
import TodoList from "./components/todos/TodoList";
import GuestList from "./components/invitations/GuestList";
import SeatingChart from "./components/seating/SeatingChart";
import Timeline from "./components/timeline/Timeline";
import Wishlist from "./components/wishlist/Wishlist";
import Gallery from "./components/gallery/Gallery";

// Guest Pages
import GuestWelcome from "./components/guest/GuestWelcome";
import GuestWishlist from "./components/guest/GuestWishlist";
import GuestGallery from "./components/guest/GuestGallery";
import GuestInfo from "./components/guest/GuestInfo";

type AppState = "loading" | "loaded";

const App: Component = () => {
  const [appState, setAppState] = createSignal<AppState>("loading");
  const [weddingPlan, setWeddingPlan] = createSignal<WeddingPlan>({
    couple_name1: "",
    couple_name2: "",
    wedding_date: "",
    budget: 0,
    todos: [],
    guests: [],
    tables: [],
    wishlist: [],
    media: [],
  });

  const defaultTodos: TodoItem[] = [];

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
        wishlist: savedPlan.wishlist || [],
        media: savedPlan.media || [],
      };
      setWeddingPlan(plan);
      setAppState("loaded");
    } catch (error) {
      console.error("Failed to load wedding plan:", error);
      setWeddingPlan((prev) => ({
        ...prev,
        todos: defaultTodos,
        tables: [],
        wishlist: [],
        media: [],
      }));
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
      const updated = { ...prev, todos: [newTodo, ...prev.todos] };
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

  // Wishlist functions
  const addWishlistItem = (itemData: WishlistFormData): void => {
    setWeddingPlan((prev) => {
      const newItem: WishlistItem = {
        id: nanoid(),
        ...itemData,
        status: "available",
      };
      const updated = { ...prev, wishlist: [...prev.wishlist, newItem] };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const updateWishlistItem = (
    id: string,
    itemData: Partial<WishlistItem>
  ): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        wishlist: prev.wishlist.map((item) =>
          item.id === id ? { ...item, ...itemData } : item
        ),
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const deleteWishlistItem = (id: string): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        wishlist: prev.wishlist.filter((item) => item.id !== id),
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  // Media functions
  const addMedia = async (
    files: File[],
    uploadData: MediaUploadData
  ): Promise<void> => {
    try {
      const newMediaItems: MediaItem[] = [];

      for (const file of files) {
        const fileId = nanoid();
        const fileExtension = file.name.split(".").pop() || "";
        const fileName = `${fileId}.${fileExtension}`;

        // Convert file to array buffer and then to Uint8Array
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const fileData = Array.from(uint8Array);

        // Save file to backend
        await invoke<string>("save_media_file", {
          fileName,
          fileData,
        });

        // Get file info
        const [fileSize] = await invoke<[number, any]>("get_media_file_info", {
          filename: fileName,
        });

        const mediaItem: MediaItem = {
          id: fileId,
          filename: fileName,
          originalName: file.name,
          type: file.type.startsWith("image/") ? "image" : "video",
          category: uploadData.category,
          uploadedAt: new Date().toISOString(),
          uploadedBy: uploadData.uploadedBy,
          caption: uploadData.caption,
          tags: uploadData.tags || [],
          isFavorite: false,
          fileSize,
        };

        newMediaItems.push(mediaItem);
      }

      setWeddingPlan((prev) => {
        const updated = {
          ...prev,
          media: [...prev.media, ...newMediaItems],
        };
        savePlanToBackend(updated);
        return updated;
      });
    } catch (error) {
      console.error("Failed to upload media:", error);
      alert("Failed to upload media files. Please try again.");
    }
  };

  const updateMedia = (id: string, updates: Partial<MediaItem>): void => {
    setWeddingPlan((prev) => {
      const updated = {
        ...prev,
        media: prev.media.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      };
      savePlanToBackend(updated);
      return updated;
    });
  };

  const deleteMedia = async (id: string): Promise<void> => {
    try {
      const mediaItem = weddingPlan().media.find((item) => item.id === id);
      if (mediaItem) {
        // Delete file from backend
        await invoke("delete_media_file", { filename: mediaItem.filename });

        setWeddingPlan((prev) => {
          const updated = {
            ...prev,
            media: prev.media.filter((item) => item.id !== id),
          };
          savePlanToBackend(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to delete media:", error);
      alert("Failed to delete media file. Please try again.");
    }
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <Show when={appState() === "loading"}>
        <LoadingSpinner />
      </Show>

      <Show when={appState() === "loaded"}>
        <Router>
          {/* Couple Routes */}
          <Route
            path="/"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <Overview
                  weddingPlan={weddingPlan()}
                  onNavigateToRoute={(route) => (window.location.href = route)}
                />
              </CoupleLayout>
            )}
          />
          <Route
            path="/details"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <WeddingDetails
                    weddingPlan={weddingPlan()}
                    updateWeddingDetails={updateWeddingDetails}
                  />
                </div>
              </CoupleLayout>
            )}
          />
          <Route
            path="/todos"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <TodoList
                    todos={weddingPlan().todos}
                    addTodo={addTodo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                    updateTodo={updateTodo}
                  />
                </div>
              </CoupleLayout>
            )}
          />
          <Route
            path="/guests"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <GuestList
                    guests={weddingPlan().guests}
                    addGuest={addGuest}
                    updateGuest={updateGuest}
                    deleteGuest={deleteGuest}
                  />
                </div>
              </CoupleLayout>
            )}
          />
          <Route
            path="/seating"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <SeatingChart
                  tables={weddingPlan().tables}
                  guests={weddingPlan().guests}
                  onUpdateTables={updateTables}
                />
              </CoupleLayout>
            )}
          />
          <Route
            path="/timeline"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <Timeline
                    weddingPlan={weddingPlan()}
                    onToggleTodo={toggleTodo}
                    onDeleteTodo={deleteTodo}
                    onUpdateTodo={updateTodo}
                    onAddTodo={addTodo}
                  />
                </div>
              </CoupleLayout>
            )}
          />
          <Route
            path="/wishlist"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <Wishlist
                  wishlistItems={weddingPlan().wishlist}
                  onAddWishlistItem={addWishlistItem}
                  onUpdateWishlistItem={updateWishlistItem}
                  onDeleteWishlistItem={deleteWishlistItem}
                />
              </CoupleLayout>
            )}
          />
          <Route
            path="/gallery"
            component={() => (
              <CoupleLayout weddingPlan={weddingPlan()}>
                <Gallery
                  mediaItems={weddingPlan().media}
                  onAddMedia={addMedia}
                  onUpdateMedia={updateMedia}
                  onDeleteMedia={deleteMedia}
                />
              </CoupleLayout>
            )}
          />

          {/* Guest Routes */}
          <Route
            path="/guest"
            component={() => (
              <GuestLayout weddingPlan={weddingPlan()}>
                <GuestWelcome weddingPlan={weddingPlan()} />
              </GuestLayout>
            )}
          />
          <Route
            path="/guest/info"
            component={() => (
              <GuestLayout weddingPlan={weddingPlan()}>
                <GuestInfo weddingPlan={weddingPlan()} />
              </GuestLayout>
            )}
          />
          <Route
            path="/guest/wishlist"
            component={() => (
              <GuestLayout weddingPlan={weddingPlan()}>
                <GuestWishlist
                  wishlistItems={weddingPlan().wishlist}
                  onUpdateWishlistItem={updateWishlistItem}
                />
              </GuestLayout>
            )}
          />
          <Route
            path="/guest/gallery"
            component={() => (
              <GuestLayout weddingPlan={weddingPlan()}>
                <GuestGallery
                  mediaItems={weddingPlan().media}
                  onAddMedia={addMedia}
                />
              </GuestLayout>
            )}
          />
        </Router>
      </Show>
    </div>
  );
};

export default App;

import { createSignal, Component, For, Show, onMount } from "solid-js";
import {
  Guest,
  GuestFormData,
  GuestStats as GuestStatsType,
} from "../../types";
import GuestForm from "./GuestForm";
import GuestCard from "./GuestCard";
import GuestStats from "./GuestStats";

interface GuestListProps {
  guests: Guest[];
  addGuest: (guestData: GuestFormData) => void;
  updateGuest: (id: string, guestData: GuestFormData) => void;
  deleteGuest: (id: string) => void;
}

const GuestList: Component<GuestListProps> = (props) => {
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editingGuest, setEditingGuest] = createSignal<Guest | null>(null);
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  const stats = (): GuestStatsType => {
    const guests = props.guests;
    const attending = guests.filter((g) => g.rsvp_status === "attending");
    const declined = guests.filter((g) => g.rsvp_status === "declined");
    const pending = guests.filter((g) => g.rsvp_status === "pending");
    const totalAttendees = attending.reduce(
      (sum, guest) => sum + 1 + guest.plus_ones.length,
      0
    );

    return { attending, declined, pending, totalAttendees };
  };

  const handleAddGuest = (guestData: GuestFormData): void => {
    props.addGuest(guestData);
    setShowAddForm(false);
  };

  const handleUpdateGuest = (guestData: GuestFormData): void => {
    if (editingGuest()) {
      props.updateGuest(editingGuest()!.id, guestData);
      setEditingGuest(null);
      setShowAddForm(false);
    }
  };

  const startEdit = (guest: Guest): void => {
    setEditingGuest(guest);
    setShowAddForm(true);
  };

  const cancelForm = (): void => {
    setShowAddForm(false);
    setEditingGuest(null);
  };

  return (
    <div class="space-y-8">
      {/* Header with Background */}
      <div
        class={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-white to-cyan-100 border border-blue-200/50 shadow-xl transition-all duration-1000 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=400&fit=crop&auto=format"
            alt="Wedding celebration"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 p-8">
          <div class="flex justify-between items-center">
            <div class="max-w-3xl">
              <h1 class="text-4xl font-light text-gray-800 mb-4 tracking-wide">
                Guest Management
              </h1>
              <p class="text-lg text-gray-600 font-light leading-relaxed">
                Manage your wedding guest list, track RSVPs, and coordinate all
                the important details for your loved ones.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm())}
              class={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                showAddForm()
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {showAddForm() ? "Cancel" : "Add Guest"}
            </button>
          </div>
        </div>

        <div class="absolute top-4 right-4 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" fill="currentColor" class="text-blue-300">
            <circle cx="30" cy="30" r="8" />
            <circle cx="50" cy="20" r="8" />
            <circle cx="70" cy="30" r="8" />
            <circle cx="25" cy="50" r="8" />
            <circle cx="45" cy="45" r="8" />
            <circle cx="65" cy="50" r="8" />
            <circle cx="75" cy="50" r="8" />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <Show when={props.guests.length > 0}>
        <div
          class={`transition-all duration-1000 delay-200 ${
            isLoaded()
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <GuestStats stats={stats()} totalGuests={props.guests.length} />
        </div>
      </Show>

      {/* Add/Edit Form */}
      <Show when={showAddForm()}>
        <div
          class={`transition-all duration-1000 delay-400 ${
            isLoaded()
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <GuestForm
            editingGuest={editingGuest()}
            onSubmit={editingGuest() ? handleUpdateGuest : handleAddGuest}
            onCancel={cancelForm}
          />
        </div>
      </Show>

      {/* Guest Cards */}
      <div
        class={`space-y-4 transition-all duration-1000 delay-600 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <Show when={props.guests.length === 0}>
          <div class="text-center py-16">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-100 shadow-lg max-w-md mx-auto">
              <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  class="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-medium text-gray-900 mb-2">
                No guests added yet
              </h3>
              <p class="text-gray-600 font-light mb-6">
                Add your first wedding guest to get started with invitations and
                RSVP tracking!
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Add Your First Guest
              </button>
            </div>
          </div>
        </Show>

        <For each={props.guests}>
          {(guest, index) => (
            <div
              class="transition-all duration-500"
              style={`animation-delay: ${index() * 100}ms`}
            >
              <GuestCard
                guest={guest}
                onEdit={startEdit}
                onDelete={props.deleteGuest}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default GuestList;

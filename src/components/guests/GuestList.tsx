import { createSignal, Component, For, Show } from "solid-js";
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
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Guest List</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm())}
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
        >
          {showAddForm() ? "Cancel" : "Add Guest"}
        </button>
      </div>

      <Show when={props.guests.length > 0}>
        <GuestStats stats={stats()} totalGuests={props.guests.length} />
      </Show>

      <Show when={showAddForm()}>
        <GuestForm
          editingGuest={editingGuest()}
          onSubmit={editingGuest() ? handleUpdateGuest : handleAddGuest}
          onCancel={cancelForm}
        />
      </Show>

      <div class="space-y-3">
        <Show when={props.guests.length === 0}>
          <div class="text-center py-12 text-gray-500">
            <div class="text-4xl mb-4">👥</div>
            <p class="text-lg font-medium mb-2">No guests added yet</p>
            <p>Add your first wedding guest above!</p>
          </div>
        </Show>

        <For each={props.guests}>
          {(guest) => (
            <GuestCard
              guest={guest}
              onEdit={startEdit}
              onDelete={props.deleteGuest}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default GuestList;

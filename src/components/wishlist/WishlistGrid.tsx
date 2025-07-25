import { Component, Show, For } from "solid-js";
import { WishlistItem as WishlistItemType } from "../../types";
import WishlistItem from "./WishlistItem";
import WishlistEmptyState from "./WishlistEmptyState";

interface WishlistGridProps {
  items: WishlistItemType[];
  onEditItem?: (item: WishlistItemType) => void;
  onDeleteItem?: (itemId: string) => void;
  onReserveItem?: (id: string, reservedBy: string, notes?: string) => void;
  mode?: "couple" | "guest";
}

const WishlistGrid: Component<WishlistGridProps> = (props) => {
  const mode = () => props.mode || "couple";
  const isGuestMode = () => mode() === "guest";

  const getEmptyStateMessage = () => {
    if (isGuestMode()) {
      return {
        title: "Wishlist Coming Soon",
        description:
          "The happy couple is still curating their perfect wishlist. Check back soon!",
      };
    }
    return {
      title: "No wishes yet",
      description:
        "Start building your dream wishlist by adding your first item.",
    };
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div class="animate-fade-in-up-delay-600">
      <Show when={props.items.length === 0}>
        <div class="text-center py-12">
          <div class="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center mb-4">
            <svg
              class="w-12 h-12 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <h3 class="text-xl font-light text-gray-700 mb-2">
            {emptyState.title}
          </h3>
          <p class="text-gray-500 font-light">{emptyState.description}</p>
        </div>
      </Show>

      <Show when={props.items.length > 0}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={props.items}>
            {(item) => (
              <WishlistItem
                item={item}
                onEdit={props.onEditItem}
                onDelete={props.onDeleteItem}
                onReserve={props.onReserveItem}
                mode={mode()}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default WishlistGrid;

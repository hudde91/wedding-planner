import { Component, Show, For } from "solid-js";
import { WishlistItem as WishlistItemType } from "../../types";
import WishlistItem from "./WishlistItem";
import WishlistEmptyState from "./WishlistEmptyState";

interface WishlistGridProps {
  items: WishlistItemType[];
  onEditItem: (item: WishlistItemType) => void;
  onDeleteItem: (itemId: string) => void;
}

const WishlistGrid: Component<WishlistGridProps> = (props) => {
  return (
    <div class="animate-fade-in-up-delay-600">
      <Show when={props.items.length === 0}>
        <WishlistEmptyState />
      </Show>

      <Show when={props.items.length > 0}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={props.items}>
            {(item) => (
              <WishlistItem
                item={item}
                onEdit={props.onEditItem}
                onDelete={props.onDeleteItem}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default WishlistGrid;

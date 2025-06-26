import { Component, createSignal, Show } from "solid-js";
import { WishlistItem, WishlistFormData } from "../../types";
import WishlistHero from "./WishlistHero";
import WishlistItemForm from "./WishlistItemForm";
import WishlistGrid from "./WishlistGrid";
import AddWishButton from "./AddWishButton";

interface WishlistProps {
  wishlistItems: WishlistItem[];
  onAddWishlistItem: (item: WishlistFormData) => void;
  onUpdateWishlistItem: (id: string, item: Partial<WishlistItem>) => void;
  onDeleteWishlistItem: (id: string) => void;
}

const Wishlist: Component<WishlistProps> = (props) => {
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editingItem, setEditingItem] = createSignal<WishlistItem | null>(null);

  const handleAddSubmit = (data: WishlistFormData) => {
    props.onAddWishlistItem(data);
    setShowAddForm(false);
  };

  const handleEditSubmit = (data: WishlistFormData) => {
    const item = editingItem();
    if (item) {
      props.onUpdateWishlistItem(item.id, data);
      setEditingItem(null);
    }
  };

  const handleStartEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleShowAddForm = () => {
    setShowAddForm(!showAddForm());
    setEditingItem(null);
  };

  // Convert WishlistItem to WishlistFormData for editing
  const getFormDataFromItem = (item: WishlistItem): WishlistFormData => ({
    title: item.title,
    price: item.price,
    currency: item.currency,
    image_url: item.image_url,
    product_url: item.product_url,
    notes: item.notes || "",
  });

  return (
    <div class="space-y-8">
      <WishlistHero />

      <AddWishButton onClick={handleShowAddForm} />

      <Show when={showAddForm()}>
        <WishlistItemForm
          onSubmit={handleAddSubmit}
          onCancel={handleCancelAdd}
          isEditing={false}
        />
      </Show>

      <Show when={editingItem()}>
        <WishlistItemForm
          initialData={getFormDataFromItem(editingItem()!)}
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
          isEditing={true}
        />
      </Show>

      <WishlistGrid
        items={props.wishlistItems}
        onEditItem={handleStartEdit}
        onDeleteItem={props.onDeleteWishlistItem}
      />
    </div>
  );
};

export default Wishlist;

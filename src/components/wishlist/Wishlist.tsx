import { Component, createSignal, Show } from "solid-js";
import { WishlistItem, WishlistFormData } from "../../types";
import WishlistHero from "./WishlistHero";
import WishlistItemForm from "./WishlistItemForm";
import WishlistGrid from "./WishlistGrid";
import AddWishButton from "./AddWishButton";

interface WishlistProps {
  wishlistItems: WishlistItem[];
  onAddWishlistItem?: (item: WishlistFormData) => void;
  onUpdateWishlistItem: (id: string, item: Partial<WishlistItem>) => void;
  onDeleteWishlistItem?: (id: string) => void;
  mode?: "couple" | "guest";
  coupleNames?: { name1: string; name2: string };
}

const Wishlist: Component<WishlistProps> = (props) => {
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editingItem, setEditingItem] = createSignal<WishlistItem | null>(null);
  const mode = () => props.mode || "couple";
  const isCoupleMode = () => mode() === "couple";

  const handleAddSubmit = (data: WishlistFormData) => {
    if (props.onAddWishlistItem) {
      props.onAddWishlistItem(data);
      setShowAddForm(false);
    }
  };

  const handleEditSubmit = (data: WishlistFormData) => {
    const item = editingItem();
    if (item) {
      props.onUpdateWishlistItem(item.id, data);
      setEditingItem(null);
    }
  };

  const handleStartEdit = (item: WishlistItem) => {
    if (isCoupleMode()) {
      setEditingItem(item);
      setShowAddForm(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleShowAddForm = () => {
    if (isCoupleMode()) {
      setShowAddForm(!showAddForm());
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (isCoupleMode() && props.onDeleteWishlistItem) {
      props.onDeleteWishlistItem(id);
    }
  };

  const handleReserveItem = (
    id: string,
    reservedBy: string,
    notes?: string
  ) => {
    props.onUpdateWishlistItem(id, {
      status: "reserved",
      reserved_by: reservedBy,
      reserved_at: new Date().toISOString(),
      notes: notes || undefined,
    });
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
      <WishlistHero mode={mode()} coupleNames={props.coupleNames} />

      {/* Only show add button in couple mode */}
      <Show when={isCoupleMode()}>
        <AddWishButton onClick={handleShowAddForm} />
      </Show>

      {/* Only show add form in couple mode */}
      <Show when={showAddForm() && isCoupleMode()}>
        <WishlistItemForm
          onSubmit={handleAddSubmit}
          onCancel={handleCancelAdd}
          isEditing={false}
        />
      </Show>

      {/* Only show edit form in couple mode */}
      <Show when={editingItem() && isCoupleMode()}>
        <WishlistItemForm
          initialData={getFormDataFromItem(editingItem()!)}
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
          isEditing={true}
        />
      </Show>

      <WishlistGrid
        items={props.wishlistItems}
        onEditItem={isCoupleMode() ? handleStartEdit : undefined}
        onDeleteItem={isCoupleMode() ? handleDeleteItem : undefined}
        onReserveItem={!isCoupleMode() ? handleReserveItem : undefined}
        mode={mode()}
      />
    </div>
  );
};

export default Wishlist;

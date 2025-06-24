import { Component, createSignal, Show, For } from "solid-js";
import { WishlistItem, WishlistFormData } from "../../types";
import { formatCurrency } from "../../utils/currency";

interface WishlistProps {
  wishlistItems: WishlistItem[];
  onAddWishlistItem: (item: WishlistFormData) => void;
  onUpdateWishlistItem: (id: string, item: Partial<WishlistItem>) => void;
  onDeleteWishlistItem: (id: string) => void;
}

const Wishlist: Component<WishlistProps> = (props) => {
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [editingItem, setEditingItem] = createSignal<string | null>(null);
  const [newItem, setNewItem] = createSignal<WishlistFormData>({
    title: "",
    price: 0,
    currency: "USD",
    image_url: "",
    product_url: "",
    notes: "",
  });
  const [editItem, setEditItem] = createSignal<WishlistFormData>({
    title: "",
    price: 0,
    currency: "USD",
    image_url: "",
    product_url: "",
    notes: "",
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const item = newItem();
    if (item.title) {
      props.onAddWishlistItem(item);
      setNewItem({
        title: "",
        price: 0,
        currency: "USD",
        image_url: "",
        product_url: "",
        notes: "",
      });
      setShowAddForm(false);
    }
  };

  const handleEditSubmit = (e: Event) => {
    e.preventDefault();
    const itemId = editingItem();
    const item = editItem();
    if (itemId && item.title) {
      props.onUpdateWishlistItem(itemId, item);
      setEditingItem(null);
      setEditItem({
        title: "",
        price: 0,
        currency: "USD",
        image_url: "",
        product_url: "",
        notes: "",
      });
    }
  };

  const startEdit = (item: WishlistItem) => {
    setEditItem({
      title: item.title,
      price: item.price,
      currency: item.currency,
      image_url: item.image_url,
      product_url: item.product_url,
      notes: item.notes || "",
    });
    setEditingItem(item.id);
    setShowAddForm(false); // Close add form when opening edit form
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditItem({
      title: "",
      price: 0,
      currency: "USD",
      image_url: "",
      product_url: "",
      notes: "",
    });
  };

  const handleDelete = (itemId: string) => {
    if (
      confirm("Are you sure you want to remove this item from your wishlist?")
    ) {
      props.onDeleteWishlistItem(itemId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "reserved":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "purchased":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div class="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 via-white to-rose-100 border border-purple-200/50 shadow-xl">
        {/* Background Pattern */}
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-600 opacity-10"></div>
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern
                id="gift-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect width="20" height="20" fill="none" />
                <path
                  d="M10 2L10 18M2 10L18 10"
                  stroke="currentColor"
                  stroke-width="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gift-pattern)" />
          </svg>
        </div>

        {/* Content */}
        <div class="relative z-10 p-8 md:p-12">
          <div class="max-w-3xl">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  class="w-8 h-8 text-white"
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
              <div>
                <h1 class="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
                  Wedding Wishlist
                </h1>
                <p class="text-lg text-gray-600 font-light mt-2">
                  Share your dreams with those who care about you most
                </p>
              </div>
            </div>
            <p class="text-gray-600 font-light leading-relaxed max-w-2xl">
              Create a beautiful collection of gifts that would make your
              special day even more memorable. Your guests will love being able
              to choose something that truly brings you joy.
            </p>
          </div>
        </div>

        {/* Decorative Gift Box */}
        <div class="absolute top-8 right-8 w-24 h-24 opacity-10">
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            class="text-purple-400"
          >
            <rect x="20" y="40" width="60" height="40" rx="4" />
            <rect x="15" y="35" width="70" height="10" rx="2" />
            <rect x="45" y="20" width="10" height="25" />
            <path
              d="M35 35 Q45 25 50 35 Q55 25 65 35"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Add Button */}
      <div class="animate-fade-in-up-delay-200 flex justify-end">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm());
            setEditingItem(null); // Close edit form when opening add form
          }}
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg hover:from-purple-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl font-light tracking-wide"
        >
          <span class="flex items-center space-x-2">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add New Wish</span>
          </span>
        </button>
      </div>

      {/* Add Form */}
      <Show when={showAddForm()}>
        <div class="animate-fade-in-up-delay-400 bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit} class="space-y-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Add New Wish</h3>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={newItem().title}
                  onInput={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      title: e.currentTarget.value,
                    }))
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                  placeholder="Beautiful dining set, cozy throw pillows..."
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Price
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem().price}
                    onInput={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        price: parseFloat(e.currentTarget.value) || 0,
                      }))
                    }
                    class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Product URL
              </label>
              <input
                type="url"
                value={newItem().product_url}
                onInput={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    product_url: e.currentTarget.value,
                  }))
                }
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                placeholder="https://store.com/product-link"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Image URL
              </label>
              <input
                type="url"
                value={newItem().image_url}
                onInput={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    image_url: e.currentTarget.value,
                  }))
                }
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Notes
              </label>
              <textarea
                value={newItem().notes}
                onInput={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    notes: e.currentTarget.value,
                  }))
                }
                rows={3}
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light resize-none"
                placeholder="Any additional notes or preferences..."
              />
            </div>

            <div class="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg hover:from-purple-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl font-light"
              >
                Add to Wishlist
              </button>
            </div>
          </form>
        </div>
      </Show>

      {/* Edit Form */}
      <Show when={editingItem()}>
        <div class="animate-fade-in-up-delay-400 bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
          <form onSubmit={handleEditSubmit} class="space-y-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Edit Wish</h3>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={editItem().title}
                  onInput={(e) =>
                    setEditItem((prev) => ({
                      ...prev,
                      title: e.currentTarget.value,
                    }))
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                  placeholder="Beautiful dining set, cozy throw pillows..."
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Price
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editItem().price}
                    onInput={(e) =>
                      setEditItem((prev) => ({
                        ...prev,
                        price: parseFloat(e.currentTarget.value) || 0,
                      }))
                    }
                    class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Product URL
              </label>
              <input
                type="url"
                value={editItem().product_url}
                onInput={(e) =>
                  setEditItem((prev) => ({
                    ...prev,
                    product_url: e.currentTarget.value,
                  }))
                }
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                placeholder="https://store.com/product-link"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Image URL
              </label>
              <input
                type="url"
                value={editItem().image_url}
                onInput={(e) =>
                  setEditItem((prev) => ({
                    ...prev,
                    image_url: e.currentTarget.value,
                  }))
                }
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Notes
              </label>
              <textarea
                value={editItem().notes}
                onInput={(e) =>
                  setEditItem((prev) => ({
                    ...prev,
                    notes: e.currentTarget.value,
                  }))
                }
                rows={3}
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light resize-none"
                placeholder="Any additional notes or preferences..."
              />
            </div>

            <div class="flex justify-end space-x-4">
              <button
                type="button"
                onClick={cancelEdit}
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg hover:from-purple-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl font-light"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Show>

      {/* Wishlist Items Grid */}
      <div class="animate-fade-in-up-delay-600">
        <Show when={props.wishlistItems.length === 0}>
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
            <h3 class="text-xl font-light text-gray-700 mb-2">No wishes yet</h3>
            <p class="text-gray-500 font-light">
              Start building your dream wishlist by adding your first item.
            </p>
          </div>
        </Show>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={props.wishlistItems}>
            {(item) => (
              <div class="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image */}
                <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <Show
                    when={item.image_url}
                    fallback={
                      <div class="absolute inset-0 flex items-center justify-center">
                        <svg
                          class="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    }
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Show>

                  {/* Status Badge */}
                  <div class="absolute top-3 right-3">
                    <div
                      class={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )} shadow-sm`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div class="p-6 space-y-4">
                  {/* Header with title and action buttons */}
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-gray-900 mb-2 line-clamp-2 pr-4">
                        {item.title}
                      </h3>
                      <Show when={item.notes && item.notes.trim()}>
                        <p class="text-sm text-gray-600 font-light line-clamp-2 leading-relaxed">
                          {item.notes}
                        </p>
                      </Show>
                    </div>

                    {/* Action buttons */}
                    <div class="flex space-x-2 ml-2">
                      <button
                        onClick={() => startEdit(item)}
                        class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                        title="Edit item"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete item"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="text-2xl font-light text-gray-900">
                    {formatCurrency(item.price)}
                  </div>

                  <Show when={item.product_url}>
                    <a
                      href={item.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200 font-light"
                    >
                      <span>View Product</span>
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </Show>

                  <Show when={item.reserved_by}>
                    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p class="text-sm text-amber-800 font-light">
                        Reserved by{" "}
                        <span class="font-medium">{item.reserved_by}</span>
                      </p>
                    </div>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

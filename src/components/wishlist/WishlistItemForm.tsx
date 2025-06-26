import { Component, createSignal } from "solid-js";
import { WishlistFormData } from "../../types";

interface WishlistItemFormProps {
  initialData?: WishlistFormData;
  isEditing?: boolean;
  onSubmit: (data: WishlistFormData) => void;
  onCancel: () => void;
}

const WishlistItemForm: Component<WishlistItemFormProps> = (props) => {
  const [formData, setFormData] = createSignal<WishlistFormData>(
    props.initialData || {
      title: "",
      price: 0,
      currency: "USD",
      image_url: "",
      product_url: "",
      notes: "",
    }
  );

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const data = formData();
    if (data.title.trim()) {
      props.onSubmit(data);
    }
  };

  const updateField = (field: keyof WishlistFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div class="animate-fade-in-up-delay-400 bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
      <form onSubmit={handleSubmit} class="space-y-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {props.isEditing ? "Edit Wish" : "Add New Wish"}
          </h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 tracking-wide">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={formData().title}
              onInput={(e) => updateField("title", e.currentTarget.value)}
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
                value={formData().price}
                onInput={(e) =>
                  updateField("price", parseFloat(e.currentTarget.value) || 0)
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
            value={formData().product_url}
            onInput={(e) => updateField("product_url", e.currentTarget.value)}
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
            value={formData().image_url}
            onInput={(e) => updateField("image_url", e.currentTarget.value)}
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 tracking-wide">
            Notes
          </label>
          <textarea
            value={formData().notes}
            onInput={(e) => updateField("notes", e.currentTarget.value)}
            rows={3}
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-light resize-none"
            placeholder="Any additional notes or preferences..."
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            onClick={props.onCancel}
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-light"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg hover:from-purple-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl font-light"
          >
            {props.isEditing ? "Save Changes" : "Add to Wishlist"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WishlistItemForm;

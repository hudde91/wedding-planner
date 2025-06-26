import { Component } from "solid-js";

const WishlistEmptyState: Component = () => {
  return (
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
  );
};

export default WishlistEmptyState;

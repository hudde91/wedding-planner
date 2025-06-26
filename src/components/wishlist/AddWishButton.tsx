import { Component } from "solid-js";

interface AddWishButtonProps {
  onClick: () => void;
}

const AddWishButton: Component<AddWishButtonProps> = (props) => {
  return (
    <div class="animate-fade-in-up-delay-200 flex justify-end">
      <button
        onClick={props.onClick}
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
  );
};

export default AddWishButton;

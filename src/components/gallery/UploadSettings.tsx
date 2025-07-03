import { Component, Accessor, Setter } from "solid-js";
import type { MediaCategory, MediaUploadData } from "../../types";

interface UploadSettingsProps {
  uploadData: Accessor<MediaUploadData>;
  setUploadData: Setter<MediaUploadData>;
}

const UploadSettings: Component<UploadSettingsProps> = (props) => {
  const categories: {
    id: MediaCategory;
    label: string;
    description: string;
  }[] = [
    {
      id: "ceremony",
      label: "Ceremony",
      description: "Wedding ceremony photos",
    },
    {
      id: "reception",
      label: "Reception",
      description: "Reception and dinner",
    },
    {
      id: "preparation",
      label: "Getting Ready",
      description: "Pre-wedding preparation",
    },
    {
      id: "portraits",
      label: "Portraits",
      description: "Couple and family portraits",
    },
    { id: "party", label: "Party", description: "Dancing and celebration" },
    { id: "other", label: "Other", description: "Other wedding moments" },
  ];

  return (
    <div class="space-y-4 lg:space-y-6">
      <h3 class="text-lg lg:text-xl font-medium text-gray-900">
        Upload Settings
      </h3>

      <div class="space-y-4">
        {/* Category Selection */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div class="relative">
            <select
              value={props.uploadData().category}
              onChange={(e) =>
                props.setUploadData((prev) => ({
                  ...prev,
                  category: e.target.value as MediaCategory,
                }))
              }
              class="w-full px-4 py-3 lg:py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light appearance-none cursor-pointer pr-10 text-mobile-readable"
            >
              {categories.map((category) => (
                <option value={category.id}>{category.label}</option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {
              categories.find((cat) => cat.id === props.uploadData().category)
                ?.description
            }
          </p>
        </div>

        {/* Uploaded By */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={props.uploadData().uploadedBy}
            onInput={(e) =>
              props.setUploadData((prev) => ({
                ...prev,
                uploadedBy: (e.target as HTMLInputElement).value,
              }))
            }
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/50 backdrop-blur-sm text-mobile-readable"
            placeholder="Enter your name"
          />
          <p class="text-xs text-gray-500 mt-1">
            This will be shown with your uploaded photos
          </p>
        </div>

        {/* Caption */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Caption <span class="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={props.uploadData().caption || ""}
            onInput={(e) =>
              props.setUploadData((prev) => ({
                ...prev,
                caption: (e.target as HTMLTextAreaElement).value,
              }))
            }
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/50 backdrop-blur-sm resize-none text-mobile-readable"
            rows="3"
            placeholder="Add a caption for these photos..."
          />
          <p class="text-xs text-gray-500 mt-1">
            Describe the moment or add context to your photos
          </p>
        </div>

        {/* Quick category buttons for mobile */}
        <div class="lg:hidden">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Quick Select
          </label>
          <div class="grid grid-cols-2 gap-2">
            {categories.slice(0, 4).map((category) => (
              <button
                type="button"
                onClick={() =>
                  props.setUploadData((prev) => ({
                    ...prev,
                    category: category.id,
                  }))
                }
                class={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 touch-manipulation ${
                  props.uploadData().category === category.id
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSettings;

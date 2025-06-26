import { Component, Accessor, Setter } from "solid-js";
import type { MediaCategory, MediaUploadData } from "../../types";

interface UploadSettingsProps {
  uploadData: Accessor<MediaUploadData>;
  setUploadData: Setter<MediaUploadData>;
}

const UploadSettings: Component<UploadSettingsProps> = (props) => {
  const categories: { id: MediaCategory; label: string }[] = [
    { id: "ceremony", label: "Ceremony" },
    { id: "reception", label: "Reception" },
    { id: "preparation", label: "Getting Ready" },
    { id: "portraits", label: "Portraits" },
    { id: "party", label: "Party" },
    { id: "other", label: "Other" },
  ];

  return (
    <div class="space-y-6">
      <h3 class="text-xl font-medium text-gray-900">Upload Settings</h3>

      <div class="space-y-4">
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
              class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light appearance-none cursor-pointer pr-10"
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
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Uploaded By
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
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/50 backdrop-blur-sm"
            placeholder="Your name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Caption (Optional)
          </label>
          <textarea
            value={props.uploadData().caption || ""}
            onInput={(e) =>
              props.setUploadData((prev) => ({
                ...prev,
                caption: (e.target as HTMLTextAreaElement).value,
              }))
            }
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/50 backdrop-blur-sm resize-none"
            rows="3"
            placeholder="Add a caption for these photos..."
          />
        </div>
      </div>
    </div>
  );
};

export default UploadSettings;

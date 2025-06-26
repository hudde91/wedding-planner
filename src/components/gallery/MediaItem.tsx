import { Component, Show } from "solid-js";
import type { MediaItem as MediaItemType, MediaCategory } from "../../types";

interface MediaItemProps {
  item: MediaItemType;
  imageUrl: string;
  onItemClick: (item: MediaItemType) => void;
}

const MediaItem: Component<MediaItemProps> = (props) => {
  const categories: { id: MediaCategory; label: string }[] = [
    { id: "ceremony", label: "Ceremony" },
    { id: "reception", label: "Reception" },
    { id: "preparation", label: "Getting Ready" },
    { id: "portraits", label: "Portraits" },
    { id: "candid", label: "Candid" },
    { id: "other", label: "Other" },
  ];

  const getCategoryLabel = (category: MediaCategory): string => {
    return categories.find((cat) => cat.id === category)?.label || category;
  };

  return (
    <div class="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 break-inside-avoid">
      <div class="relative aspect-square overflow-hidden">
        <img
          src={props.imageUrl}
          alt={props.item.originalName}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => props.onItemClick(props.item)}
        />

        {/* Video indicator */}
        <Show when={props.item.type === "video"}>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-black/60 rounded-full p-3">
              <svg
                class="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </Show>

        {/* Favorite indicator */}
        <Show when={props.item.isFavorite}>
          <div class="absolute top-3 right-3">
            <svg class="w-5 h-5 text-rose-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </Show>

        {/* Overlay on hover */}
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
          <div class="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Show when={props.item.caption}>
              <p class="text-sm font-medium mb-1">{props.item.caption}</p>
            </Show>
            <p class="text-xs opacity-80">
              {new Date(props.item.uploadedAt).toLocaleDateString()} •{" "}
              {props.item.uploadedBy}
            </p>
          </div>
        </div>
      </div>

      {/* Category badge */}
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 text-xs font-medium rounded-full bg-white/80 backdrop-blur-sm text-gray-700">
          {getCategoryLabel(props.item.category)}
        </span>
      </div>
    </div>
  );
};

export default MediaItem;

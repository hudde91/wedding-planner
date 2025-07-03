import { Component, Show } from "solid-js";
import type { MediaItem as MediaItemType, MediaCategory } from "../../types";

interface MediaItemProps {
  item: MediaItemType;
  imageUrl: string;
  onItemClick: (item: MediaItemType) => void;
  viewMode?: "grid" | "masonry";
}

const MediaItem: Component<MediaItemProps> = (props) => {
  const categories: { id: MediaCategory; label: string }[] = [
    { id: "ceremony", label: "Ceremony" },
    { id: "reception", label: "Reception" },
    { id: "preparation", label: "Getting Ready" },
    { id: "portraits", label: "Portraits" },
    { id: "party", label: "Party" },
    { id: "other", label: "Other" },
  ];

  const getCategoryLabel = (category: MediaCategory): string => {
    return categories.find((cat) => cat.id === category)?.label || category;
  };

  return (
    <div
      class="group relative bg-white rounded-lg lg:rounded-xl overflow-hidden shadow-md lg:shadow-lg hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 break-inside-avoid cursor-pointer touch-manipulation"
      onClick={() => props.onItemClick(props.item)}
    >
      <div
        class={`relative overflow-hidden ${
          props.viewMode === "grid" ? "aspect-square" : ""
        }`}
      >
        <img
          src={props.imageUrl}
          alt={props.item.originalName}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Video indicator */}
        <Show when={props.item.type === "video"}>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-black/60 rounded-full p-2 lg:p-3">
              <svg
                class="w-4 h-4 lg:w-6 lg:h-6 text-white"
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
          <div class="absolute top-2 right-2 lg:top-3 lg:right-3">
            <svg
              class="w-4 h-4 lg:w-5 lg:h-5 text-rose-400 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </Show>

        {/* Mobile-friendly overlay */}
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 lg:group-hover:opacity-100 transition-all duration-300">
          <div class="absolute bottom-0 left-0 right-0 p-2 lg:p-4 text-white">
            <Show when={props.item.caption}>
              <p class="text-xs lg:text-sm font-medium mb-1 line-clamp-2">
                {props.item.caption}
              </p>
            </Show>
            <div class="flex items-center justify-between">
              <p class="text-xs opacity-80 truncate flex-1">
                {props.item.uploadedBy}
              </p>
              <p class="text-xs opacity-80 ml-2">
                {new Date(props.item.uploadedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Touch indicator for mobile */}
        <div class="lg:hidden absolute top-2 left-2">
          <div class="w-1 h-1 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Category badge */}
      <div class="absolute top-2 left-2 lg:top-3 lg:left-3">
        <span class="px-2 py-1 text-xs font-medium rounded-full bg-white/80 backdrop-blur-sm text-gray-700">
          {getCategoryLabel(props.item.category)}
        </span>
      </div>

      {/* Mobile info bar - always visible on mobile */}
      <div class="lg:hidden bg-white/95 backdrop-blur-sm p-2 border-t border-gray-100">
        <Show
          when={props.item.caption}
          fallback={
            <p class="text-xs text-gray-600 truncate">
              {props.item.originalName}
            </p>
          }
        >
          <p class="text-xs font-medium text-gray-900 truncate">
            {props.item.caption}
          </p>
        </Show>
        <div class="flex items-center justify-between mt-1">
          <p class="text-xs text-gray-500 truncate flex-1">
            {props.item.uploadedBy}
          </p>
          <p class="text-xs text-gray-400 ml-2">
            {new Date(props.item.uploadedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaItem;

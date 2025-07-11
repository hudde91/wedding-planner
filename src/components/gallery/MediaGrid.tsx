import { Component, For, Show, Accessor } from "solid-js";
import type { MediaItem } from "../../types";
import MediaItemComponent from "./MediaItem";

interface MediaGridProps {
  mediaItems: MediaItem[];
  mediaUrls: Accessor<Map<string, string>>;
  viewMode: Accessor<"grid" | "masonry">;
  onItemClick: (item: MediaItem) => void;
}

const MediaGrid: Component<MediaGridProps> = (props) => {
  return (
    <Show
      when={props.mediaItems.length > 0}
      fallback={
        <div class="animate-fade-in-up-delay-600 text-center py-12 lg:py-16">
          <svg
            class="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-3 lg:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 class="text-lg lg:text-xl font-medium text-gray-500 mb-2">
            No photos yet
          </h3>
          <p class="text-sm lg:text-base text-gray-400">
            Upload your first wedding photos to get started!
          </p>
        </div>
      }
    >
      <div
        class={`animate-fade-in-up-delay-600 ${
          props.viewMode() === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
            : "columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 lg:gap-6 space-y-3 sm:space-y-4 lg:space-y-6"
        }`}
      >
        <For each={props.mediaItems}>
          {(item) => (
            <MediaItemComponent
              item={item}
              imageUrl={
                props.mediaUrls().get(item.id) ||
                "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Loading..."
              }
              onItemClick={props.onItemClick}
              viewMode={props.viewMode()}
            />
          )}
        </For>
      </div>
    </Show>
  );
};

export default MediaGrid;

import { Component, Show, onMount, onCleanup } from "solid-js";
import type { MediaItem } from "../../types";

interface MediaModalProps {
  selectedMedia: MediaItem | null;
  mediaUrl: string;
  onClose: () => void;
}

const MediaModal: Component<MediaModalProps> = (props) => {
  // Handle escape key and prevent body scroll
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && props.selectedMedia) {
        props.onClose();
      }
    };

    const preventScroll = (e: TouchEvent) => {
      if (props.selectedMedia) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchmove", preventScroll, { passive: false });

    // Prevent body scroll when modal is open
    if (props.selectedMedia) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchmove", preventScroll);
      document.body.style.overflow = "unset";
    };
  });

  onCleanup(() => {
    document.body.style.overflow = "unset";
  });

  return (
    <Show when={props.selectedMedia}>
      <div
        class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center safe-area-top safe-area-bottom"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            props.onClose();
          }
        }}
      >
        {/* Mobile-first modal container */}
        <div class="relative w-full h-full lg:w-auto lg:h-auto lg:max-w-6xl lg:max-h-[90vh] bg-black lg:bg-white lg:rounded-xl overflow-hidden flex flex-col">
          {/* Close button */}
          <button
            onClick={props.onClose}
            class="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 lg:p-3 transition-colors duration-300 touch-manipulation"
          >
            <svg
              class="w-5 h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Media container */}
          <div class="flex-1 flex items-center justify-center p-4 lg:p-0">
            <Show when={props.selectedMedia?.type === "image"}>
              <img
                src={props.mediaUrl}
                alt={props.selectedMedia!.originalName}
                class="w-full h-full lg:w-auto lg:h-auto max-w-full max-h-full object-contain"
              />
            </Show>

            <Show when={props.selectedMedia?.type === "video"}>
              <video
                src={props.mediaUrl}
                controls
                class="w-full h-full lg:w-auto lg:h-auto max-w-full max-h-full"
                autoplay={false}
              />
            </Show>
          </div>

          {/* Media info - Mobile bottom sheet style */}
          <div class="bg-white lg:bg-white p-4 lg:p-6 border-t border-gray-200 lg:border-t-0">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-base lg:text-lg font-medium text-gray-900 truncate">
                  {props.selectedMedia!.originalName}
                </h3>
                <Show when={props.selectedMedia!.caption}>
                  <p class="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2 line-clamp-3">
                    {props.selectedMedia!.caption}
                  </p>
                </Show>
              </div>

              {/* Favorite indicator */}
              <Show when={props.selectedMedia!.isFavorite}>
                <svg
                  class="w-5 h-5 text-rose-400 fill-current ml-3 flex-shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </Show>
            </div>

            {/* Meta information */}
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
              <div class="flex items-center space-x-4">
                <span class="font-medium">
                  {props.selectedMedia!.uploadedBy}
                </span>
                <span>
                  {new Date(props.selectedMedia!.uploadedAt).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div class="flex items-center space-x-4">
                <span class="capitalize">{props.selectedMedia!.category}</span>
                <span class="text-xs text-gray-400">
                  {props.selectedMedia!.type.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Tags if available */}
            <Show
              when={
                props.selectedMedia!.tags &&
                props.selectedMedia!.tags.length > 0
              }
            >
              <div class="mt-3 flex flex-wrap gap-2">
                {props.selectedMedia!.tags?.map((tag) => (
                  <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </Show>
          </div>

          {/* Mobile swipe indicator */}
          <div class="lg:hidden absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </Show>
  );
};

export default MediaModal;

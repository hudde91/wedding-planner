import { Component, Show } from "solid-js";
import type { MediaItem } from "../../types";

interface MediaModalProps {
  selectedMedia: MediaItem | null;
  mediaUrl: string;
  onClose: () => void;
}

const MediaModal: Component<MediaModalProps> = (props) => {
  return (
    <Show when={props.selectedMedia}>
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="relative max-w-4xl max-h-full bg-white rounded-xl overflow-hidden">
          <button
            onClick={props.onClose}
            class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-300"
          >
            <svg
              class="w-6 h-6"
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

          <Show when={props.selectedMedia?.type === "image"}>
            <img
              src={props.mediaUrl}
              alt={props.selectedMedia!.originalName}
              class="w-full h-auto max-h-[80vh] object-contain"
            />
          </Show>

          <Show when={props.selectedMedia?.type === "video"}>
            <video
              src={props.mediaUrl}
              controls
              class="w-full h-auto max-h-[80vh]"
            />
          </Show>

          <div class="p-6 bg-white">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {props.selectedMedia!.originalName}
            </h3>
            <Show when={props.selectedMedia!.caption}>
              <p class="text-gray-600 mb-3">{props.selectedMedia!.caption}</p>
            </Show>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>{props.selectedMedia!.uploadedBy}</span>
              <span>
                {new Date(props.selectedMedia!.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default MediaModal;

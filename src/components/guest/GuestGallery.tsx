import { Component } from "solid-js";
import type { MediaItem, MediaUploadData } from "../../types";
import Gallery from "../gallery/Gallery";

interface GuestGalleryProps {
  mediaItems: MediaItem[];
  onAddMedia: (files: File[], uploadData: MediaUploadData) => Promise<void>;
}

const GuestGallery: Component<GuestGalleryProps> = (props) => {
  // For guests, we don't allow media updates or deletions
  const handleUpdateMedia = (id: string, updates: Partial<MediaItem>) => {
    // Guests cannot update media metadata
    console.log("Guests cannot update media");
  };

  const handleDeleteMedia = async (id: string) => {
    // Guests cannot delete media
    console.log("Guests cannot delete media");
  };

  return (
    <div class="space-y-4 sm:space-y-6">
      {/* Guest-specific instructions */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-rose-100/50 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-400 to-purple-400 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg sm:text-xl font-medium text-gray-800 mb-2">
              Share Your Wedding Memories
            </h3>
            <p class="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
              Help us capture every special moment! Upload your favorite photos
              from the wedding to share with the happy couple and other guests.
              No account required - just your name and beautiful memories.
            </p>
          </div>
        </div>
      </div>

      {/* Use the existing Gallery component */}
      <Gallery
        mediaItems={props.mediaItems}
        onAddMedia={props.onAddMedia}
        onUpdateMedia={handleUpdateMedia}
        onDeleteMedia={handleDeleteMedia}
      />
    </div>
  );
};

export default GuestGallery;

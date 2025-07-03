import {
  Component,
  createSignal,
  createMemo,
  onMount,
  onCleanup,
} from "solid-js";
// Updated import for Tauri 2.0
import { invoke } from "@tauri-apps/api/core";
import type { MediaItem, MediaCategory, MediaUploadData } from "../../types";

// Import child components
import MediaUploadArea from "./MediaUploadArea";
import UploadSettings from "./UploadSettings";
import MediaFilters from "./MediaFilters";
import MediaGrid from "./MediaGrid";
import MediaModal from "./MediaModal";
import GalleryStats from "./GalleryStats";

interface GalleryProps {
  mediaItems: MediaItem[];
  onAddMedia: (files: File[], uploadData: MediaUploadData) => void;
  onUpdateMedia: (id: string, updates: Partial<MediaItem>) => void;
  onDeleteMedia: (id: string) => void;
}

const Gallery: Component<GalleryProps> = (props) => {
  // State for UI controls
  const [selectedCategory, setSelectedCategory] = createSignal<
    MediaCategory | "all"
  >("all");
  const [viewMode, setViewMode] = createSignal<"grid" | "masonry">("masonry");
  const [selectedMedia, setSelectedMedia] = createSignal<MediaItem | null>(
    null
  );
  const [searchQuery, setSearchQuery] = createSignal("");

  // Upload state
  const [uploadData, setUploadData] = createSignal<MediaUploadData>({
    category: "ceremony",
    uploadedBy: "",
    caption: "",
    tags: [],
  });

  // Media URL management - using a simple approach
  const [mediaUrls, setMediaUrls] = createSignal<Map<string, string>>(
    new Map()
  );
  let urlCleanupSet = new Set<string>();

  // Load URLs for media items
  const loadMediaUrls = async (items: MediaItem[]) => {
    const urlMap = new Map<string, string>();

    for (const item of items) {
      try {
        const fileData = await invoke<number[]>("get_media_file_data", {
          filename: item.filename,
        });

        // Convert the array of numbers to Uint8Array
        const uint8Array = new Uint8Array(fileData);

        // Determine MIME type from file extension
        const ext = item.originalName.split(".").pop()?.toLowerCase() || "";
        let mimeType = "application/octet-stream";

        if (["jpg", "jpeg"].includes(ext)) {
          mimeType = "image/jpeg";
        } else if (ext === "png") {
          mimeType = "image/png";
        } else if (ext === "gif") {
          mimeType = "image/gif";
        } else if (ext === "webp") {
          mimeType = "image/webp";
        } else if (["mp4", "mov", "avi", "mkv"].includes(ext)) {
          mimeType = "video/mp4";
        }

        // Create a blob from the data
        const blob = new Blob([uint8Array], { type: mimeType });

        // Create object URL
        const url = URL.createObjectURL(blob);
        urlMap.set(item.id, url);
        urlCleanupSet.add(url);
      } catch (error) {
        console.error(`Failed to load data for ${item.filename}:`, error);
        // Set fallback URL
        const fallbackUrl =
          item.type === "video"
            ? "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Video"
            : "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Image+Not+Found";
        urlMap.set(item.id, fallbackUrl);
      }
    }

    return urlMap;
  };

  // Load media URLs when component mounts and when items change
  onMount(async () => {
    if (props.mediaItems.length > 0) {
      const urls = await loadMediaUrls(props.mediaItems);
      setMediaUrls(urls);
    }
  });

  // Watch for changes in media items (manual tracking to avoid reactive loops)
  let lastItemCount = 0;
  const checkForChanges = async () => {
    if (props.mediaItems.length !== lastItemCount) {
      lastItemCount = props.mediaItems.length;

      // Clean up old URLs
      urlCleanupSet.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      urlCleanupSet.clear();

      // Load new URLs
      const urls = await loadMediaUrls(props.mediaItems);
      setMediaUrls(urls);
    }
  };

  // Check for changes periodically
  const interval = setInterval(checkForChanges, 1000);

  // Cleanup on unmount
  onCleanup(() => {
    clearInterval(interval);
    urlCleanupSet.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  });

  // Filter media items
  const filteredMedia = createMemo(() => {
    let items = props.mediaItems;

    if (selectedCategory() !== "all") {
      items = items.filter((item) => item.category === selectedCategory());
    }

    if (searchQuery().trim()) {
      const query = searchQuery().toLowerCase();
      items = items.filter(
        (item) =>
          item.originalName.toLowerCase().includes(query) ||
          item.caption?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return items.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  });

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length > 0) {
      props.onAddMedia(validFiles, uploadData());
    }
  };

  const handleItemClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  // Close modal
  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div class="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 via-white to-rose-100 border border-purple-200/50 shadow-xl">
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=400&fit=crop&auto=format"
            alt="Wedding photography"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 p-8 md:p-12">
          <div class="max-w-4xl">
            <h1 class="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
              Wedding Gallery
            </h1>
            <p class="text-lg text-gray-600 font-light leading-relaxed mb-6">
              Preserve your precious moments and share them with loved ones.
              Upload and organize your wedding photos and videos in one
              beautiful place.
            </p>

            <GalleryStats mediaItems={props.mediaItems} />
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div class="animate-fade-in-up-delay-200 bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Upload Media</h3>
            <MediaUploadArea onFilesSelected={handleFileUpload} />
          </div>

          {/* Upload Settings */}
          <UploadSettings
            uploadData={uploadData}
            setUploadData={setUploadData}
          />
        </div>
      </div>

      {/* Filters and Search */}
      <div class="animate-fade-in-up-delay-400">
        <MediaFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Media Grid */}
      <MediaGrid
        mediaItems={filteredMedia()}
        mediaUrls={mediaUrls}
        viewMode={viewMode}
        onItemClick={handleItemClick}
      />

      {/* Media Modal */}
      <MediaModal
        selectedMedia={selectedMedia()}
        mediaUrl={
          selectedMedia() ? mediaUrls().get(selectedMedia()!.id) || "" : ""
        }
        onClose={closeModal}
      />
    </div>
  );
};

export default Gallery;

import { Component } from "solid-js";
import type { MediaItem } from "../../types";

interface GalleryStatsProps {
  mediaItems: MediaItem[];
}

const GalleryStats: Component<GalleryStatsProps> = (props) => {
  const totalItems = () => props.mediaItems.length;
  const photoCount = () =>
    props.mediaItems.filter((item) => item.type === "image").length;
  const videoCount = () =>
    props.mediaItems.filter((item) => item.type === "video").length;

  return (
    <div class="flex flex-wrap gap-4">
      <div class="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/50">
        <div class="text-2xl font-light text-gray-900">{totalItems()}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wide">
          Total Items
        </div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/50">
        <div class="text-2xl font-light text-gray-900">{photoCount()}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wide">Photos</div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/50">
        <div class="text-2xl font-light text-gray-900">{videoCount()}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wide">Videos</div>
      </div>
    </div>
  );
};

export default GalleryStats;

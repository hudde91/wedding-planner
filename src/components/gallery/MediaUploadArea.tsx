import { Component, createSignal } from "solid-js";

interface MediaUploadAreaProps {
  onFilesSelected: (files: FileList) => void;
}

const MediaUploadArea: Component<MediaUploadAreaProps> = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      props.onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      props.onFilesSelected(target.files);
    }
  };

  return (
    <div
      class={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        isDragging()
          ? "border-purple-400 bg-purple-50/80"
          : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/40"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
      />

      <svg
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      <div class="space-y-2">
        <p class="text-lg font-medium text-gray-700">
          Drop photos and videos here
        </p>
        <p class="text-sm text-gray-500">or click to browse your files</p>
        <p class="text-xs text-gray-400">Supports: JPG, PNG, GIF, MP4, MOV</p>
      </div>
    </div>
  );
};

export default MediaUploadArea;

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
      class={`relative border-2 border-dashed rounded-lg lg:rounded-xl p-6 lg:p-8 text-center transition-all duration-300 touch-manipulation ${
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

      {/* Upload icon */}
      <div class="flex flex-col items-center space-y-3 lg:space-y-4">
        <div class="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <svg
            class="w-6 h-6 lg:w-8 lg:h-8 text-purple-600"
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
        </div>

        <div class="space-y-1 lg:space-y-2">
          <p class="text-base lg:text-lg font-medium text-gray-700">
            Tap to upload photos
          </p>
          <p class="text-sm text-gray-500 hidden lg:block">
            or drag and drop files here
          </p>
          <p class="text-xs text-gray-400 px-4">
            Supports: JPG, PNG, GIF, MP4, MOV
          </p>
        </div>

        {/* Mobile-specific upload button */}
        <div class="lg:hidden pt-2">
          <div class="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-md">
            Choose Files
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadArea;

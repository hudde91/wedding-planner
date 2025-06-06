import { Component } from "solid-js";

const LoadingSpinner: Component = () => {
  return (
    <div class="flex items-center justify-center min-h-screen w-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading your wedding plan...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

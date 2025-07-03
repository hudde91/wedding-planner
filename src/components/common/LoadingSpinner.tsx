import { Component } from "solid-js";

const LoadingSpinner: Component = () => {
  return (
    <div class="flex items-center justify-center min-h-screen w-full p-4 safe-area-top safe-area-bottom">
      <div class="text-center space-y-4">
        {/* Spinner with gradient */}
        <div class="relative mx-auto">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 border-4 border-gray-200">
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-rose-500"></div>
          </div>

          {/* Inner spinning element for extra visual appeal */}
          <div class="absolute inset-2 sm:inset-2 lg:inset-3 animate-spin rounded-full border-2 border-gray-100">
            <div class="absolute inset-0 rounded-full border-2 border-transparent border-b-purple-400 animate-reverse-spin"></div>
          </div>
        </div>

        {/* Loading text */}
        <div class="space-y-1">
          <p class="text-base sm:text-lg font-medium text-gray-700">
            Loading your wedding plan...
          </p>
          <p class="text-sm text-gray-500">Please wait a moment</p>
        </div>

        {/* Animated dots */}
        <div class="flex items-center justify-center space-x-1">
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div
            class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style="animation-delay: 0.1s"
          ></div>
          <div
            class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style="animation-delay: 0.2s"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

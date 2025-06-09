import { PinterestPin } from "../../types";
import PinterestService from "../../api/PinterestAPIService";
import {
  Component,
  createSignal,
  createEffect,
  For,
  Show,
  onMount,
} from "solid-js";

interface PinterestInspirationsProps {
  searchQuery: string;
  onClose: () => void;
  onSelectInspiration: (pin: PinterestPin) => void;
}

const PinterestInspirations: Component<PinterestInspirationsProps> = (
  props
) => {
  const [pins, setPins] = createSignal<PinterestPin[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [pinterestService, setPinterestService] =
    createSignal<PinterestService | null>(null);

  onMount(() => {
    console.log("Pinterest modal mounted"); // Debug log
    setPinterestService(new PinterestService());
  });

  createEffect(async () => {
    if (props.searchQuery && pinterestService()) {
      console.log("Searching for:", props.searchQuery); // Debug log
      setLoading(true);
      setError(null);

      try {
        const results = await pinterestService()!.searchPins(
          props.searchQuery,
          12
        );
        console.log("Found results:", results.length); // Debug log
        setPins(results);
      } catch (err) {
        setError("Failed to load inspirations");
        console.error("Pinterest search error:", err);
      } finally {
        setLoading(false);
      }
    }
  });

  const handleSelectInspiration = (pin: PinterestPin): void => {
    console.log("Selected inspiration:", pin.title); // Debug log
    props.onSelectInspiration(pin);
  };

  // FIX: Prevent modal from closing when clicking inside
  const handleBackdropClick = (e: Event): void => {
    // Only close if clicking the backdrop (dark overlay), not the modal content
    if (e.target === e.currentTarget) {
      console.log("Backdrop clicked, closing modal"); // Debug log
      props.onClose();
    }
  };

  const handleCloseClick = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Close button clicked"); // Debug log
    props.onClose();
  };

  // FIX: Prevent modal content clicks from bubbling to backdrop
  const handleModalContentClick = (e: Event): void => {
    e.stopPropagation();
  };

  return (
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={handleModalContentClick}
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 flex items-center">
                <svg
                  class="w-6 h-6 mr-2 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.996.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                Pinterest Inspiration
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Wedding ideas for: "{props.searchQuery}"
              </p>
              <Show when={pinterestService()?.isDemoMode()}>
                <p class="text-xs text-blue-600 mt-1 flex items-center">
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Demo Mode - Using curated wedding inspirations
                </p>
              </Show>
            </div>
            <button
              type="button"
              onClick={handleCloseClick}
              class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Close modal"
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
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[70vh]">
          <Show when={loading()}>
            <div class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span class="ml-3 text-gray-600">Finding inspiration...</span>
            </div>
          </Show>

          <Show when={error()}>
            <div class="text-center py-12 text-red-600">
              <div class="text-4xl mb-4">📌</div>
              <p class="mb-2">{error()}</p>
              <p class="text-sm text-gray-500">
                Showing curated inspirations instead
              </p>
            </div>
          </Show>

          <Show when={!loading() && pins().length > 0}>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={pins()}>
                {(pin) => (
                  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                    <div class="relative overflow-hidden">
                      <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback image if Pinterest image fails to load
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=600&fit=crop";
                        }}
                      />
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div class="opacity-0 group-hover:opacity-100 space-x-2">
                          <a
                            href={pin.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onclick={(e) => e.stopPropagation()}
                            class="bg-white text-gray-800 px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-200 inline-flex items-center"
                          >
                            <svg
                              class="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.996.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                            </svg>
                            View
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectInspiration(pin);
                            }}
                            class="bg-purple-600 text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            Save Idea
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="p-4">
                      <h4 class="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {pin.title}
                      </h4>
                      <p class="text-sm text-gray-600 mb-3 line-clamp-3">
                        {pin.description}
                      </p>
                      <div class="flex items-center justify-between text-xs text-gray-500">
                        <Show when={pin.boardName}>
                          <span>📌 {pin.boardName}</span>
                        </Show>
                        <Show when={pin.saveCount}>
                          <span>
                            ❤️ {pin.saveCount?.toLocaleString()} saves
                          </span>
                        </Show>
                      </div>
                      <Show when={pin.creatorName}>
                        <div class="mt-2 text-xs text-gray-400">
                          By @{pin.creatorName}
                        </div>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show when={!loading() && !error() && pins().length === 0}>
            <div class="text-center py-12 text-gray-500">
              <div class="text-4xl mb-4">🔍</div>
              <p class="text-lg font-medium mb-2">No inspirations found</p>
              <p>Try a different search term or check back later.</p>
            </div>
          </Show>
        </div>

        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-500">
              💡 Click "Save Idea" to add inspiration details to your todo notes
            </p>
            <button
              type="button"
              onClick={handleCloseClick}
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinterestInspirations;

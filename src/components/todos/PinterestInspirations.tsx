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
  const [isModalLoaded, setIsModalLoaded] = createSignal(false);

  onMount(() => {
    console.log("Pinterest modal mounted");
    setPinterestService(new PinterestService());
    setTimeout(() => setIsModalLoaded(true), 100);
  });

  createEffect(async () => {
    if (props.searchQuery && pinterestService()) {
      console.log("Searching for:", props.searchQuery);
      setLoading(true);
      setError(null);

      try {
        const results = await pinterestService()!.searchPins(
          props.searchQuery,
          12
        );
        console.log("Found results:", results.length);
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
    console.log("Selected inspiration:", pin.title);
    props.onSelectInspiration(pin);
  };

  const handleBackdropClick = (e: Event): void => {
    if (e.target === e.currentTarget) {
      console.log("Backdrop clicked, closing modal");
      props.onClose();
    }
  };

  const handleCloseClick = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Close button clicked");
    props.onClose();
  };

  const handleModalContentClick = (e: Event): void => {
    e.stopPropagation();
  };

  return (
    <div
      class={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500 ${
        isModalLoaded() ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        class={`bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-white/20 transition-all duration-700 ${
          isModalLoaded()
            ? "transform translate-y-0 scale-100"
            : "transform translate-y-8 scale-95"
        }`}
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div class="relative p-8 border-b border-gray-100/80 bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50">
          <div class="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=200&fit=crop&auto=format"
              alt="Wedding inspiration"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="relative z-10 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  class="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.996.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-medium text-gray-900 tracking-wide">
                  Wedding Inspiration
                </h3>
                <p class="text-lg text-gray-600 font-light mt-1">
                  Beautiful ideas for "{props.searchQuery}"
                </p>
                <Show when={pinterestService()?.isDemoMode()}>
                  <div class="inline-flex items-center mt-2 px-3 py-1 bg-blue-100/80 backdrop-blur-sm text-blue-700 rounded-full text-sm border border-blue-200/50">
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
                    Demo Mode - Curated wedding inspirations
                  </div>
                </Show>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseClick}
              class="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-xl transition-all duration-300 backdrop-blur-sm"
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

        {/* Content */}
        <div class="p-8 overflow-y-auto max-h-[70vh] bg-gradient-to-b from-white/80 to-gray-50/40">
          <Show when={loading()}>
            <div class="flex items-center justify-center py-20">
              <div class="text-center space-y-4">
                <div class="relative">
                  <div class="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-1">
                    Finding inspiration...
                  </h3>
                  <p class="text-gray-600 font-light">
                    Discovering beautiful ideas for your wedding
                  </p>
                </div>
              </div>
            </div>
          </Show>

          <Show when={error()}>
            <div class="text-center py-20">
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-red-100 shadow-lg max-w-md mx-auto">
                <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    class="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">
                  {error()}
                </h3>
                <p class="text-gray-600 font-light">
                  Showing curated inspirations instead
                </p>
              </div>
            </div>
          </Show>

          <Show when={!loading() && pins().length > 0}>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <For each={pins()}>
                {(pin, index) => (
                  <div
                    class={`group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/50 transform hover:-translate-y-1`}
                    style={`animation-delay: ${index() * 100}ms`}
                  >
                    <div class="relative overflow-hidden aspect-[4/5]">
                      <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=600&fit=crop";
                        }}
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div class="absolute bottom-4 left-4 right-4 space-y-3">
                          <div class="flex space-x-2">
                            <a
                              href={pin.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onclick={(e) => e.stopPropagation()}
                              class="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-all duration-300 text-center border border-white/50"
                            >
                              View Original
                            </a>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectInspiration(pin);
                              }}
                              class="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-center shadow-lg"
                            >
                              Save Idea
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="p-4">
                      <h4 class="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-snug">
                        {pin.title}
                      </h4>
                      <Show when={pin.description}>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-3 font-light leading-relaxed">
                          {pin.description}
                        </p>
                      </Show>
                      <div class="flex items-center justify-between text-xs text-gray-500">
                        <Show when={pin.boardName}>
                          <div class="flex items-center space-x-1">
                            <svg
                              class="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.996.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                            </svg>
                            <span class="truncate">{pin.boardName}</span>
                          </div>
                        </Show>
                        <Show when={pin.saveCount}>
                          <div class="flex items-center space-x-1">
                            <svg
                              class="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{pin.saveCount?.toLocaleString()}</span>
                          </div>
                        </Show>
                      </div>
                      <Show when={pin.creatorName}>
                        <div class="mt-2 text-xs text-gray-400 font-light">
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
            <div class="text-center py-20">
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-100 shadow-lg max-w-md mx-auto">
                <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">
                  No inspirations found
                </h3>
                <p class="text-gray-600 font-light">
                  Try a different search term or check back later.
                </p>
              </div>
            </div>
          </Show>
        </div>

        {/* Footer */}
        <div class="p-6 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/80 via-white/60 to-gray-50/80 backdrop-blur-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z" />
              </svg>
              <span class="font-light">
                Click "Save Idea" to add inspiration details to your task notes
              </span>
            </div>
            <button
              type="button"
              onClick={handleCloseClick}
              class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
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

import { Component, For, Accessor, Setter, createSignal, Show } from "solid-js";
import type { MediaCategory } from "../../types";

interface MediaFiltersProps {
  selectedCategory: Accessor<MediaCategory | "all">;
  setSelectedCategory: Setter<MediaCategory | "all">;
  viewMode: Accessor<"grid" | "masonry">;
  setViewMode: Setter<"grid" | "masonry">;
  searchQuery: Accessor<string>;
  setSearchQuery: Setter<string>;
}

const MediaFilters: Component<MediaFiltersProps> = (props) => {
  const [showAllCategories, setShowAllCategories] = createSignal(false);

  const categories: {
    id: MediaCategory | "all";
    label: string;
    icon: string;
    color: string;
  }[] = [
    {
      id: "all",
      label: "All Photos",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "gray",
    },
    {
      id: "ceremony",
      label: "Ceremony",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "rose",
    },
    {
      id: "reception",
      label: "Reception",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      color: "purple",
    },
    {
      id: "preparation",
      label: "Getting Ready",
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4",
      color: "emerald",
    },
    {
      id: "portraits",
      label: "Portraits",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      color: "blue",
    },
    {
      id: "party",
      label: "Party",
      icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
      color: "amber",
    },
    {
      id: "other",
      label: "Other",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      color: "gray",
    },
  ];

  // Show first 4 categories + selected category on mobile
  const visibleCategories = () => {
    if (showAllCategories() || window.innerWidth >= 1024) {
      return categories;
    }

    const firstFour = categories.slice(0, 4);
    const selected = categories.find(
      (cat) => cat.id === props.selectedCategory()
    );

    if (selected && !firstFour.includes(selected)) {
      return [...firstFour.slice(0, 3), selected];
    }

    return firstFour;
  };

  const hiddenCategoriesCount = () => {
    return categories.length - visibleCategories().length;
  };

  return (
    <div class="bg-white/80 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 lg:p-6 border border-gray-100 shadow-lg">
      <div class="space-y-4">
        {/* Search Bar - Top on mobile */}
        <div class="relative order-first lg:order-last">
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
          <input
            type="text"
            value={props.searchQuery()}
            onInput={(e) =>
              props.setSearchQuery((e.target as HTMLInputElement).value)
            }
            class="w-full pl-10 pr-4 py-2.5 lg:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white/50 backdrop-blur-sm text-sm"
            placeholder="Search photos..."
          />
        </div>

        {/* Categories and View Mode */}
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Categories */}
          <div class="space-y-3 lg:space-y-0">
            <div class="flex flex-wrap gap-2">
              <For each={visibleCategories()}>
                {(category) => (
                  <button
                    onClick={() => props.setSelectedCategory(category.id)}
                    class={`inline-flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-all duration-300 min-h-[44px] touch-manipulation ${
                      props.selectedCategory() === category.id
                        ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-200`
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <svg
                      class="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d={category.icon}
                      />
                    </svg>
                    <span class="text-sm font-medium">{category.label}</span>
                  </button>
                )}
              </For>

              {/* Show More Button on mobile */}
              <Show
                when={hiddenCategoriesCount() > 0 && window.innerWidth < 1024}
              >
                <button
                  onClick={() => setShowAllCategories(!showAllCategories())}
                  class="inline-flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 min-h-[44px] touch-manipulation bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                >
                  <span class="text-sm font-medium">
                    {showAllCategories()
                      ? "Show Less"
                      : `+${hiddenCategoriesCount()} More`}
                  </span>
                  <svg
                    class={`w-4 h-4 transition-transform duration-300 ${
                      showAllCategories() ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </Show>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div class="flex items-center justify-center lg:justify-end">
            <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => props.setViewMode("grid")}
                class={`p-2 rounded-md transition-all duration-300 min-h-[44px] min-w-[44px] touch-manipulation ${
                  props.viewMode() === "grid"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => props.setViewMode("masonry")}
                class={`p-2 rounded-md transition-all duration-300 min-h-[44px] min-w-[44px] touch-manipulation ${
                  props.viewMode() === "masonry"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaFilters;

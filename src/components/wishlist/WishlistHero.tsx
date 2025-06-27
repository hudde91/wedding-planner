import { Component, Show } from "solid-js";

interface WishlistHeroProps {
  mode?: "couple" | "guest";
  coupleNames?: { name1: string; name2: string };
}

const WishlistHero: Component<WishlistHeroProps> = (props) => {
  const mode = () => props.mode || "couple";
  const isGuestMode = () => mode() === "guest";

  const getTitle = () => {
    if (isGuestMode()) {
      return "Wedding Wishlist";
    }
    return "Wedding Wishlist";
  };

  const getDescription = () => {
    if (isGuestMode()) {
      return "Help us start our new life together with something special. Click on any available item to reserve it!";
    }
    return "Share your dreams with those who care about you most";
  };

  const getDetailText = () => {
    if (isGuestMode()) {
      return "Choose a gift that brings you joy to give and will bring us joy to receive. Your thoughtfulness means the world to us.";
    }
    return "Create a beautiful collection of gifts that would make your special day even more memorable. Your guests will love being able to choose something that truly brings you joy.";
  };

  return (
    <div class="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 via-white to-rose-100 border border-purple-200/50 shadow-xl">
      {/* Background Pattern */}
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-600 opacity-10"></div>
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern
              id="gift-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="none" />
              <path
                d="M10 2L10 18M2 10L18 10"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gift-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div class="relative z-10 p-8 md:p-12">
        <div class="max-w-3xl">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
                {getTitle()}
              </h1>
              <p class="text-lg text-gray-600 font-light mt-2">
                {getDescription()}
              </p>
            </div>
          </div>

          {/* Couple Names for Guest Mode */}
          <Show when={isGuestMode() && props.coupleNames}>
            <div class="mb-4">
              <p class="text-xl font-light text-gray-700 text-center">
                {props.coupleNames!.name1}
                <span class="text-rose-400 mx-3">&</span>
                {props.coupleNames!.name2}
              </p>
              <div class="w-24 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mt-2"></div>
            </div>
          </Show>

          <p class="text-gray-600 font-light leading-relaxed max-w-2xl">
            {getDetailText()}
          </p>

          {/* Guest Mode Instructions */}
          <Show when={isGuestMode()}>
            <div class="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-rose-200/50">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    class="w-3 h-3 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-800">
                    How to Reserve a Gift
                  </p>
                  <p class="text-xs text-gray-600 leading-relaxed">
                    Click "Reserve Gift" on any available item, enter your name,
                    and optionally add a personal message. No account required!
                  </p>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* Decorative Gift Box */}
      <div class="absolute top-8 right-8 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" fill="currentColor" class="text-purple-400">
          <rect x="20" y="40" width="60" height="40" rx="4" />
          <rect x="15" y="35" width="70" height="10" rx="2" />
          <rect x="45" y="20" width="10" height="25" />
          <path
            d="M35 35 Q45 25 50 35 Q55 25 65 35"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

export default WishlistHero;

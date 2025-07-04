import { Component, Show } from "solid-js";
import type { WeddingPlan } from "../../types";

interface GuestHeaderProps {
  currentRoute: string;
  weddingPlan: WeddingPlan;
}

const GuestHeader: Component<GuestHeaderProps> = (props) => {
  const getRouteTitle = (route: string): string => {
    switch (route) {
      case "welcome":
        return "Welcome to Our Wedding";
      case "info":
        return "Wedding Information";
      case "wishlist":
        return "Wedding Wishlist";
      case "gallery":
        return "Wedding Gallery";
      default:
        return "Wedding Celebration";
    }
  };

  const getRouteSubtitle = (route: string): string => {
    switch (route) {
      case "welcome":
        return "We're so excited to celebrate with you";
      case "info":
        return "All the details you need to know";
      case "wishlist":
        return "Help us start our new life together";
      case "gallery":
        return "Share memories from our special day";
      default:
        return "Celebrate love with us";
    }
  };

  return (
    <header class="relative bg-white/90 backdrop-blur-md shadow-lg border-b border-rose-100/50 py-6 sm:py-8 lg:py-12 mb-6 sm:mb-8">
      {/* Elegant background gradient */}
      <div class="absolute inset-0 bg-gradient-to-r from-rose-100/60 via-white/80 to-purple-100/60"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Couple Names - Main Title */}
        <Show
          when={
            props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
          }
        >
          <div class="mb-4 sm:mb-6">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-gray-800 tracking-wide mb-2">
              <span class="block sm:inline">
                {props.weddingPlan.couple_name1}
              </span>
              <span class="text-rose-400 mx-2 sm:mx-4">&</span>
              <span class="block sm:inline">
                {props.weddingPlan.couple_name2}
              </span>
            </h1>
            <div class="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto"></div>
          </div>
        </Show>

        {/* Page Title */}
        <div class="space-y-2 mb-4 sm:mb-6">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-light text-gray-700 tracking-wide">
            {getRouteTitle(props.currentRoute)}
          </h2>
          <p class="text-base sm:text-lg text-gray-500 font-light px-2 sm:px-0">
            {getRouteSubtitle(props.currentRoute)}
          </p>
        </div>

        {/* Wedding Date */}
        <Show when={props.weddingPlan.wedding_date}>
          <div class="inline-flex items-center space-x-2 sm:space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-rose-200/50 shadow-sm">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="text-sm sm:text-base text-gray-700 font-medium">
              {new Date(props.weddingPlan.wedding_date).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </span>
          </div>
        </Show>
      </div>

      {/* Decorative element */}
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg border border-rose-200/50 flex items-center justify-center">
          <svg
            class="w-3 h-3 sm:w-4 sm:h-4 text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default GuestHeader;

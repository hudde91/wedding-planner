import { Component } from "solid-js";
import { useLocation } from "@solidjs/router";
import type { WeddingPlan } from "../../types";
import GuestHeader from "./GuestHeader";
import GuestNavigation from "./GuestNavigation";

interface GuestLayoutProps {
  weddingPlan: WeddingPlan;
  children: any;
}

const GuestLayout: Component<GuestLayoutProps> = (props) => {
  const location = useLocation();

  const getCurrentRoute = () => {
    const path = location.pathname;
    if (path === "/guest") return "welcome";
    return path.replace("/guest/", "");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50/40 relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div class="fixed inset-0 opacity-3 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="guest-floral"
              x="0"
              y="0"
              width="300"
              height="300"
              patternUnits="userSpaceOnUse"
            >
              {/* Delicate floral pattern */}
              <circle
                cx="150"
                cy="150"
                r="3"
                fill="currentColor"
                opacity="0.08"
              />
              <circle
                cx="75"
                cy="75"
                r="1.5"
                fill="currentColor"
                opacity="0.04"
              />
              <circle
                cx="225"
                cy="75"
                r="1.5"
                fill="currentColor"
                opacity="0.04"
              />
              <circle
                cx="75"
                cy="225"
                r="1.5"
                fill="currentColor"
                opacity="0.04"
              />
              <circle
                cx="225"
                cy="225"
                r="1.5"
                fill="currentColor"
                opacity="0.04"
              />
              {/* Subtle connecting lines */}
              <line
                x1="150"
                y1="147"
                x2="150"
                y2="153"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.03"
              />
              <line
                x1="147"
                y1="150"
                x2="153"
                y2="150"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.03"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#guest-floral)"
            class="text-rose-400"
          />
        </svg>
      </div>

      {/* Header */}
      <GuestHeader
        currentRoute={getCurrentRoute()}
        weddingPlan={props.weddingPlan}
      />

      {/* Navigation */}
      <GuestNavigation currentRoute={getCurrentRoute()} />

      {/* Main Content */}
      <main class="relative z-10 pb-8">
        <div class="max-w-6xl mx-auto px-6">
          <div class="transform transition-all duration-700 ease-out">
            {props.children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="relative z-10 mt-16 py-8 border-t border-rose-100/50 bg-white/60 backdrop-blur-sm">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center space-y-4">
            <div class="flex items-center justify-center space-x-3">
              <svg
                class="w-5 h-5 text-rose-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span class="text-gray-600 font-light">
                Thank you for being part of our special day
              </span>
            </div>
            <div class="text-sm text-gray-500 font-light">
              Wedding Planner Guest Portal
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;

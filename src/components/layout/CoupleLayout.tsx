import { Component, createSignal } from "solid-js";
import { useLocation } from "@solidjs/router";
import type { WeddingPlan } from "../../types";
import CoupleSidebar from "./CoupleSidebar";
import CoupleHeader from "./CoupleHeader";

interface CoupleLayoutProps {
  weddingPlan: WeddingPlan;
  children: any;
}

const CoupleLayout: Component<CoupleLayoutProps> = (props) => {
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const location = useLocation();

  const getCurrentRoute = () => {
    const path = location.pathname;
    if (path === "/") return "overview";
    return path.replace("/", "");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/30 flex relative overflow-hidden">
      {/* Background Pattern */}
      <div class="fixed inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="floral"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="100"
                cy="100"
                r="2"
                fill="currentColor"
                opacity="0.1"
              />
              <circle
                cx="50"
                cy="50"
                r="1"
                fill="currentColor"
                opacity="0.05"
              />
              <circle
                cx="150"
                cy="50"
                r="1"
                fill="currentColor"
                opacity="0.05"
              />
              <circle
                cx="50"
                cy="150"
                r="1"
                fill="currentColor"
                opacity="0.05"
              />
              <circle
                cx="150"
                cy="150"
                r="1"
                fill="currentColor"
                opacity="0.05"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#floral)"
            class="text-rose-300"
          />
        </svg>
      </div>

      <CoupleSidebar
        currentRoute={getCurrentRoute()}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        weddingPlan={props.weddingPlan}
      />

      <div
        class={`flex-1 transition-all duration-500 ease-in-out relative ${
          sidebarOpen() ? "ml-80" : "ml-20"
        }`}
      >
        <CoupleHeader
          currentRoute={getCurrentRoute()}
          weddingPlan={props.weddingPlan}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen())}
        />

        <main class="relative min-h-screen">
          {/* Content Background */}
          <div class="absolute inset-0 bg-gradient-to-b from-white/80 via-gray-50/40 to-white/60"></div>

          <div class="relative z-10 p-8">
            <div class="max-w-7xl mx-auto">
              <div class="transform transition-all duration-700 ease-out">
                {props.children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoupleLayout;

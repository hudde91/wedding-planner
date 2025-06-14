import { Component, Accessor, Setter } from "solid-js";
import type { WeddingPlan, TabId } from "../../types";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  activeTab: Accessor<TabId>;
  setActiveTab: Setter<TabId>;
  sidebarOpen: Accessor<boolean>;
  setSidebarOpen: Setter<boolean>;
  weddingPlan: WeddingPlan;
  children: any;
}

const MainLayout: Component<MainLayoutProps> = (props) => {
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

      <Sidebar
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
        isOpen={props.sidebarOpen}
        setIsOpen={props.setSidebarOpen}
        weddingPlan={props.weddingPlan}
      />

      <div
        class={`flex-1 transition-all duration-500 ease-in-out relative ${
          props.sidebarOpen() ? "ml-80" : "ml-20"
        }`}
      >
        <Header
          activeTab={props.activeTab()}
          weddingPlan={props.weddingPlan}
          onToggleSidebar={() => props.setSidebarOpen(!props.sidebarOpen())}
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

export default MainLayout;

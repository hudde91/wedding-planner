import { Component, Show } from "solid-js";
import type { WeddingPlan, TabId } from "../../types";

interface HeaderProps {
  activeTab: TabId;
  weddingPlan: WeddingPlan;
  onToggleSidebar: () => void;
}

const Header: Component<HeaderProps> = (props) => {
  const getTabTitle = (tabId: TabId): string => {
    switch (tabId) {
      case "overview":
        return "Wedding Dashboard";
      case "timeline":
        return "Planning Timeline";
      case "details":
        return "Wedding Details";
      case "todos":
        return "Planning Checklist";
      case "guests":
        return "Guest Management";
      case "seating":
        return "Seating Arrangements";
      default:
        return "Wedding Planner";
    }
  };

  const getTabSubtitle = (tabId: TabId): string => {
    switch (tabId) {
      case "overview":
        return "Your wedding at a glance";
      case "timeline":
        return "Stay on track with your planning";
      case "details":
        return "Essential wedding information";
      case "todos":
        return "Tasks and vendor management";
      case "guests":
        return "Invitations and RSVP tracking";
      case "seating":
        return "Table arrangements and layout";
      default:
        return "Plan your perfect day";
    }
  };

  return (
    <header class="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 px-8 py-6 sticky top-0 z-40 transition-all duration-300">
      {/* Background pattern */}
      <div class="absolute inset-0 bg-gradient-to-r from-rose-50/30 to-purple-50/30"></div>

      <div class="relative flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <button
            onClick={props.onToggleSidebar}
            class="group p-3 rounded-xl hover:bg-white/80 transition-all duration-300 shadow-sm border border-gray-100/50"
          >
            <svg
              class="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          <div class="space-y-1">
            <h1 class="text-2xl font-light text-gray-900 tracking-wide">
              {getTabTitle(props.activeTab)}
            </h1>
            <p class="text-sm text-gray-500 font-light">
              {getTabSubtitle(props.activeTab)}
            </p>
            <Show
              when={
                props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
              }
            >
              <p class="text-xs text-gray-400 font-medium tracking-wide uppercase">
                {props.weddingPlan.couple_name1} &{" "}
                {props.weddingPlan.couple_name2}
              </p>
            </Show>
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <Show when={props.weddingPlan.wedding_date}>
            <div class="text-right space-y-1">
              <div class="text-sm font-medium text-gray-900">
                {new Date(props.weddingPlan.wedding_date).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </div>
              <div class="text-xs text-gray-500">Wedding Date</div>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
};

export default Header;

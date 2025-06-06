import { Component, Show } from "solid-js";
import { WeddingPlan } from "../../types";

type TabId = "overview" | "details" | "todos" | "guests" | "seating";

interface HeaderProps {
  activeTab: TabId;
  weddingPlan: WeddingPlan;
  onToggleSidebar: () => void;
}

const Header: Component<HeaderProps> = (props) => {
  const getTabTitle = (tabId: TabId): string => {
    switch (tabId) {
      case "overview":
        return "Wedding Overview";
      case "details":
        return "Wedding Details";
      case "todos":
        return "Wedding Checklist";
      case "guests":
        return "Guest Management";
      case "seating":
        return "Seating Chart";
      default:
        return "Wedding Planner";
    }
  };

  return (
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            onClick={props.onToggleSidebar}
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {getTabTitle(props.activeTab)}
            </h1>
            <Show
              when={
                props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
              }
            >
              <p class="text-sm text-gray-600">
                {props.weddingPlan.couple_name1} &{" "}
                {props.weddingPlan.couple_name2}
              </p>
            </Show>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-500">
            <span class="inline-flex items-center">
              <svg
                class="w-4 h-4 mr-1 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Auto-saved
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

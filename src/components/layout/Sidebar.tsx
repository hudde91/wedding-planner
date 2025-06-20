import { Component, Accessor, Setter, Show } from "solid-js";
import type { WeddingPlan, TabId } from "../../types";

interface SidebarItem {
  id: TabId;
  label: string;
  icon: string;
  description: string;
}

interface SidebarProps {
  activeTab: Accessor<TabId>;
  setActiveTab: Setter<TabId>;
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  weddingPlan: WeddingPlan;
}

const Sidebar: Component<SidebarProps> = (props) => {
  const sidebarItems: SidebarItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M9 22V12h6v10",
      description: "Wedding overview",
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      description: "Planning phases",
    },
    {
      id: "details",
      label: "Details",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      description: "Basic information",
    },
    {
      id: "todos",
      label: "Checklist",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      description: "Tasks & planning",
    },
    {
      id: "guests",
      label: "Guests",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
      description: "Guest management",
    },
    {
      id: "seating",
      label: "Seating",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      description: "Table arrangements",
    },
  ];

  return (
    <div
      class={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-100 transition-all duration-500 z-50 ${
        props.isOpen() ? "w-80" : "w-20"
      }`}
    >
      {/* Background Pattern */}
      <div class="absolute inset-0 bg-gradient-to-b from-rose-50/40 via-white/60 to-purple-50/40"></div>

      {/* Logo/Brand Area */}
      <div class="relative h-20 flex items-center justify-center border-b border-gray-100/80 bg-gradient-to-r from-rose-100/50 to-purple-100/50">
        <Show when={props.isOpen()}>
          <div class="text-center">
            <div class="text-xl font-light text-gray-800 tracking-wide">
              Wedding Planner
            </div>
            <div class="text-xs text-gray-500 font-light tracking-wider uppercase">
              Elegant Planning
            </div>
          </div>
        </Show>
        <Show when={!props.isOpen()}>
          <svg
            class="w-8 h-8 text-rose-400"
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
        </Show>
      </div>

      {/* Quick Stats - Only show when sidebar is open */}
      <Show
        when={
          props.isOpen() &&
          (props.weddingPlan.couple_name1 ||
            props.weddingPlan.guests.length > 0)
        }
      >
        <div class="relative p-6 border-b border-gray-100/60 bg-gradient-to-r from-white/60 to-gray-50/40">
          <div class="space-y-4">
            <Show
              when={
                props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
              }
            >
              <div class="text-center space-y-1">
                <div class="text-lg font-light text-gray-900 tracking-wide">
                  {props.weddingPlan.couple_name1} &{" "}
                  {props.weddingPlan.couple_name2}
                </div>
                <Show when={props.weddingPlan.wedding_date}>
                  <div class="text-xs text-gray-500 font-light">
                    {new Date(
                      props.weddingPlan.wedding_date
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </Show>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      {/* Navigation Items */}
      <nav class="relative flex-1 p-4">
        <ul class="space-y-2">
          {sidebarItems.map((item) => (
            <li>
              <button
                onClick={() => props.setActiveTab(item.id)}
                class={`w-full flex items-center rounded-xl transition-all duration-300 group ${
                  props.activeTab() === item.id
                    ? "bg-gradient-to-r from-rose-100/80 to-purple-100/80 text-gray-800 shadow-md border border-rose-200/60"
                    : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
                } ${props.isOpen() ? "px-4 py-4" : "px-4 py-4 justify-center"}`}
                title={
                  !props.isOpen()
                    ? `${item.label} - ${item.description}`
                    : undefined
                }
              >
                <svg
                  class="w-5 h-5 flex-shrink-0 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={item.icon}
                  />
                </svg>
                <Show when={props.isOpen()}>
                  <div class="ml-4 flex-1 text-left">
                    <div class="font-medium text-sm">{item.label}</div>
                    <div class="text-xs opacity-60 font-light">
                      {item.description}
                    </div>
                  </div>
                </Show>

                {/* Active indicator */}
                <Show when={props.activeTab() === item.id && props.isOpen()}>
                  <div class="w-2 h-2 bg-rose-500 rounded-full"></div>
                </Show>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Only show when expanded */}
      <Show when={props.isOpen()}>
        <div class="relative p-6 border-t border-gray-100/60 bg-gradient-to-r from-gray-50/40 to-white/60">
          <div class="text-xs text-gray-500 text-center space-y-2">
            <div class="flex items-center justify-center space-x-2">
              <svg
                class="w-3 h-3 text-rose-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              <span class="font-light">Crafted with love</span>
            </div>
            <div class="font-light text-gray-400">Wedding Planner Premium</div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Sidebar;

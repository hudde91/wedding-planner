import { Component, Accessor, Setter, Show } from "solid-js";
import { WeddingPlan } from "../types";

type TabId = "overview" | "details" | "todos" | "guests" | "seating";

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
      label: "Overview",
      icon: "📊",
      description: "Wedding dashboard",
    },
    {
      id: "details",
      label: "Details",
      icon: "💒",
      description: "Basic information",
    },
    {
      id: "todos",
      label: "Checklist",
      icon: "✅",
      description: "Tasks & planning",
    },
    {
      id: "guests",
      label: "Guests",
      icon: "👥",
      description: "Guest management",
    },
    {
      id: "seating",
      label: "Seating",
      icon: "🪑",
      description: "Table arrangements",
    },
  ];

  // Calculate quick stats for the sidebar
  const stats = () => {
    const attendingGuests = props.weddingPlan.guests.filter(
      (g) => g.rsvp_status === "attending"
    );
    const totalAttendees = attendingGuests.reduce(
      (sum, guest) => sum + 1 + guest.plus_ones.length,
      0
    );
    const completedTodos = props.weddingPlan.todos.filter(
      (t) => t.completed
    ).length;
    const totalTodos = props.weddingPlan.todos.length;

    return {
      totalAttendees,
      completedTodos,
      totalTodos,
      progressPercentage:
        totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
    };
  };

  return (
    <div
      class={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-50 ${
        props.isOpen() ? "w-64" : "w-16"
      }`}
    >
      {/* Logo/Brand Area */}
      <div class="h-16 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
        <Show when={props.isOpen()}>
          <div class="text-white font-bold text-lg">💒 Wedding Planner</div>
        </Show>
        <Show when={!props.isOpen()}>
          <div class="text-white text-2xl">💒</div>
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
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <div class="space-y-3">
            <Show
              when={
                props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
              }
            >
              <div class="text-center">
                <div class="text-sm font-medium text-gray-900">
                  {props.weddingPlan.couple_name1} &{" "}
                  {props.weddingPlan.couple_name2}
                </div>
                <Show when={props.weddingPlan.wedding_date}>
                  <div class="text-xs text-gray-600">
                    {new Date(
                      props.weddingPlan.wedding_date
                    ).toLocaleDateString()}
                  </div>
                </Show>
              </div>
            </Show>

            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="bg-white rounded p-2 text-center">
                <div class="font-semibold text-purple-600">
                  {stats().totalAttendees}
                </div>
                <div class="text-gray-600">Attendees</div>
              </div>
              <div class="bg-white rounded p-2 text-center">
                <div class="font-semibold text-green-600">
                  {stats().progressPercentage}%
                </div>
                <div class="text-gray-600">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Navigation Items */}
      <nav class="flex-1 p-2">
        <ul class="space-y-1">
          {sidebarItems.map((item) => (
            <li>
              <button
                onClick={() => props.setActiveTab(item.id)}
                class={`w-full flex items-center rounded-lg transition-all duration-200 group ${
                  props.activeTab() === item.id
                    ? "bg-purple-100 text-purple-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${props.isOpen() ? "px-3 py-3" : "px-3 py-3 justify-center"}`}
                title={
                  !props.isOpen()
                    ? `${item.label} - ${item.description}`
                    : undefined
                }
              >
                <span class="text-lg flex-shrink-0">{item.icon}</span>
                <Show when={props.isOpen()}>
                  <div class="ml-3 flex-1 text-left">
                    <div class="font-medium text-sm">{item.label}</div>
                    <div class="text-xs opacity-75">{item.description}</div>
                  </div>
                </Show>

                {/* Active indicator */}
                <Show when={props.activeTab() === item.id && props.isOpen()}>
                  <div class="w-2 h-2 bg-purple-600 rounded-full"></div>
                </Show>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Only show when expanded */}
      <Show when={props.isOpen()}>
        <div class="p-4 border-t border-gray-200">
          <div class="text-xs text-gray-500 text-center">
            <div class="flex items-center justify-center space-x-1">
              <svg
                class="w-3 h-3"
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
              <span>Made with love</span>
            </div>
            <div class="mt-1">Wedding Planner v1.0</div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Sidebar;

import { Component, Accessor, Setter, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { WeddingPlan } from "../../types";

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  href: string;
}

interface CoupleSidebarProps {
  currentRoute: string;
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  weddingPlan: WeddingPlan;
}

const CoupleSidebar: Component<CoupleSidebarProps> = (props) => {
  const sidebarItems: SidebarItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M9 22V12h6v10",
      description: "Wedding overview",
      href: "/",
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      description: "Planning phases",
      href: "/timeline",
    },
    {
      id: "details",
      label: "Details",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      description: "Basic information",
      href: "/details",
    },
    {
      id: "todos",
      label: "Checklist",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      description: "Tasks & planning",
      href: "/todos",
    },
    {
      id: "guests",
      label: "Guests",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
      description: "Guest management",
      href: "/guests",
    },
    {
      id: "seating",
      label: "Seating",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      description: "Table arrangements",
      href: "/seating",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
      description: "Gift registry",
      href: "/wishlist",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      description: "Photos & videos",
      href: "/gallery",
    },
  ];

  const isActiveRoute = (itemId: string) => {
    if (itemId === "overview") return props.currentRoute === "overview";
    return props.currentRoute === itemId;
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile after navigation
    // Use a slight delay to ensure navigation happens first
    setTimeout(() => {
      if (window.innerWidth < 1024) {
        props.setIsOpen(false);
      }
    }, 100);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <Show when={props.isOpen()}>
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => props.setIsOpen(false)}
        />
      </Show>

      {/* Sidebar */}
      <div
        class={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-100 z-50 transition-all duration-300 ease-in-out overflow-y-auto ${
          props.isOpen() ? "w-80 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        {/* Background Pattern */}
        <div class="absolute inset-0 bg-gradient-to-b from-rose-50/40 via-white/60 to-purple-50/40 pointer-events-none"></div>

        {/* Scrollable Content */}
        <div class="relative h-full flex flex-col">
          {/* Logo/Brand Area */}
          <div class="flex-shrink-0 h-16 lg:h-20 flex items-center justify-center border-b border-gray-100/80 bg-gradient-to-r from-rose-100/50 to-purple-100/50">
            <Show when={props.isOpen()}>
              <div class="text-center px-4">
                <div class="text-lg lg:text-xl font-light text-gray-800 tracking-wide">
                  Wedding Planner
                </div>
                <div class="text-xs text-gray-500 font-light tracking-wider uppercase">
                  Elegant Planning
                </div>
              </div>
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
            <div class="flex-shrink-0 p-4 lg:p-6 border-b border-gray-100/60 bg-gradient-to-r from-white/60 to-gray-50/40">
              <div class="space-y-3 lg:space-y-4">
                <Show
                  when={
                    props.weddingPlan.couple_name1 &&
                    props.weddingPlan.couple_name2
                  }
                >
                  <div class="text-center space-y-1">
                    <div class="text-base lg:text-lg font-light text-gray-900 tracking-wide">
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

                {/* Guest sharing link */}
                <Show when={props.weddingPlan.couple_name1}>
                  <div class="pt-2 border-t border-gray-100">
                    <div class="text-xs text-gray-500 mb-2">Guest Access</div>
                    <div class="flex items-center space-x-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/guest`}
                        readonly
                        class="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 min-w-0"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/guest`
                          );
                          alert("Guest link copied to clipboard!");
                        }}
                        class="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        title="Copy guest link"
                      >
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Show>

                {/* Media count */}
                <Show
                  when={
                    props.weddingPlan.media &&
                    props.weddingPlan.media.length > 0
                  }
                >
                  <div class="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div class="flex items-center space-x-1">
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{props.weddingPlan.media.length} photos</span>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </Show>

          {/* Navigation Items - Scrollable */}
          <nav class="flex-1 p-3 lg:p-4 overflow-y-auto">
            <ul class="space-y-1 lg:space-y-2">
              {sidebarItems.map((item) => (
                <li>
                  <A
                    href={item.href}
                    onClick={handleLinkClick}
                    class={`w-full flex items-center rounded-xl transition-all duration-300 group ${
                      isActiveRoute(item.id)
                        ? "bg-gradient-to-r from-rose-100/80 to-purple-100/80 text-gray-800 shadow-md border border-rose-200/60"
                        : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
                    } px-3 lg:px-4 py-3 lg:py-4`}
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
                      <div class="ml-3 lg:ml-4 flex-1 text-left min-w-0">
                        <div class="font-medium text-sm truncate">
                          {item.label}
                        </div>
                        <div class="text-xs opacity-60 font-light truncate">
                          {item.description}
                        </div>
                      </div>
                    </Show>

                    {/* Active indicator */}
                    <Show when={isActiveRoute(item.id) && props.isOpen()}>
                      <div class="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0"></div>
                    </Show>

                    {/* Badge for gallery with media count */}
                    <Show
                      when={
                        item.id === "gallery" &&
                        props.weddingPlan.media &&
                        props.weddingPlan.media.length > 0 &&
                        props.isOpen()
                      }
                    >
                      <div class="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {props.weddingPlan.media.length}
                      </div>
                    </Show>
                  </A>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer - Only show when expanded */}
          <Show when={props.isOpen()}>
            <div class="flex-shrink-0 p-4 lg:p-6 border-t border-gray-100/60 bg-gradient-to-r from-gray-50/40 to-white/60">
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
                <div class="font-light text-gray-400">
                  Wedding Planner Premium
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
};

export default CoupleSidebar;

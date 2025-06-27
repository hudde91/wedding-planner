import { Component } from "solid-js";
import { A } from "@solidjs/router";

interface GuestNavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  description: string;
}

interface GuestNavigationProps {
  currentRoute: string;
}

const GuestNavigation: Component<GuestNavigationProps> = (props) => {
  const navItems: GuestNavItem[] = [
    {
      id: "welcome",
      label: "Welcome",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M9 22V12h6v10",
      href: "/guest",
      description: "Wedding overview",
    },
    {
      id: "info",
      label: "Details",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/guest/info",
      description: "Important information",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
      href: "/guest/wishlist",
      description: "Gift registry",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      href: "/guest/gallery",
      description: "Share photos",
    },
  ];

  const isActiveRoute = (itemId: string) => {
    if (itemId === "welcome") return props.currentRoute === "welcome";
    return props.currentRoute === itemId;
  };

  return (
    <nav class="relative max-w-6xl mx-auto px-6 mb-12">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100/50 p-2">
        <div class="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => (
            <A
              href={item.href}
              class={`group flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                isActiveRoute(item.id)
                  ? "bg-gradient-to-r from-rose-100 to-purple-100 text-gray-800 shadow-md border border-rose-200/60"
                  : "text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm"
              }`}
              title={item.description}
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
              <div class="flex flex-col">
                <span class="font-medium text-sm">{item.label}</span>
                <span class="text-xs opacity-60 font-light hidden sm:block">
                  {item.description}
                </span>
              </div>
              {/* Active indicator */}
              {isActiveRoute(item.id) && (
                <div class="w-2 h-2 bg-rose-500 rounded-full"></div>
              )}
            </A>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default GuestNavigation;

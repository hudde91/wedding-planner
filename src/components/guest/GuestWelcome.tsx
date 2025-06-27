import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { WeddingPlan } from "../../types";

interface GuestWelcomeProps {
  weddingPlan: WeddingPlan;
}

const GuestWelcome: Component<GuestWelcomeProps> = (props) => {
  const getDaysUntilWedding = () => {
    if (!props.weddingPlan.wedding_date) return null;
    const weddingDate = new Date(props.weddingPlan.wedding_date);
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const quickActions = [
    {
      title: "Wedding Details",
      description: "Get all the important information about our special day",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/guest/info",
      color: "from-blue-100 to-blue-200 text-blue-800",
    },
    {
      title: "Gift Registry",
      description: "Help us start our new life together with something special",
      icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
      href: "/guest/wishlist",
      color: "from-purple-100 to-purple-200 text-purple-800",
    },
    {
      title: "Photo Gallery",
      description: "Share your favorite moments and memories with us",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      href: "/guest/gallery",
      color: "from-rose-100 to-rose-200 text-rose-800",
    },
  ];

  return (
    <div class="space-y-12">
      {/* Welcome Message */}
      <div class="text-center space-y-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-rose-100/50 p-8 md:p-12">
          <div class="space-y-6">
            <div class="w-16 h-16 mx-auto bg-gradient-to-br from-rose-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <svg
                class="w-8 h-8 text-white"
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
            </div>

            <div class="space-y-4">
              <h2 class="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">
                Welcome to Our Celebration
              </h2>
              <p class="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                We are so grateful to have you as part of our special day. Your
                presence means the world to us as we begin this beautiful
                journey together.
              </p>
            </div>

            {/* Countdown */}
            <Show when={getDaysUntilWedding() !== null}>
              <div class="inline-flex items-center space-x-4 bg-gradient-to-r from-rose-50 to-purple-50 rounded-full px-8 py-4 border border-rose-200/50">
                <svg
                  class="w-6 h-6 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="text-center">
                  <div class="text-2xl font-light text-gray-800">
                    {getDaysUntilWedding()! > 0 ? (
                      <span>{getDaysUntilWedding()} days to go!</span>
                    ) : getDaysUntilWedding() === 0 ? (
                      <span>Today is the day! 🎉</span>
                    ) : (
                      <span>Thank you for celebrating with us!</span>
                    )}
                  </div>
                  <div class="text-sm text-gray-500 font-light">
                    Until our wedding day
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div class="grid md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <A
            href={action.href}
            class="group block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="space-y-4">
              <div
                class={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={action.icon}
                  />
                </svg>
              </div>
              <div class="space-y-2">
                <h3 class="text-xl font-medium text-gray-800 group-hover:text-gray-900">
                  {action.title}
                </h3>
                <p class="text-gray-600 font-light text-sm leading-relaxed">
                  {action.description}
                </p>
              </div>
              <div class="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                <span>Learn more</span>
                <svg
                  class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </A>
        ))}
      </div>

      {/* Additional Info */}
      <div class="bg-gradient-to-r from-rose-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-8">
        <div class="text-center space-y-4">
          <h3 class="text-2xl font-light text-gray-800">
            Questions or Need Help?
          </h3>
          <p class="text-gray-600 font-light max-w-xl mx-auto">
            If you have any questions about the wedding or need assistance with
            anything on this site, please don't hesitate to reach out to us
            directly.
          </p>
          <div class="flex justify-center space-x-4 pt-4">
            <div class="bg-white/80 rounded-full px-4 py-2 border border-rose-200/50">
              <span class="text-sm text-gray-600">
                We can't wait to celebrate with you! 💕
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestWelcome;

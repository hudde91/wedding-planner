import { Component, createSignal, onMount } from "solid-js";
import { WeddingPlan } from "../../types";
import { formatCurrency } from "../../utils/currency";

interface WeddingDetailsProps {
  weddingPlan: WeddingPlan;
  updateWeddingDetails: (
    field: keyof WeddingPlan,
    value: string | number
  ) => void;
}

const WeddingDetails: Component<WeddingDetailsProps> = (props) => {
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div
        class={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-white to-purple-100 border border-rose-200/50 shadow-xl transition-all duration-1000 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        {/* Background Image Overlay */}
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop&auto=format"
            alt="Wedding couple"
            class="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div class="relative z-10 p-8 md:p-12">
          <div class="max-w-3xl">
            <h1 class="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
              Your Wedding Details
            </h1>
            <p class="text-lg text-gray-600 font-light leading-relaxed">
              The foundation of your perfect day begins with these essential
              details. Take your time to capture every important aspect of your
              celebration.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div class="absolute top-4 right-4 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" fill="currentColor" class="text-rose-300">
            <path d="M50 20c-16.569 0-30 13.431-30 30 0 20 30 30 30 30s30-10 30-30c0-16.569-13.431-30-30-30z" />
          </svg>
        </div>
      </div>

      {/* Form Sections */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Couple Information */}
        <div
          class={`bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg transition-all duration-1000 delay-200 ${
            isLoaded()
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-medium text-gray-900">
                Couple Information
              </h2>
              <p class="text-sm text-gray-500 font-light">
                The stars of the show
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Partner One
              </label>
              <input
                type="text"
                value={props.weddingPlan.couple_name1}
                onInput={(e) =>
                  props.updateWeddingDetails(
                    "couple_name1",
                    (e.target as HTMLInputElement).value
                  )
                }
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                placeholder="Enter first partner's name"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Partner Two
              </label>
              <input
                type="text"
                value={props.weddingPlan.couple_name2}
                onInput={(e) =>
                  props.updateWeddingDetails(
                    "couple_name2",
                    (e.target as HTMLInputElement).value
                  )
                }
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                placeholder="Enter second partner's name"
              />
            </div>
          </div>
        </div>

        {/* Wedding Logistics */}
        <div
          class={`bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg transition-all duration-1000 delay-400 ${
            isLoaded()
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center">
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-medium text-gray-900">
                Wedding Logistics
              </h2>
              <p class="text-sm text-gray-500 font-light">When and how much</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Wedding Date
              </label>
              <input
                type="date"
                value={props.weddingPlan.wedding_date}
                onInput={(e) =>
                  props.updateWeddingDetails(
                    "wedding_date",
                    (e.target as HTMLInputElement).value
                  )
                }
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 tracking-wide">
                Wedding Budget
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={props.weddingPlan.budget}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "budget",
                      Number((e.target as HTMLInputElement).value) || 0
                    )
                  }
                  class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="0"
                />
              </div>
              {props.weddingPlan.budget > 0 && (
                <p class="text-xs text-gray-500 mt-1 font-light">
                  Budget: {formatCurrency(props.weddingPlan.budget)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wedding Preview Card */}
      {(props.weddingPlan.couple_name1 ||
        props.weddingPlan.couple_name2 ||
        props.weddingPlan.wedding_date) && (
        <div
          class={`relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-50 via-white to-purple-50 border border-rose-200/50 shadow-lg transition-all duration-1000 delay-600 ${
            isLoaded()
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          {/* Background Image */}
          <div class="absolute inset-0 opacity-5">
            <img
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=400&fit=crop&auto=format"
              alt="Wedding flowers"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="relative z-10 p-8">
            <div class="text-center space-y-4">
              <h3 class="text-2xl font-light text-gray-800 tracking-wide">
                Wedding Preview
              </h3>

              {props.weddingPlan.couple_name1 &&
                props.weddingPlan.couple_name2 && (
                  <div class="space-y-2">
                    <p class="text-3xl font-light text-gray-900 tracking-wide">
                      {props.weddingPlan.couple_name1} &{" "}
                      {props.weddingPlan.couple_name2}
                    </p>
                    <div class="w-24 h-px bg-gradient-to-r from-rose-300 to-purple-300 mx-auto"></div>
                  </div>
                )}

              {props.weddingPlan.wedding_date && (
                <div class="space-y-1">
                  <p class="text-xl text-gray-700 font-light">
                    {new Date(
                      props.weddingPlan.wedding_date
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p class="text-sm text-gray-500 font-light tracking-wide uppercase">
                    {(() => {
                      const days = Math.ceil(
                        (new Date(props.weddingPlan.wedding_date).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24)
                      );
                      if (days < 0) return `${Math.abs(days)} days ago`;
                      if (days === 0) return "Today!";
                      if (days === 1) return "Tomorrow!";
                      return `${days} days to go`;
                    })()}
                  </p>
                </div>
              )}

              {props.weddingPlan.budget > 0 && (
                <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 max-w-xs mx-auto border border-white/50">
                  <p class="text-sm text-gray-600 font-light">Budget</p>
                  <p class="text-2xl font-light text-gray-900">
                    {formatCurrency(props.weddingPlan.budget)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auto-save Indicator */}
      <div
        class={`text-center transition-all duration-1000 delay-800 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4"
        }`}
      >
        <div class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-100 shadow-sm">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span class="text-sm text-gray-600 font-light">
            Changes saved automatically
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeddingDetails;

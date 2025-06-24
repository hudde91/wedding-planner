import { Component } from "solid-js";
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
  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div class="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-white to-purple-100 border border-rose-200/50 shadow-xl">
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
        <div class="animate-fade-in-up-delay-200 bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
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
        <div class="animate-fade-in-up-delay-400 bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
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

      {/* Auto-save Indicator */}
      <div class="animate-fade-in-up-delay-800 text-center">
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

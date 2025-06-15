import { Component, createSignal, onMount, Show } from "solid-js";
import { WeddingPlan } from "../../types";
import { useWeddingStats } from "../../hooks/useWeddingStats";

interface OverviewProps {
  weddingPlan: WeddingPlan;
}

const Overview: Component<OverviewProps> = (props) => {
  const stats = useWeddingStats(() => props.weddingPlan);
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=600&fit=crop&auto=format",
  ];

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);

    // Rotate hero images every 8 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(interval);
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWeddingCountdown = () => {
    const days = stats().daysUntilWedding;
    if (days === null)
      return {
        text: "Set your wedding date",
        color: "text-gray-500",
        urgency: "low",
      };
    if (days < 0)
      return {
        text: `${Math.abs(days)} days ago`,
        color: "text-gray-500",
        urgency: "low",
      };
    if (days === 0)
      return { text: "Today!", color: "text-rose-600", urgency: "critical" };
    if (days === 1)
      return { text: "Tomorrow!", color: "text-rose-600", urgency: "critical" };
    if (days <= 7)
      return {
        text: `${days} days left`,
        color: "text-orange-600",
        urgency: "high",
      };
    if (days <= 30)
      return {
        text: `${days} days left`,
        color: "text-amber-600",
        urgency: "medium",
      };
    if (days <= 90)
      return {
        text: `${days} days left`,
        color: "text-blue-600",
        urgency: "medium",
      };
    return {
      text: `${days} days left`,
      color: "text-emerald-600",
      urgency: "low",
    };
  };

  const countdown = getWeddingCountdown();

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div
        class={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-1000 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        {/* Background Images with Smooth Transition */}
        <div class="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              class={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentImageIndex() ? "opacity-60" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Wedding inspiration ${index + 1}`}
                class="w-full h-full object-cover"
              />
            </div>
          ))}
          <div class="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60"></div>
        </div>

        {/* Content */}
        <div class="relative z-10 p-8 md:p-16 text-white min-h-[400px] flex items-center">
          <div class="max-w-4xl space-y-6">
            <Show
              when={
                props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
              }
              fallback={
                <div class="space-y-4">
                  <h1 class="text-4xl md:text-6xl font-light tracking-wide">
                    Welcome to Your
                  </h1>
                  <h1 class="text-4xl md:text-6xl font-light tracking-wide text-rose-200">
                    Wedding Journey
                  </h1>
                  <p class="text-xl md:text-2xl font-light opacity-90 max-w-2xl">
                    Begin planning your perfect day with elegance and ease
                  </p>
                </div>
              }
            >
              <div class="space-y-4">
                <h1 class="text-5xl md:text-7xl font-light tracking-wide">
                  {props.weddingPlan.couple_name1}
                </h1>
                <div class="flex items-center space-x-6">
                  <div class="w-16 h-px bg-white/60"></div>
                  <span class="text-2xl md:text-3xl font-light text-rose-200">
                    &
                  </span>
                  <div class="w-16 h-px bg-white/60"></div>
                </div>
                <h1 class="text-5xl md:text-7xl font-light tracking-wide">
                  {props.weddingPlan.couple_name2}
                </h1>
              </div>

              <Show when={props.weddingPlan.wedding_date}>
                <div class="space-y-2">
                  <p class="text-xl md:text-2xl font-light opacity-90">
                    {new Date(
                      props.weddingPlan.wedding_date
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p
                    class={`text-2xl md:text-3xl font-light ${countdown.color.replace(
                      "text-",
                      "text-white "
                    )}`}
                  >
                    {countdown.text}
                  </p>
                </div>
              </Show>
            </Show>
          </div>
        </div>

        {/* Image Indicators */}
        <div class="absolute bottom-6 right-6 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              aria-label={`Show hero image ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
              class={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex()
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        class={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        {/* Days Until Wedding */}
        <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
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
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Days Until Wedding
              </p>
              <p class={`text-3xl font-light ${countdown.color}`}>
                {stats().daysUntilWedding !== null
                  ? stats().daysUntilWedding
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Attendees */}
        <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Total Attendees
              </p>
              <p class="text-3xl font-light text-blue-600">
                {stats().totalAttendees}
              </p>
              <p class="text-xs text-gray-500 font-light">
                {stats().totalGuests} invited
              </p>
            </div>
          </div>
        </div>

        {/* Budget Status */}
        <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-600 tracking-wide">
                Budget Remaining
              </p>
              <p
                class={`text-3xl font-light ${
                  stats().remainingBudget < 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {formatCurrency(stats().remainingBudget)}
              </p>
              <p class="text-xs text-gray-500 font-light">
                {formatCurrency(stats().totalSpent)} of{" "}
                {formatCurrency(stats().totalBudget)} spent
              </p>
            </div>
          </div>
        </div>

        {/* Planning Progress */}
        <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="space-y-3">
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-600 tracking-wide">
                  Planning Progress
                </p>
                <p class="text-3xl font-light text-purple-600">
                  {Math.round(stats().todoProgress)}%
                </p>
                <p class="text-xs text-gray-500 font-light">
                  {stats().completedTodos} of {stats().totalTodos} tasks
                </p>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-purple-400 to-violet-400 h-2 rounded-full transition-all duration-1000"
                  style={`width: ${Math.min(stats().todoProgress, 100)}%`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP & Budget Breakdown */}
      <div
        class={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-400 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        {/* RSVP Status */}
        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-medium text-gray-900">RSVP Status</h3>
              <p class="text-sm text-gray-500 font-light">
                Guest response tracking
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">Attending</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-medium text-gray-900">
                  {stats().attendingGuests}
                </span>
                <span class="text-sm text-gray-500 ml-2">
                  ({stats().totalAttendees} total)
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">Declined</span>
              </div>
              <span class="text-lg font-medium text-gray-900">
                {stats().declinedGuests}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">Pending</span>
              </div>
              <span class="text-lg font-medium text-gray-900">
                {stats().pendingGuests}
              </span>
            </div>

            <div class="mt-6">
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Response Rate</span>
                <span>
                  {stats().totalGuests > 0
                    ? Math.round(
                        ((stats().attendingGuests + stats().declinedGuests) /
                          stats().totalGuests) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                  style={`width: ${
                    stats().totalGuests > 0
                      ? ((stats().attendingGuests + stats().declinedGuests) /
                          stats().totalGuests) *
                        100
                      : 0
                  }%`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-medium text-gray-900">Budget Overview</h3>
              <p class="text-sm text-gray-500 font-light">
                Financial planning summary
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">
                  Total Budget
                </span>
              </div>
              <span class="text-lg font-medium text-gray-900">
                {formatCurrency(stats().totalBudget)}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">
                  Total Spent
                </span>
              </div>
              <span class="text-lg font-medium text-gray-900">
                {formatCurrency(stats().totalSpent)}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class={`w-3 h-3 rounded-full ${
                    stats().remainingBudget < 0
                      ? "bg-red-400"
                      : "bg-emerald-400"
                  }`}
                ></div>
                <span class="text-sm font-medium text-gray-700">Remaining</span>
              </div>
              <span
                class={`text-lg font-medium ${
                  stats().remainingBudget < 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {formatCurrency(stats().remainingBudget)}
              </span>
            </div>

            <Show when={stats().totalBudget > 0}>
              <div class="mt-6">
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Budget Used</span>
                  <span>
                    {Math.round(
                      (stats().totalSpent / stats().totalBudget) * 100
                    )}
                    %
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class={`h-2 rounded-full transition-all duration-1000 ${
                      stats().totalSpent > stats().totalBudget
                        ? "bg-gradient-to-r from-red-400 to-red-500"
                        : stats().totalSpent > stats().totalBudget * 0.9
                        ? "bg-gradient-to-r from-amber-400 to-orange-400"
                        : "bg-gradient-to-r from-emerald-400 to-green-400"
                    }`}
                    style={`width: ${Math.min(
                      (stats().totalSpent / stats().totalBudget) * 100,
                      100
                    )}%`}
                  ></div>
                </div>
                <Show when={stats().totalSpent > stats().totalBudget}>
                  <p class="text-xs text-red-600 mt-2 font-medium">
                    Over budget by{" "}
                    {formatCurrency(stats().totalSpent - stats().totalBudget)}
                  </p>
                </Show>
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* Planning Tips */}
      <Show when={stats().totalTodos > 0 || stats().totalGuests > 0}>
        <div
          class={`bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl p-8 border border-indigo-200/50 shadow-lg transition-all duration-1000 delay-600 ${
            isLoaded()
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-medium text-gray-900">
                Planning Insights
              </h3>
              <p class="text-sm text-gray-500 font-light">
                Personalized recommendations
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <Show
              when={(() => {
                const days = stats().daysUntilWedding;
                return days !== null && days > 0;
              })()}
            >
              <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">
                    {(() => {
                      const days = stats().daysUntilWedding!;
                      return days > 180
                        ? "You have plenty of time! Focus on major decisions like venue and photographer."
                        : days > 90
                        ? "Time to finalize key details and send save-the-dates to guests."
                        : days > 30
                        ? "Final preparations time! Confirm all vendor details and arrangements."
                        : "Final countdown! Focus on day-of coordination and last-minute details.";
                    })()}
                  </p>
                </div>
              </div>
            </Show>

            <Show when={stats().pendingGuests > 0}>
              <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">
                    You have {stats().pendingGuests} pending RSVP
                    {stats().pendingGuests === 1 ? "" : "s"}. Consider sending
                    gentle reminders to help finalize your guest count.
                  </p>
                </div>
              </div>
            </Show>

            <Show
              when={stats().totalAttendees > 0 && stats().occupiedSeats === 0}
            >
              <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">
                    Perfect time to start your seating arrangements! You have{" "}
                    {stats().totalAttendees}
                    confirmed attendee{stats().totalAttendees === 1
                      ? ""
                      : "s"}{" "}
                    ready to be seated.
                  </p>
                </div>
              </div>
            </Show>
            <Show
              when={(() => {
                const days = stats().daysUntilWedding;
                return stats().todoProgress < 25 && days !== null && days < 90;
              })()}
            >
              <div class="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                <div class="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">
                    Consider prioritizing your planning tasks or hiring a
                    wedding coordinator to help manage the timeline effectively.
                  </p>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      {/* Quick Actions */}
      {/* TODO: Implement navigation with quick actions */}
      <div
        class={`bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg transition-all duration-1000 delay-800 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-medium text-gray-900">Quick Actions</h3>
            <p class="text-sm text-gray-500 font-light">
              Jump to key planning areas
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button class="group p-6 border border-gray-200 rounded-xl hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-300 text-left">
            <div class="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                class="w-6 h-6 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900 mb-1">
              Wedding Details
            </div>
            <div class="text-xs text-gray-500 font-light">
              Set date, budget & information
            </div>
          </button>

          <button class="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 text-left">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900 mb-1">
              Manage Guests
            </div>
            <div class="text-xs text-gray-500 font-light">
              Add guests and track RSVPs
            </div>
          </button>

          <button class="group p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-300 text-left">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                class="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900 mb-1">
              Planning Tasks
            </div>
            <div class="text-xs text-gray-500 font-light">
              Track progress and vendors
            </div>
          </button>

          <button class="group p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-300 text-left">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900 mb-1">
              Seating Chart
            </div>
            <div class="text-xs text-gray-500 font-light">
              Arrange table assignments
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;

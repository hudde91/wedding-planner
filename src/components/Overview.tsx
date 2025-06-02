import { Component, Show, createMemo } from "solid-js";
import { WeddingPlan } from "../types";

interface OverviewProps {
  weddingPlan: WeddingPlan;
}

const Overview: Component<OverviewProps> = (props) => {
  const stats = createMemo(() => {
    const plan = props.weddingPlan;

    // Calculate days until wedding
    const daysUntilWedding = plan.wedding_date
      ? Math.ceil(
          (new Date(plan.wedding_date).getTime() - new Date().getTime()) /
            (1000 * 3600 * 24)
        )
      : null;

    // Calculate guest stats
    const totalGuests = plan.guests.length;
    const attendingGuests = plan.guests.filter(
      (g) => g.rsvp_status === "attending"
    );
    const declinedGuests = plan.guests.filter(
      (g) => g.rsvp_status === "declined"
    );
    const pendingGuests = plan.guests.filter(
      (g) => g.rsvp_status === "pending"
    );

    // Calculate total attendees (including plus ones)
    const totalAttendees = attendingGuests.reduce((sum, guest) => {
      return sum + 1 + (guest.plus_ones?.length || 0);
    }, 0);

    // Calculate budget info
    const totalBudget = plan.budget;
    const totalSpent = plan.todos.reduce(
      (sum, todo) => sum + (todo.cost || 0),
      0
    );
    const remainingBudget = totalBudget - totalSpent;

    // Calculate todo progress
    const completedTodos = plan.todos.filter((t) => t.completed).length;
    const totalTodos = plan.todos.length;
    const todoProgress =
      totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    // Calculate seating info
    const totalTables = plan.tables.length;
    const totalSeats = plan.tables.reduce(
      (sum, table) => sum + table.seats.length,
      0
    );
    const occupiedSeats = plan.tables.reduce(
      (sum, table) => sum + table.seats.filter((seat) => seat.guestId).length,
      0
    );

    return {
      daysUntilWedding,
      totalGuests,
      attendingGuests: attendingGuests.length,
      declinedGuests: declinedGuests.length,
      pendingGuests: pendingGuests.length,
      totalAttendees,
      totalBudget,
      totalSpent,
      remainingBudget,
      completedTodos,
      totalTodos,
      todoProgress,
      totalTables,
      totalSeats,
      occupiedSeats,
      weddingDate: plan.wedding_date,
    };
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWeddingDateStatus = () => {
    const days = stats().daysUntilWedding;
    if (days === null)
      return { text: "Set your wedding date", color: "text-gray-500" };
    if (days < 0)
      return { text: `${Math.abs(days)} days ago`, color: "text-gray-500" };
    if (days === 0) return { text: "Today!", color: "text-red-600 font-bold" };
    if (days === 1)
      return { text: "Tomorrow!", color: "text-red-600 font-bold" };
    if (days <= 7)
      return { text: `${days} days left`, color: "text-red-600 font-semibold" };
    if (days <= 30)
      return { text: `${days} days left`, color: "text-orange-600" };
    if (days <= 90)
      return { text: `${days} days left`, color: "text-yellow-600" };
    return { text: `${days} days left`, color: "text-green-600" };
  };

  return (
    <div class="space-y-6">
      {/* Welcome Section */}
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div class="text-center">
          <div class="text-4xl mb-4">💒</div>
          <Show
            when={
              props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
            }
            fallback={
              <div>
                <h1 class="text-3xl font-bold mb-2">
                  Welcome to Your Wedding Planner!
                </h1>
                <p class="text-purple-100">
                  Start by adding your wedding details to get organized.
                </p>
              </div>
            }
          >
            <h1 class="text-3xl font-bold mb-2">
              {props.weddingPlan.couple_name1} &{" "}
              {props.weddingPlan.couple_name2}
            </h1>
            <Show when={stats().weddingDate}>
              <p class="text-xl text-purple-100 mb-2">
                {new Date(stats().weddingDate!).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Show>
            <Show when={stats().daysUntilWedding !== null}>
              <p
                class={`text-2xl font-semibold ${getWeddingDateStatus().color.replace(
                  "text-",
                  "text-white "
                )}`}
              >
                {getWeddingDateStatus().text}
              </p>
            </Show>
          </Show>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Countdown Card */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">📅</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">
                Days Until Wedding
              </p>
              <p class="text-2xl font-bold text-red-600">
                {(() => {
                  const days = stats().daysUntilWedding;
                  return days !== null ? days : "—";
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Guest Count */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">👥</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Attendees</p>
              <p class="text-2xl font-bold text-blue-600">
                {stats().totalAttendees}
              </p>
              <p class="text-xs text-gray-400">{stats().totalGuests} invited</p>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stats().remainingBudget < 0
                    ? "bg-red-100"
                    : stats().remainingBudget < stats().totalBudget * 0.1
                    ? "bg-yellow-100"
                    : "bg-green-100"
                }`}
              >
                <span class="text-2xl">💰</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Budget Remaining</p>
              <p
                class={`text-2xl font-bold ${
                  stats().remainingBudget < 0
                    ? "text-red-600"
                    : stats().remainingBudget < stats().totalBudget * 0.1
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {formatCurrency(stats().remainingBudget)}
              </p>
              <Show when={stats().totalBudget > 0}>
                <p class="text-xs text-gray-400">
                  {formatCurrency(stats().totalSpent)} spent of{" "}
                  {formatCurrency(stats().totalBudget)}
                </p>
              </Show>
            </div>
          </div>
        </div>

        {/* Todo Progress */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">✅</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Planning Progress</p>
              <p class="text-2xl font-bold text-purple-600">
                {Math.round(stats().todoProgress)}%
              </p>
              <p class="text-xs text-gray-400">
                {stats().completedTodos} of {stats().totalTodos} tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Row */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Breakdown */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">RSVP Status</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">Attending</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-semibold text-gray-900">
                  {stats().attendingGuests}
                </span>
                <span class="text-xs text-gray-500">
                  ({stats().totalAttendees} total)
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">Declined</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">
                {stats().declinedGuests}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">Pending</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">
                {stats().pendingGuests}
              </span>
            </div>

            {/* RSVP Progress Bar */}
            <div class="mt-4">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
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
                  class="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
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

        {/* Budget Breakdown */}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Budget Overview
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">Total Budget</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">
                {formatCurrency(stats().totalBudget)}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">Total Spent</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">
                {formatCurrency(stats().totalSpent)}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class={`w-4 h-4 rounded-full mr-3 ${
                    stats().remainingBudget < 0 ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                <span class="text-sm text-gray-700">Remaining</span>
              </div>
              <span
                class={`text-sm font-semibold ${
                  stats().remainingBudget < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {formatCurrency(stats().remainingBudget)}
              </span>
            </div>

            {/* Budget Progress Bar */}
            <Show when={stats().totalBudget > 0}>
              <div class="mt-4">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
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
                    class={`h-2 rounded-full transition-all duration-300 ${
                      stats().totalSpent > stats().totalBudget
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : stats().totalSpent > stats().totalBudget * 0.9
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-green-500"
                    }`}
                    style={`width: ${Math.min(
                      (stats().totalSpent / stats().totalBudget) * 100,
                      100
                    )}%`}
                  ></div>
                </div>
                <Show when={stats().totalSpent > stats().totalBudget}>
                  <p class="text-xs text-red-600 mt-1 font-medium">
                    ⚠️ Over budget by{" "}
                    {formatCurrency(stats().totalSpent - stats().totalBudget)}
                  </p>
                </Show>
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer group">
            <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">
              💒
            </div>
            <div class="text-sm font-medium text-gray-900">Wedding Details</div>
            <div class="text-xs text-gray-500">Set date, budget & info</div>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer group">
            <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">
              👥
            </div>
            <div class="text-sm font-medium text-gray-900">Add Guests</div>
            <div class="text-xs text-gray-500">Manage your guest list</div>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer group">
            <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">
              ✅
            </div>
            <div class="text-sm font-medium text-gray-900">Plan Tasks</div>
            <div class="text-xs text-gray-500">Track your progress</div>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer group">
            <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">
              🪑
            </div>
            <div class="text-sm font-medium text-gray-900">Seating Chart</div>
            <div class="text-xs text-gray-500">Arrange your tables</div>
          </div>
        </div>
      </div>

      {/* Recent Activity or Tips */}
      <Show when={stats().totalTodos > 0 || stats().totalGuests > 0}>
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            💡 Planning Tips
          </h3>
          <div class="space-y-2 text-sm text-gray-700">
            <Show
              when={(() => {
                const days = stats().daysUntilWedding;
                return days !== null && days > 0;
              })()}
            >
              <div class="flex items-start space-x-2">
                <span class="text-yellow-500 mt-0.5">⭐</span>
                <span>
                  {(() => {
                    const days = stats().daysUntilWedding!;
                    return days > 180
                      ? "You have plenty of time! Focus on big decisions like venue and date."
                      : days > 90
                      ? "Time to finalize major details and send save-the-dates."
                      : days > 30
                      ? "Crunch time! Focus on final details and confirmations."
                      : "Final week! Double-check everything and enjoy your special day!";
                  })()}
                </span>
              </div>
            </Show>
            <Show when={stats().pendingGuests > 0}>
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 mt-0.5">📧</span>
                <span>
                  You have {stats().pendingGuests} pending RSVPs. Consider
                  following up soon.
                </span>
              </div>
            </Show>
            <Show
              when={stats().totalAttendees > 0 && stats().occupiedSeats === 0}
            >
              <div class="flex items-start space-x-2">
                <span class="text-purple-500 mt-0.5">🪑</span>
                <span>
                  Ready to start your seating chart? You have{" "}
                  {stats().totalAttendees} attendees to seat.
                </span>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Overview;

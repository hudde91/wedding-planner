import { Component } from "solid-js";

const QuickActions: Component = () => {
  return (
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
  );
};

export default QuickActions;

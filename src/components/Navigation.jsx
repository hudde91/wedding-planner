const Navigation = (props) => {
  const tabs = [
    { id: "details", label: "Wedding Details", icon: "💒" },
    { id: "todos", label: "Wedding Checklist", icon: "✅" },
    { id: "guests", label: "Guest List", icon: "👥" },
    { id: "seating", label: "Seating Chart", icon: "🪑" },
  ];

  return (
    <nav class="mb-6">
      <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          return (
            <button
              onClick={() => props.setActiveTab(tab.id)}
              class={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors duration-200 ${
                props.activeTab() === tab.id
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span class="text-lg">{tab.icon}</span>
              <span class="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

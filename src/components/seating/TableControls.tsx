import { Component, createSignal, Show } from "solid-js";

interface TableControlsProps {
  onAddTable: () => void;
}

const TableControls: Component<TableControlsProps> = (props) => {
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [tableName, setTableName] = createSignal("");
  const [tableCapacity, setTableCapacity] = createSignal(8);

  const handleAddTable = () => {
    if (tableName().trim()) {
      // TODO: Fix below comment so it actually adds the table with the given name, capacity and shape of the table
      // You'll need to modify this to pass the actual form data
      props.onAddTable();
      setTableName("");
      setTableCapacity(8);
      setShowAddForm(false);
    }
  };

  const presetTables = [
    { name: "Head Table", capacity: 8, description: "For the wedding party" },
    { name: "Family Table", capacity: 10, description: "Close family members" },
    { name: "Friends Table", capacity: 8, description: "College friends" },
    // {
    //   name: "Work Colleagues",
    //   capacity: 6,
    //   description: "Professional contacts",
    // },
    // {
    //   name: "Kids Table",
    //   capacity: 6,
    //   description: "Children and young guests",
    // },
    // { name: "Plus Ones", capacity: 8, description: "Partners and dates" },
  ];

  return (
    <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Table Management</h3>
            <p class="text-sm text-gray-500 font-light">
              Add and organize your reception tables
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm())}
          class={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            showAddForm()
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
          }`}
        >
          {showAddForm() ? "Cancel" : "Add Custom Table"}
        </button>
      </div>

      {/* Add Table Form */}
      <Show when={showAddForm()}>
        <div class="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl p-6 border border-indigo-200/50 mb-6">
          <h4 class="text-lg font-medium text-gray-900 mb-4">
            Create Custom Table
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Table Name
              </label>
              <input
                type="text"
                value={tableName()}
                onInput={(e) =>
                  setTableName((e.target as HTMLInputElement).value)
                }
                placeholder="e.g., Bride's Family, College Friends"
                class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 font-light"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={tableCapacity()}
                onInput={(e) =>
                  setTableCapacity(Number((e.target as HTMLInputElement).value))
                }
                class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 font-light"
              />
            </div>
          </div>
          <div class="flex space-x-3 mt-4">
            <button
              onClick={handleAddTable}
              disabled={!tableName().trim()}
              class={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                tableName().trim()
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Create Table
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Show>

      {/* Quick Add Presets */}
      <div>
        <h4 class="text-lg font-medium text-gray-900 mb-4">
          Quick Add Common Tables
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presetTables.map((preset) => (
            <button
              onClick={() => {
                // You'll need to modify this to pass the preset data
                props.onAddTable();
              }}
              class="group p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 text-left"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                    {preset.name}
                  </h5>
                  <p class="text-sm text-gray-600 font-light mt-1 group-hover:text-indigo-600 transition-colors duration-300">
                    {preset.description}
                  </p>
                  <div class="flex items-center mt-2 text-xs text-gray-500">
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>{preset.capacity} seats</span>
                  </div>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    class="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div class="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg border border-blue-100/50">
        <div class="flex items-start space-x-3">
          <svg
            class="w-5 h-5 text-blue-500 mt-0.5"
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
          <div class="text-sm">
            <p class="font-medium text-blue-800 mb-1">Seating Planning Tips</p>
            <ul class="text-blue-700 font-light space-y-1 text-xs">
              <li>• Consider mixing friend groups for conversation</li>
              <li>• Keep families with young children near exits</li>
              <li>• Place elderly guests away from loud speakers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableControls;

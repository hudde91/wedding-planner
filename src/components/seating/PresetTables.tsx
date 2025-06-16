import { Component } from "solid-js";
import { pluralize } from "../../utils/validation";

interface PresetTable {
  name: string;
  capacity: number;
  description: string;
}

interface PresetTablesProps {
  onAddTable: (tableData: { name: string; capacity: number }) => void;
}

const PresetTables: Component<PresetTablesProps> = (props) => {
  const presetTables: PresetTable[] = [
    { name: "Head Table", capacity: 8, description: "For the wedding party" },
    { name: "Family Table", capacity: 10, description: "Close family members" },
    { name: "Friends Table", capacity: 8, description: "College friends" },
  ];

  return (
    <div>
      <h4 class="text-lg font-medium text-gray-900 mb-4">
        Quick Add Common Tables
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetTables.map((preset) => (
          <button
            onClick={() =>
              props.onAddTable({
                name: preset.name,
                capacity: preset.capacity,
              })
            }
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
                  <span>{pluralize(preset.capacity, "seat")}</span>
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
  );
};

export default PresetTables;

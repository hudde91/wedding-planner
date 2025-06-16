import { Component, createSignal, Show } from "solid-js";
import { Table, TableShape } from "../../types";
import { sanitizeInput, isValidNumber } from "../../utils/validation";

interface TableFormData {
  name: string;
  capacity: number;
  shape: TableShape;
}

interface TableFormProps {
  initialData?: TableFormData;
  editingTable?: Table | null;
  onSave: (data: TableFormData) => void;
  onCancel: () => void;
  autoSave?: boolean;
}

const TableForm: Component<TableFormProps> = (props) => {
  const [formData, setFormData] = createSignal<TableFormData>(
    props.initialData || { name: "", capacity: 8, shape: "round" }
  );

  const handleFieldChange = (field: keyof TableFormData, value: any) => {
    const updated = { ...formData(), [field]: value };
    setFormData(updated);

    if (
      (props.autoSave && props.editingTable && field !== "name") ||
      (field === "name" && typeof value === "string" && value.trim())
    ) {
      props.onSave(updated);
    }
  };

  const handleSubmit = () => {
    if (!formData().name.trim()) return;
    props.onSave(formData());
  };

  return (
    <div class="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl p-6 border border-indigo-200/50">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {props.editingTable ? "Edit Table" : "Add New Table"}
        </h3>
        <Show when={props.autoSave && props.editingTable}>
          <div class="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span class="text-sm font-medium">Auto-saving changes</span>
          </div>
        </Show>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Table Name
          </label>
          <input
            type="text"
            value={formData().name}
            onInput={(e) =>
              handleFieldChange(
                "name",
                sanitizeInput((e.target as HTMLInputElement).value)
              )
            }
            placeholder="e.g., Head Table, Family Table"
            class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
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
            value={formData().capacity}
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value;
              if (isValidNumber(value)) {
                handleFieldChange("capacity", Number(value));
              }
            }}
            class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
          />
          <Show when={props.editingTable}>
            <p class="text-xs text-amber-600 mt-1">
              ⚠️ Reducing capacity will remove excess seat assignments
            </p>
          </Show>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Shape
          </label>
          <select
            value={formData().shape}
            onChange={(e) =>
              handleFieldChange(
                "shape",
                (e.target as HTMLSelectElement).value as TableShape
              )
            }
            class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
          >
            <option value="round">Round</option>
            <option value="rectangular">Rectangular</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            {formData().shape === "rectangular"
              ? "Seats only on long sides"
              : "Seats arranged in circle"}
          </p>
        </div>
      </div>

      <div class="flex space-x-3 mt-6">
        <Show when={!props.editingTable}>
          <button
            onClick={handleSubmit}
            disabled={!formData().name.trim()}
            class={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              formData().name.trim()
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Create Table
          </button>
        </Show>
        <button
          onClick={props.onCancel}
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
        >
          {props.editingTable ? "Done Editing" : "Cancel"}
        </button>
      </div>
    </div>
  );
};

export default TableForm;

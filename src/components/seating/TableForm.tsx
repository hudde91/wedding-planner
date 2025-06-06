import { createSignal, Component } from "solid-js";
import { Table, TableFormData, TableShape } from "../../types";

interface TableFormProps {
  editingTable: Table | null;
  onSubmit: (tableData: TableFormData) => void;
  onCancel: () => void;
}

const TableForm: Component<TableFormProps> = (props) => {
  const [tableForm, setTableForm] = createSignal<TableFormData>({
    name: props.editingTable?.name || "",
    seats: props.editingTable?.seats.length || 8,
    shape: props.editingTable?.shape || "round",
  });

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    const form = tableForm();

    if (!form.name.trim()) {
      alert("Table name is required");
      return;
    }

    props.onSubmit(form);
  };

  const updateFormField = <K extends keyof TableFormData>(
    field: K,
    value: TableFormData[K]
  ): void => {
    setTableForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h3 class="text-lg font-semibold mb-4">
        {props.editingTable ? "Edit Table" : "Add New Table"}
      </h3>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Table Name *
            </label>
            <input
              type="text"
              value={tableForm().name}
              onInput={(e) =>
                updateFormField("name", (e.target as HTMLInputElement).value)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Head Table, Table 1"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Number of Seats
            </label>
            <input
              type="number"
              value={tableForm().seats}
              onInput={(e) =>
                updateFormField(
                  "seats",
                  parseInt((e.target as HTMLInputElement).value) || 4
                )
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="2"
              max="20"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Table Shape
            </label>
            <select
              value={tableForm().shape}
              onChange={(e) =>
                updateFormField(
                  "shape",
                  (e.target as HTMLSelectElement).value as TableShape
                )
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="round">Round</option>
              <option value="rectangular">Rectangular</option>
            </select>
          </div>
        </div>
        <div class="flex space-x-2">
          <button
            type="submit"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
          >
            {props.editingTable ? "Update Table" : "Add Table"}
          </button>
          <button
            type="button"
            onClick={props.onCancel}
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TableForm;

import { Component } from "solid-js";
import { WeddingPlan } from "../types";

interface WeddingDetailsProps {
  weddingPlan: WeddingPlan;
  updateWeddingDetails: (
    field: keyof WeddingPlan,
    value: string | number
  ) => void;
}

const WeddingDetails: Component<WeddingDetailsProps> = (props) => {
  return (
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Wedding Details</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Partner 1
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Partner 2
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter name"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Budget ($)
          </label>
          <input
            type="number"
            value={props.weddingPlan.budget}
            onInput={(e) =>
              props.updateWeddingDetails(
                "budget",
                Number((e.target as HTMLInputElement).value)
              )
            }
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0"
          />
        </div>
      </div>

      <div class="text-center text-sm text-gray-500">
        <span class="inline-flex items-center">
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          Changes saved automatically
        </span>
      </div>
    </div>
  );
};

export default WeddingDetails;

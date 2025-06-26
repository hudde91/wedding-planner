import { Component, Show } from "solid-js";

interface NoWeddingDateMessageProps {
  hasWeddingDate: boolean;
  isAnalyzing: boolean;
}

const NoWeddingDateMessage: Component<NoWeddingDateMessageProps> = (props) => {
  return (
    <Show when={!props.hasWeddingDate && !props.isAnalyzing}>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg
              class="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-amber-800">
              Set Your Wedding Date
            </h3>
            <p class="text-sm text-amber-700 font-light">
              Add your wedding date in the Details section to get personalized
              planning analysis and timeline recommendations.
            </p>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default NoWeddingDateMessage;

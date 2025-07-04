import { Component, Show } from "solid-js";

interface AnalyzingStateProps {
  isAnalyzing: boolean;
}

const AnalyzingState: Component<AnalyzingStateProps> = (props) => {
  return (
    <Show when={props.isAnalyzing}>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div class="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 py-6 sm:py-8">
          <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div class="text-gray-600 font-light text-center sm:text-left">
            Analyzing your wedding planning progress...
          </div>
        </div>
      </div>
    </Show>
  );
};

export default AnalyzingState;

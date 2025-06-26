import { Component, Show } from "solid-js";

interface AnalyzingStateProps {
  isAnalyzing: boolean;
}

const AnalyzingState: Component<AnalyzingStateProps> = (props) => {
  return (
    <Show when={props.isAnalyzing}>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-center space-x-3 py-8">
          <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div class="text-gray-600 font-light">
            Analyzing your wedding planning progress...
          </div>
        </div>
      </div>
    </Show>
  );
};

export default AnalyzingState;

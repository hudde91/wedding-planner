import { Component, Show } from "solid-js";

interface TimelineHeaderProps {
  isAnalyzing: boolean;
}

const TimelineHeader: Component<TimelineHeaderProps> = (props) => {
  return (
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-light text-gray-900 mb-2 tracking-wide">
          Wedding Planning Timeline
        </h1>
        <p class="text-lg text-gray-600 font-light">
          Your comprehensive planning journey with intelligent insights
        </p>
        <Show when={props.isAnalyzing}>
          <div class="flex items-center space-x-2 mt-2 text-sm text-indigo-600">
            <div class="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="font-light">Analyzing your planning progress...</span>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default TimelineHeader;

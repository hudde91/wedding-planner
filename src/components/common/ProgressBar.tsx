import { Component } from "solid-js";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

// TODO: The progress color is always white in the progress bar, fix this
const ProgressBar: Component<ProgressBarProps> = (props) => {
  const color = props.color || "purple";

  return (
    <div class="mt-4">
      {props.label && (
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>{props.label}</span>
          {props.showPercentage && <span>{Math.round(props.progress)}%</span>}
        </div>
      )}
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class={`bg-gradient-to-r from-${color}-500 to-${color}-600 h-2 rounded-full transition-all duration-300`}
          style={`width: ${Math.min(props.progress, 100)}%`}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

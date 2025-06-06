import { Component } from "solid-js";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "yellow":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      case "green":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "blue":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "purple":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      default:
        return "bg-gradient-to-r from-purple-500 to-purple-600";
    }
  };

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
          class={`${getColorClasses(
            props.color || "purple"
          )} h-2 rounded-full transition-all duration-300`}
          style={`width: ${Math.min(props.progress, 100)}%`}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

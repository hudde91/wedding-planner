import { Component } from "solid-js";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

const StatCard: Component<StatCardProps> = (props) => {
  return (
    <div class={`${props.bgColor} p-4 rounded-lg`}>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class={`w-12 h-12 ${props.bgColor.replace(
              "-50",
              "-100"
            )} rounded-lg flex items-center justify-center`}
          >
            <span class="text-2xl">{props.icon}</span>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">{props.title}</p>
          <p class={`text-2xl font-bold ${props.textColor}`}>{props.value}</p>
          {props.subtitle && (
            <p class="text-xs text-gray-400">{props.subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

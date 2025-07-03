import { Component } from "solid-js";

interface SeatingStepsProps {
  currentStep: 1 | 2;
}

const SeatingSteps: Component<SeatingStepsProps> = (props) => {
  return (
    <div class="flex justify-center mb-8 sm:mb-12">
      <div class="flex items-center space-x-4 sm:space-x-8">
        <div
          class={`flex items-center space-x-2 sm:space-x-3 ${
            props.currentStep >= 1 ? "text-purple-600" : "text-gray-400"
          }`}
        >
          <div
            class={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
              props.currentStep >= 1
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <span class="font-medium text-sm sm:text-base">Select Table</span>
        </div>

        <div
          class={`w-12 sm:w-16 h-0.5 ${
            props.currentStep >= 2 ? "bg-purple-600" : "bg-gray-300"
          }`}
        ></div>

        <div
          class={`flex items-center space-x-2 sm:space-x-3 ${
            props.currentStep >= 2 ? "text-purple-600" : "text-gray-400"
          }`}
        >
          <div
            class={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
              props.currentStep >= 2
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <span class="font-medium text-sm sm:text-base">Assign Guests</span>
        </div>
      </div>
    </div>
  );
};

export default SeatingSteps;

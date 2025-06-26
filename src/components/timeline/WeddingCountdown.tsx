import { Component, Show } from "solid-js";
import { formatShortDate } from "../../utils/date";

interface CountdownData {
  text: string;
  subtext: string;
}

interface WeddingCountdownProps {
  weddingDate?: string;
  countdown: CountdownData;
}

const WeddingCountdown: Component<WeddingCountdownProps> = (props) => {
  return (
    <Show when={props.weddingDate}>
      <div class="animate-fade-in-up-delay-200 text-center mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
        <div class="text-2xl font-light text-gray-900 mb-2">
          {props.countdown.text}
        </div>
        <div class="text-sm text-gray-600 font-light mb-1">
          {formatShortDate(props.weddingDate!)}
        </div>
        <div class="text-xs text-gray-500">{props.countdown.subtext}</div>
      </div>
    </Show>
  );
};

export default WeddingCountdown;

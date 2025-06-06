import { Component, Show } from "solid-js";
import { WeddingPlan } from "../../types";

interface WelcomeSectionProps {
  weddingPlan: WeddingPlan;
  daysUntilWedding: number | null;
}

const WelcomeSection: Component<WelcomeSectionProps> = (props) => {
  const getWeddingDateStatus = () => {
    const days = props.daysUntilWedding;
    if (days === null)
      return { text: "Set your wedding date", color: "text-gray-500" };
    if (days < 0)
      return { text: `${Math.abs(days)} days ago`, color: "text-gray-500" };
    if (days === 0) return { text: "Today!", color: "text-red-600 font-bold" };
    if (days === 1)
      return { text: "Tomorrow!", color: "text-red-600 font-bold" };
    if (days <= 7)
      return { text: `${days} days left`, color: "text-red-600 font-semibold" };
    if (days <= 30)
      return { text: `${days} days left`, color: "text-orange-600" };
    if (days <= 90)
      return { text: `${days} days left`, color: "text-yellow-600" };
    return { text: `${days} days left`, color: "text-green-600" };
  };

  return (
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
      <div class="text-center">
        <div class="text-4xl mb-4">💒</div>
        <Show
          when={
            props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
          }
          fallback={
            <div>
              <h1 class="text-3xl font-bold mb-2">
                Welcome to Your Wedding Planner!
              </h1>
              <p class="text-purple-100">
                Start by adding your wedding details to get organized.
              </p>
            </div>
          }
        >
          <h1 class="text-3xl font-bold mb-2">
            {props.weddingPlan.couple_name1} & {props.weddingPlan.couple_name2}
          </h1>
          <Show when={props.weddingPlan.wedding_date}>
            <p class="text-xl text-purple-100 mb-2">
              {new Date(props.weddingPlan.wedding_date).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </Show>
          <Show when={props.daysUntilWedding !== null}>
            <p
              class={`text-2xl font-semibold ${getWeddingDateStatus().color.replace(
                "text-",
                "text-white "
              )}`}
            >
              {getWeddingDateStatus().text}
            </p>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default WelcomeSection;

import { Component, createSignal, onMount, Show } from "solid-js";
import { WeddingPlan } from "../../types";
import { formatWeddingDate, getWeddingCountdown } from "../../utils/date";

interface HeroSectionProps {
  weddingPlan: WeddingPlan;
}

const HeroSection: Component<HeroSectionProps> = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=600&fit=crop&auto=format",
  ];

  onMount(() => {
    // Rotate hero images every 8 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(interval);
  });

  const countdown = () => getWeddingCountdown(props.weddingPlan.wedding_date);

  return (
    <div class="animate-fade-in-up relative overflow-hidden rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl">
      {/* Background Images with Smooth Transition */}
      <div class="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            class={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImageIndex() ? "opacity-60" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Wedding inspiration ${index + 1}`}
              class="w-full h-full object-cover"
            />
          </div>
        ))}
        <div class="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60"></div>
      </div>

      {/* Content */}
      <div class="relative z-10 p-6 sm:p-8 lg:p-16 text-white min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center">
        <div class="max-w-4xl space-y-4 sm:space-y-6">
          <Show
            when={
              props.weddingPlan.couple_name1 && props.weddingPlan.couple_name2
            }
            fallback={
              <div class="space-y-3 sm:space-y-4">
                <h1 class="text-3xl sm:text-4xl lg:text-6xl font-light tracking-wide">
                  Welcome to Your
                </h1>
                <h1 class="text-3xl sm:text-4xl lg:text-6xl font-light tracking-wide text-rose-200">
                  Wedding Journey
                </h1>
                <p class="text-lg sm:text-xl lg:text-2xl font-light opacity-90 max-w-2xl">
                  Begin planning your perfect day with elegance and ease
                </p>
              </div>
            }
          >
            <div class="space-y-3 sm:space-y-4">
              <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-wide leading-tight">
                {props.weddingPlan.couple_name1}
              </h1>
              <div class="flex items-center justify-center sm:justify-start space-x-4 sm:space-x-6">
                <div class="w-8 sm:w-12 lg:w-16 h-px bg-white/60"></div>
                <span class="text-xl sm:text-2xl lg:text-3xl font-light text-rose-200">
                  &
                </span>
                <div class="w-8 sm:w-12 lg:w-16 h-px bg-white/60"></div>
              </div>
              <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-wide leading-tight">
                {props.weddingPlan.couple_name2}
              </h1>
            </div>

            <Show when={props.weddingPlan.wedding_date}>
              <div class="space-y-2 text-center sm:text-left">
                <p class="text-lg sm:text-xl lg:text-2xl font-light opacity-90">
                  {formatWeddingDate(props.weddingPlan.wedding_date)}
                </p>
                <p
                  class={`text-xl sm:text-2xl lg:text-3xl font-light ${countdown().color.replace(
                    "text-",
                    "text-white "
                  )}`}
                >
                  {countdown().text}
                </p>
              </div>
            </Show>
          </Show>
        </div>
      </div>

      {/* Image Indicators */}
      <div class="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            aria-label={`Show hero image ${index + 1}`}
            onClick={() => setCurrentImageIndex(index)}
            class={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex()
                ? "bg-white scale-125"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

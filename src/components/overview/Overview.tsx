import { Component, createSignal, onMount } from "solid-js";
import { WeddingPlan, TabId } from "../../types";
import { useWeddingStats } from "../../hooks/useWeddingStats";

import HeroSection from "./HeroSection";
import StatsGrid from "./StatsGrid";
import RSVPStatusCard from "./RSVPStatusCard";
import BudgetOverviewCard from "./BudgetOverviewCard";
import PlanningInsightsCard from "./PlanningInsightsCard";
import QuickActionsCard from "./QuickActionsCard";

interface OverviewProps {
  weddingPlan: WeddingPlan;
  onNavigateToTab?: (tabId: TabId) => void;
}

const Overview: Component<OverviewProps> = (props) => {
  const stats = useWeddingStats(() => props.weddingPlan);
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  return (
    <div class="space-y-8">
      <HeroSection weddingPlan={props.weddingPlan} isLoaded={isLoaded} />

      <StatsGrid stats={stats()} isLoaded={isLoaded} />

      <div
        class={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-400 ${
          isLoaded()
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        <RSVPStatusCard stats={stats()} />

        <BudgetOverviewCard stats={stats()} />
      </div>

      <PlanningInsightsCard stats={stats()} isLoaded={isLoaded} />

      <QuickActionsCard
        onNavigateToTab={props.onNavigateToTab}
        isLoaded={isLoaded}
      />
    </div>
  );
};

export default Overview;

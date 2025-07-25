import { Component } from "solid-js";
import { WeddingPlan } from "../../types";
import { useWeddingStats } from "../../hooks/useWeddingStats";

import HeroSection from "./HeroSection";
import StatsGrid from "./StatsGrid";
import RSVPStatusCard from "./RSVPStatusCard";
import BudgetOverviewCard from "./BudgetOverviewCard";
import PlanningInsightsCard from "./PlanningInsightsCard";
import QuickActionsCard from "./QuickActionsCard";

interface OverviewProps {
  weddingPlan: WeddingPlan;
  onNavigateToRoute?: (route: string) => void;
}

const Overview: Component<OverviewProps> = (props) => {
  const stats = useWeddingStats(() => props.weddingPlan);

  return (
    <div class="space-y-6 lg:space-y-8">
      <HeroSection weddingPlan={props.weddingPlan} />

      <StatsGrid stats={stats()} />

      <div class="animate-fade-in-up-delay-400 grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <RSVPStatusCard stats={stats()} />
        <BudgetOverviewCard stats={stats()} />
      </div>

      <PlanningInsightsCard stats={stats()} />

      <QuickActionsCard onNavigateToRoute={props.onNavigateToRoute} />
    </div>
  );
};

export default Overview;

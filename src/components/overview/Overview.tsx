import { Component } from "solid-js";
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

  return (
    <div class="space-y-8">
      <HeroSection weddingPlan={props.weddingPlan} />

      <StatsGrid stats={stats()} />

      <div class="animate-fade-in-up-delay-400 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RSVPStatusCard stats={stats()} />

        <BudgetOverviewCard stats={stats()} />
      </div>

      <PlanningInsightsCard stats={stats()} />

      <QuickActionsCard onNavigateToTab={props.onNavigateToTab} />
    </div>
  );
};

export default Overview;

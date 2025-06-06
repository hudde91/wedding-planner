import { Component } from "solid-js";
import { WeddingPlan } from "../../types";
import { useWeddingStats } from "../../hooks/useWeddingStats";
import WelcomeSection from "./WelcomeSection";
import StatsGrid from "./StatsGrid";
import RSVPBreakdown from "./RSVPBreakdown";
import BudgetBreakdown from "./BudgetBreakdown";
import QuickActions from "./QuickActions";
import PlanningTips from "./PlanningTips";

interface OverviewProps {
  weddingPlan: WeddingPlan;
}

const Overview: Component<OverviewProps> = (props) => {
  const stats = useWeddingStats(() => props.weddingPlan);

  return (
    <div class="space-y-6">
      <WelcomeSection
        weddingPlan={props.weddingPlan}
        daysUntilWedding={stats().daysUntilWedding}
      />

      <StatsGrid
        daysUntilWedding={stats().daysUntilWedding}
        totalAttendees={stats().totalAttendees}
        totalGuests={stats().totalGuests}
        remainingBudget={stats().remainingBudget}
        totalBudget={stats().totalBudget}
        totalSpent={stats().totalSpent}
        todoProgress={stats().todoProgress}
        completedTodos={stats().completedTodos}
        totalTodos={stats().totalTodos}
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RSVPBreakdown
          attendingGuests={stats().attendingGuests}
          declinedGuests={stats().declinedGuests}
          pendingGuests={stats().pendingGuests}
          totalGuests={stats().totalGuests}
          totalAttendees={stats().totalAttendees}
        />

        <BudgetBreakdown
          totalBudget={stats().totalBudget}
          totalSpent={stats().totalSpent}
          remainingBudget={stats().remainingBudget}
        />
      </div>

      <QuickActions />

      <PlanningTips
        daysUntilWedding={stats().daysUntilWedding}
        pendingGuests={stats().pendingGuests}
        totalAttendees={stats().totalAttendees}
        occupiedSeats={stats().occupiedSeats}
        totalTodos={stats().totalTodos}
        totalGuests={stats().totalGuests}
      />
    </div>
  );
};

export default Overview;

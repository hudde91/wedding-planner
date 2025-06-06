import { Component } from "solid-js";
import StatCard from "../common/StatCard";

interface StatsGridProps {
  daysUntilWedding: number | null;
  totalAttendees: number;
  totalGuests: number;
  remainingBudget: number;
  totalBudget: number;
  totalSpent: number;
  todoProgress: number;
  completedTodos: number;
  totalTodos: number;
}

const StatsGrid: Component<StatsGridProps> = (props) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Days Until Wedding"
        value={props.daysUntilWedding !== null ? props.daysUntilWedding : "—"}
        icon="📅"
        bgColor="bg-red-50"
        textColor="text-red-600"
      />

      <StatCard
        title="Total Attendees"
        value={props.totalAttendees}
        subtitle={`${props.totalGuests} invited`}
        icon="👥"
        bgColor="bg-blue-50"
        textColor="text-blue-600"
      />

      <StatCard
        title="Budget Remaining"
        value={formatCurrency(props.remainingBudget)}
        subtitle={`${formatCurrency(
          props.totalSpent
        )} spent of ${formatCurrency(props.totalBudget)}`}
        icon="💰"
        bgColor="bg-green-50"
        textColor={
          props.remainingBudget < 0 ? "text-red-600" : "text-green-600"
        }
      />

      <StatCard
        title="Planning Progress"
        value={`${Math.round(props.todoProgress)}%`}
        subtitle={`${props.completedTodos} of ${props.totalTodos} tasks`}
        icon="✅"
        bgColor="bg-purple-50"
        textColor="text-purple-600"
      />
    </div>
  );
};

export default StatsGrid;

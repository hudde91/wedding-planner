import { Component, For } from "solid-js";
import { TodoItem } from "../../types";
import { pluralize } from "../../utils/validation";
import PlanningPhase from "./PlanningPhase";

interface PlanningPhaseData {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  priority: "critical" | "high" | "medium" | "low";
  tasks: TodoItem[];
  completionRate: number;
  isActive: boolean;
  isOverdue: boolean;
}

interface PlanningPhasesListProps {
  phases: PlanningPhaseData[];
  expandedPhases: Set<string>;
  onTogglePhase: (phaseId: string) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const PlanningPhasesList: Component<PlanningPhasesListProps> = (props) => {
  return (
    <div class="animate-fade-in-up-delay-200 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-medium text-gray-900">Planning Phases</h2>
        <div class="text-sm text-gray-500 font-light">
          {pluralize(
            props.phases.filter((p) => p.isActive).length,
            "active phase"
          )}
        </div>
      </div>

      <For each={props.phases}>
        {(phase, index) => {
          const getDelayClass = () => {
            switch (index() % 3) {
              case 0:
                return "animate-fade-in-up-delay-400";
              case 1:
                return "animate-fade-in-up-delay-600";
              default:
                return "animate-fade-in-up";
            }
          };

          return (
            <div class={getDelayClass()}>
              <PlanningPhase
                phase={phase}
                isExpanded={props.expandedPhases.has(phase.id)}
                onToggle={() => props.onTogglePhase(phase.id)}
                onToggleTodo={props.onToggleTodo}
                onDeleteTodo={props.onDeleteTodo}
              />
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default PlanningPhasesList;

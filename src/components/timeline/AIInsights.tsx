import { Component, Show, For } from "solid-js";

interface AIInsight {
  type: "budget" | "timeline" | "priority" | "risk" | "optimization";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  actionable: boolean;
  suggestedActions?: string[];
}

interface AIAnalysis {
  overallScore: number;
  insights: AIInsight[];
  recommendations: string[];
}

interface AIInsightsProps {
  analysis: AIAnalysis | null;
  isAnalyzing: boolean;
}

const AIInsights: Component<AIInsightsProps> = (props) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Show when={props.analysis && !props.isAnalyzing}>
      <div class="animate-fade-in-up-delay-600 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div class="flex items-center space-x-3 mb-4 sm:mb-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-medium text-gray-900">
                Planning Analysis
              </h3>
              <p class="text-sm text-gray-600 font-light">
                Personalized insights based on your current progress
              </p>
            </div>
          </div>
          <div class="text-center sm:text-right">
            <div class="text-xl sm:text-2xl font-light text-indigo-600">
              {props.analysis?.overallScore || 0}/100
            </div>
            <div class="text-xs text-gray-500 font-light">Planning Score</div>
          </div>
        </div>

        <Show when={props.analysis?.insights?.length ?? 0 > 0}>
          <div class="space-y-3 mb-4 sm:mb-6">
            <For each={props.analysis?.insights?.slice(0, 3)}>
              {(insight: AIInsight) => (
                <div
                  class={`p-3 sm:p-4 rounded-lg border ${getSeverityColor(
                    insight.severity
                  )}`}
                >
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex-1 min-w-0 mb-2 sm:mb-0">
                      <h4 class="font-medium mb-1 text-sm sm:text-base">
                        {insight.title}
                      </h4>
                      <p class="text-xs sm:text-sm font-light leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                    <div class="text-xs uppercase tracking-wide font-medium sm:ml-4 self-start">
                      {insight.severity}
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={props.analysis?.recommendations?.length ?? 0 > 0}>
          <div class="border-t border-gray-100 pt-4">
            <h4 class="font-medium text-gray-900 mb-3 text-sm sm:text-base">
              Top Recommendations
            </h4>
            <div class="space-y-2">
              <For each={props.analysis?.recommendations?.slice(0, 3)}>
                {(recommendation: string) => (
                  <div class="flex items-start space-x-3 text-sm">
                    <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span class="text-gray-700 font-light leading-relaxed">
                      {recommendation}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export default AIInsights;

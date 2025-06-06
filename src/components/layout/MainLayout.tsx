import { Component, Accessor, Setter } from "solid-js";
import { WeddingPlan } from "../../types";
import Sidebar from "./Sidebar";
import Header from "./Header";

type TabId = "overview" | "details" | "todos" | "guests" | "seating";

interface MainLayoutProps {
  activeTab: Accessor<TabId>;
  setActiveTab: Setter<TabId>;
  sidebarOpen: Accessor<boolean>;
  setSidebarOpen: Setter<boolean>;
  weddingPlan: WeddingPlan;
  children: any;
}

const MainLayout: Component<MainLayoutProps> = (props) => {
  return (
    <div class="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
        isOpen={props.sidebarOpen}
        setIsOpen={props.setSidebarOpen}
        weddingPlan={props.weddingPlan}
      />

      <div
        class={`flex-1 transition-all duration-300 ${
          props.sidebarOpen() ? "ml-64" : "ml-16"
        }`}
      >
        <Header
          activeTab={props.activeTab()}
          weddingPlan={props.weddingPlan}
          onToggleSidebar={() => props.setSidebarOpen(!props.sidebarOpen())}
        />

        <main class="p-6">
          <div class="max-w-7xl mx-auto">{props.children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

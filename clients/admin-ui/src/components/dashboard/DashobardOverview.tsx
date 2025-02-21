"use client";

import { Layers, MessageSquareDiff, Store } from "lucide-react";
import DashboardCard from "../shared/dashboard/dashboardCard";

function DashobardOverview() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <DashboardCard
        icon={<Layers />}
        title="Sells Overview"
        color="success"
        percentage="+34%"
        amount="$2,500"
      />
      <DashboardCard
        icon={<Store />}
        title="Total Orders"
        color="error"
        percentage="-10%"
        amount="12"
      />
      <DashboardCard
        icon={<MessageSquareDiff />}
        title="Shop Reviews"
        color="success"
        percentage="+3%"
        amount="23"
      />
    </div>
  );
}

export default DashobardOverview;

"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { ExportPanel } from "@/components/dashboard/ExportPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AttendanceForm } from "@/components/forms/AttendanceForm";
import { useStats } from "@/hooks/useData";
import { useState } from "react";
import type { AttendanceStatus } from "@/types";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useStats();
  const [formOpen, setFormOpen] = useState(false);
  const [preselectedStatus, setPreselectedStatus] = useState<
    AttendanceStatus | undefined
  >();

  const openForm = (status?: AttendanceStatus) => {
    setPreselectedStatus(status);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      </AppShell>
    );
  }

  if (error || !data) {
    return (
      <AppShell>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-red-600">{error || "Failed to load data"}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Analytics
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Visual insights into your attendance patterns
          </p>
        </div>

        <AnalyticsCharts
          trend={data.analytics.trend}
          subjectBar={data.analytics.subjectBar}
          distribution={data.analytics.distribution}
          monthlyPie={data.analytics.monthlyPie}
        />

        <QuickActions
          onOpenForm={openForm}
          currentPercentage={data.overall.attendancePercentage}
          currentTotal={data.overall.totalClasses}
        />

        <ExportPanel
          records={data.records}
          subjectStats={data.subjectStats}
          overallPercentage={data.overall.attendancePercentage}
        />
      </div>

      <AttendanceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={refetch}
        preselectedStatus={preselectedStatus}
      />
    </AppShell>
  );
}

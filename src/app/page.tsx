"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SubjectTable } from "@/components/dashboard/SubjectTable";
import { AttendanceCalendar } from "@/components/calendar/AttendanceCalendar";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ExportPanel } from "@/components/dashboard/ExportPanel";
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets";
import { AttendanceHistoryTable } from "@/components/dashboard/AttendanceHistoryTable";
import { AttendanceForm } from "@/components/forms/AttendanceForm";
import { useStats } from "@/hooks/useData";
import type { AttendanceStatus } from "@/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
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
        <StatsCards overall={data.overall} streak={data.streak} />

        <QuickActions
          onOpenForm={openForm}
          currentPercentage={data.overall.attendancePercentage}
          currentTotal={data.overall.totalClasses}
        />

        <SubjectTable subjectStats={data.subjectStats} />

        <AttendanceCalendar records={data.records} onDeleted={refetch} />

        <AttendanceHistoryTable records={data.records} onDeleted={refetch} />

        <DashboardWidgets
          monthlySummaries={data.monthlySummaries}
          weeklyReports={data.weeklyReports}
          riskAlerts={data.riskAlerts}
          ranking={data.ranking}
          missedHistory={data.missedHistory}
          semesterSummary={data.semesterSummary}
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

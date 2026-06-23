"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type {
  MonthlySummary,
  WeeklyReport,
  RiskAlert,
  SubjectStats,
} from "@/types";
import {
  AlertTriangle,
  Trophy,
  CalendarDays,
  BookOpen,
  History,
  TrendingDown,
} from "lucide-react";
import { cn, formatDisplayDate } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface DashboardWidgetsProps {
  monthlySummaries: MonthlySummary[];
  weeklyReports: WeeklyReport[];
  riskAlerts: RiskAlert[];
  ranking: (SubjectStats & { rank: number })[];
  missedHistory: {
    id: string;
    date: string;
    subjectName: string;
    module: string;
    remarks: string | null;
  }[];
  semesterSummary: {
    totalSubjects: number;
    subjectsAtRisk: number;
    perfectSubjects: number;
    streak: number;
    attendancePercentage: number;
    totalClasses: number;
  };
}

export function DashboardWidgets({
  monthlySummaries,
  weeklyReports,
  riskAlerts,
  ranking,
  missedHistory,
  semesterSummary,
}: DashboardWidgetsProps) {
  const latestMonth = monthlySummaries[monthlySummaries.length - 1];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Semester Summary
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Subjects</p>
            <p className="text-xl font-bold">{semesterSummary.totalSubjects}</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">At Risk</p>
            <p className="text-xl font-bold text-amber-600">
              {semesterSummary.subjectsAtRisk}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Perfect (100%)</p>
            <p className="text-xl font-bold text-emerald-600">
              {semesterSummary.perfectSubjects}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Overall</p>
            <p className="text-xl font-bold">{semesterSummary.attendancePercentage}%</p>
          </div>
        </div>
      </Card>

      {latestMonth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Monthly Summary
            </CardTitle>
          </CardHeader>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              {latestMonth.month}
            </p>
            <div className="flex justify-between">
              <span className="text-zinc-500">Classes</span>
              <span>{latestMonth.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-600">Present</span>
              <span>{latestMonth.present}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Absent</span>
              <span>{latestMonth.absent}</span>
            </div>
            <ProgressBar value={latestMonth.percentage} />
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Subject Ranking
          </CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {ranking.slice(0, 5).map((s) => (
            <div key={s.subjectId} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold dark:bg-zinc-800">
                  {s.rank}
                </span>
                <span className="truncate max-w-[160px]" title={s.name}>
                  {s.name}
                </span>
              </span>
              <span className="font-semibold text-emerald-600">
                {s.attendancePercentage}%
              </span>
            </div>
          ))}
          {ranking.length === 0 && (
            <p className="text-sm text-zinc-500">No data yet</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Risk Alerts
          </CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {riskAlerts.length === 0 ? (
            <p className="text-sm text-emerald-600">All subjects are on track!</p>
          ) : (
            riskAlerts.map((alert) => (
              <div
                key={alert.subjectId}
                className={cn(
                  "rounded-lg border p-2.5 text-xs",
                  alert.severity === "danger"
                    ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                    : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                )}
              >
                <p className="font-medium">{alert.subjectName}</p>
                <p className="text-zinc-600 dark:text-zinc-400">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" /> Weekly Report
          </CardTitle>
        </CardHeader>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {weeklyReports.map((w, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 text-xs">{w.week}</span>
              <span className="font-medium">{w.percentage}%</span>
            </div>
          ))}
          {weeklyReports.length === 0 && (
            <p className="text-sm text-zinc-500">No weekly data</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" /> Missed Class History
          </CardTitle>
        </CardHeader>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {missedHistory.slice(0, 8).map((m) => (
            <div key={m.id} className="flex items-start justify-between text-sm">
              <div>
                <p className="font-medium truncate max-w-[180px]" title={m.subjectName}>
                  {m.subjectName}
                </p>
                <p className="text-xs text-zinc-500">{formatDisplayDate(m.date)}</p>
              </div>
              {m.remarks && (
                <span className="text-xs text-zinc-400 truncate max-w-[80px]" title={m.remarks}>
                  {m.remarks}
                </span>
              )}
            </div>
          ))}
          {missedHistory.length === 0 && (
            <p className="text-sm text-emerald-600">No absences recorded!</p>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/Card";
import { EligibilityBadge } from "@/components/ui/Badge";
import type { OverallStats } from "@/types";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Briefcase,
  Percent,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  overall: OverallStats;
  streak: number;
}

export function StatsCards({ overall, streak }: StatsCardsProps) {
  const cards = [
    {
      label: "Overall Attendance",
      value: `${overall.attendancePercentage}%`,
      icon: Percent,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Classes",
      value: overall.totalClasses,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Present",
      value: overall.present,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Absent",
      value: overall.absent,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "OD",
      value: overall.od,
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Current Streak",
      value: `${streak} day${streak !== 1 ? "s" : ""}`,
      icon: Flame,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Overview
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Minimum 75% attendance required for end-term eligibility
          </p>
        </div>
        <EligibilityBadge status={overall.eligibility} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {card.value}
                  </p>
                </div>
                <div className={cn("rounded-lg p-2", card.bg)}>
                  <Icon className={cn("h-4 w-4", card.color)} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

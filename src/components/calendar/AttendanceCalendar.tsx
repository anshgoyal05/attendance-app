"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AttendanceRecord } from "@/types";
import { STATUS_COLORS } from "@/lib/constants";
import { cn, getShortSubjectName } from "@/lib/utils";

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = getDay(monthStart);
  const paddedDays: (Date | null)[] = [
    ...Array.from({ length: startPadding }, () => null),
    ...days,
  ];

  const getRecordsForDay = (day: Date) =>
    records.filter((r) => isSameDay(new Date(r.date), day));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-[120px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="mb-3 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> OD
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Absent
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
          >
            {d}
          </div>
        ))}

        {paddedDays.map((day, i) => {
          if (!day) {
            return <div key={`pad-${i}`} className="min-h-[80px]" />;
          }

          const dayRecords = getRecordsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[80px] rounded-lg border p-1.5 transition-colors",
                isSameMonth(day, currentMonth)
                  ? "border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/30"
                  : "border-transparent opacity-40",
                isToday && "ring-2 ring-zinc-900 dark:ring-white"
              )}
            >
              <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayRecords.map((r) => (
                  <div
                    key={r.id}
                    className={cn(
                      "rounded px-1 py-0.5 text-[10px] leading-tight text-white truncate",
                      STATUS_COLORS[r.status].calendar
                    )}
                    title={`${r.subject?.name} - ${r.status}${r.lectureCount > 1 ? ` (${r.lectureCount} lectures)` : ""}`}
                  >
                    <div className="truncate font-medium flex items-center justify-between">
                      <span className="truncate">{getShortSubjectName(r.subject?.name || "")}</span>
                      {r.lectureCount > 1 && (
                        <span className="ml-1 rounded bg-black/20 px-1 text-[9px] font-bold">
                          {r.lectureCount}x
                        </span>
                      )}
                    </div>
                    <div className="opacity-90">
                      {r.status === "PRESENT"
                        ? "Present"
                        : r.status === "OD"
                          ? "OD"
                          : "Absent"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

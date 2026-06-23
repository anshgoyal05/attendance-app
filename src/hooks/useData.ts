"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AttendanceRecord,
  OverallStats,
  SubjectStats,
  MonthlySummary,
  WeeklyReport,
  RiskAlert,
  Subject,
} from "@/types";

interface StatsData {
  overall: OverallStats;
  subjectStats: SubjectStats[];
  records: AttendanceRecord[];
  streak: number;
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
  semesterSummary: OverallStats & {
    totalSubjects: number;
    subjectsAtRisk: number;
    perfectSubjects: number;
    streak: number;
  };
  analytics: {
    trend: { date: string; percentage: number; total: number }[];
    subjectBar: {
      name: string;
      fullName: string;
      percentage: number;
      present: number;
      absent: number;
      od: number;
    }[];
    distribution: { name: string; value: number; color: string }[];
    monthlyPie: { name: string; value: number; percentage: number }[];
  };
}

export function useStats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subjects")
      .then((r) => r.json())
      .then(setSubjects)
      .finally(() => setLoading(false));
  }, []);

  return { subjects, loading };
}

export async function saveAttendance(payload: {
  date: string;
  subjectId: string;
  status: string;
  remarks?: string;
}) {
  const res = await fetch("/api/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to save");
  }
  return res.json();
}

export async function deleteAttendance(id: string) {
  const res = await fetch(`/api/attendance?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}

import type { AttendanceRecord, EligibilityStatus, OverallStats, PredictionResult, SubjectStats, MonthlySummary, WeeklyReport, RiskAlert } from "@/types";
import { ATTENDANCE_THRESHOLD, WARNING_THRESHOLD } from "./constants";
import { format, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from "date-fns";

export function getEligibility(percentage: number): EligibilityStatus {
  if (percentage < ATTENDANCE_THRESHOLD) return "not-eligible";
  if (percentage < WARNING_THRESHOLD) return "warning";
  return "eligible";
}

export function calculatePercentage(
  present: number,
  od: number,
  total: number
): number {
  if (total === 0) return 100;
  return Math.round(((present + od) / total) * 1000) / 10;
}

export function calculateSubjectStats(
  subjectId: string,
  name: string,
  module: string,
  records: AttendanceRecord[]
): SubjectStats {
  const total = records.reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const present = records
    .filter((r) => r.status === "PRESENT")
    .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const absent = records
    .filter((r) => r.status === "ABSENT")
    .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const od = records
    .filter((r) => r.status === "OD")
    .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const attendancePercentage = calculatePercentage(present, od, total);

  return {
    subjectId,
    name,
    module,
    total,
    present,
    absent,
    od,
    attendancePercentage,
    eligibility: getEligibility(attendancePercentage),
  };
}

export function calculateOverallStats(records: AttendanceRecord[]): OverallStats {
  const totalClasses = records.reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const present = records
    .filter((r) => r.status === "PRESENT")
    .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const absent = records
    .filter((r) => r.status === "ABSENT")
    .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const od = records
    .filter((r) => r.status === "OD")
    .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
  const attendancePercentage = calculatePercentage(present, od, totalClasses);

  return {
    totalClasses,
    present,
    absent,
    od,
    attendancePercentage,
    eligibility: getEligibility(attendancePercentage),
  };
}

export function predictAttendance(
  currentPercentage: number,
  currentTotal: number
): PredictionResult {
  const presentAndOd = Math.round((currentPercentage / 100) * currentTotal);

  let canMiss = 0;
  for (let miss = 0; miss <= 50; miss++) {
    const newTotal = currentTotal + miss;
    const pct = (presentAndOd / newTotal) * 100;
    if (pct >= ATTENDANCE_THRESHOLD) {
      canMiss = miss;
    } else {
      break;
    }
  }

  let needToAttend = 0;
  if (currentPercentage < ATTENDANCE_THRESHOLD) {
    for (let attend = 1; attend <= 50; attend++) {
      const newTotal = currentTotal + attend;
      const newPresent = presentAndOd + attend;
      const pct = (newPresent / newTotal) * 100;
      if (pct >= ATTENDANCE_THRESHOLD) {
        needToAttend = attend;
        break;
      }
    }
  }

  let message = "";
  if (currentPercentage >= ATTENDANCE_THRESHOLD) {
    message = `You can miss ${canMiss} more class${canMiss !== 1 ? "es" : ""} and still remain above ${ATTENDANCE_THRESHOLD}%.`;
  } else if (needToAttend > 0) {
    message = `Attend the next ${needToAttend} class${needToAttend !== 1 ? "es" : ""} continuously to reach ${ATTENDANCE_THRESHOLD}%.`;
  } else {
    message = `Continue attending classes to improve your attendance above ${ATTENDANCE_THRESHOLD}%.`;
  }

  return { canMiss, needToAttend, message };
}

export function calculateStreak(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0;

  const sorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  for (const record of sorted) {
    if (record.status === "PRESENT" || record.status === "OD") {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getMonthlySummaries(records: AttendanceRecord[]): MonthlySummary[] {
  if (records.length === 0) return [];

  const dates = records.map((r) => new Date(r.date));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const months = eachMonthOfInterval({ start: minDate, end: maxDate });

  return months.map((monthStart) => {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const monthRecords = records.filter((r) => {
      const d = new Date(r.date);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    });

    const present = monthRecords
      .filter((r) => r.status === "PRESENT")
      .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
    const absent = monthRecords
      .filter((r) => r.status === "ABSENT")
      .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
    const od = monthRecords
      .filter((r) => r.status === "OD")
      .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
    const total = monthRecords.reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);

    return {
      month: format(monthStart, "MMM yyyy"),
      total,
      present,
      absent,
      od,
      percentage: calculatePercentage(present, od, total),
    };
  });
}

export function getWeeklyReports(records: AttendanceRecord[]): WeeklyReport[] {
  if (records.length === 0) return [];

  const dates = records.map((r) => new Date(r.date));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const weeks = eachWeekOfInterval({ start: minDate, end: maxDate }, { weekStartsOn: 1 });

  return weeks
    .map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekRecords = records.filter((r) => {
        const d = new Date(r.date);
        return isWithinInterval(d, { start: weekStart, end: weekEnd });
      });

      if (weekRecords.length === 0) return null;

      const total = weekRecords.reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);
      const attended = weekRecords
        .filter((r) => r.status === "PRESENT" || r.status === "OD")
        .reduce((sum, r) => sum + (r.lectureCount ?? 1), 0);

      return {
        week: `${format(weekStart, "dd MMM")} - ${format(weekEnd, "dd MMM")}`,
        total,
        attended,
        percentage: total > 0 ? Math.round((attended / total) * 1000) / 10 : 100,
      };
    })
    .filter((w): w is WeeklyReport => w !== null)
    .slice(-8);
}

export function getRiskAlerts(subjectStats: SubjectStats[]): RiskAlert[] {
  return subjectStats
    .filter((s) => s.total > 0 && s.attendancePercentage < WARNING_THRESHOLD)
    .map((s) => ({
      subjectId: s.subjectId,
      subjectName: s.name,
      currentPercentage: s.attendancePercentage,
      severity: (s.attendancePercentage < ATTENDANCE_THRESHOLD ? "danger" : "warning") as "danger" | "warning",
      message:
        s.attendancePercentage < ATTENDANCE_THRESHOLD
          ? `${s.name} is below ${ATTENDANCE_THRESHOLD}% — not eligible for end-term exam.`
          : `${s.name} is between ${ATTENDANCE_THRESHOLD}-${WARNING_THRESHOLD}% — attendance at risk.`,
    }))
    .sort((a, b) => a.currentPercentage - b.currentPercentage);
}

export function getTrendData(records: AttendanceRecord[]) {
  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let presentCount = 0;
  let odCount = 0;
  let runningTotal = 0;

  return sorted.map((record) => {
    const count = record.lectureCount ?? 1;
    if (record.status === "PRESENT") presentCount += count;
    if (record.status === "OD") odCount += count;
    runningTotal += count;
    const percentage = calculatePercentage(presentCount, odCount, runningTotal);

    return {
      date: format(new Date(record.date), "dd MMM"),
      percentage,
      total: runningTotal,
    };
  });
}

export function getSubjectBarData(subjectStats: SubjectStats[]) {
  return subjectStats.map((s) => ({
    name: s.name.length > 20 ? s.name.slice(0, 18) + "…" : s.name,
    fullName: s.name,
    percentage: s.attendancePercentage,
    present: s.present,
    absent: s.absent,
    od: s.od,
  }));
}

export function getDistributionData(overall: OverallStats) {
  return [
    { name: "Present", value: overall.present, color: "#10b981" },
    { name: "Absent", value: overall.absent, color: "#ef4444" },
    { name: "OD", value: overall.od, color: "#3b82f6" },
  ].filter((d) => d.value > 0);
}

export function getMonthlyPieData(monthlySummaries: MonthlySummary[]) {
  return monthlySummaries.map((m) => ({
    name: m.month,
    value: m.total,
    percentage: m.percentage,
  }));
}

export function rankSubjects(subjectStats: SubjectStats[]) {
  return [...subjectStats]
    .filter((s) => s.total > 0)
    .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
    .map((s, index) => ({ ...s, rank: index + 1 }));
}

export function getMissedClassHistory(records: AttendanceRecord[]) {
  return records
    .filter((r) => r.status === "ABSENT")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((r) => ({
      id: r.id,
      date: r.date,
      subjectName: r.subject?.name || "Unknown",
      module: r.subject?.module || "",
      lectureCount: r.lectureCount ?? 1,
      remarks: r.remarks,
    }));
}

export function getSemesterSummary(records: AttendanceRecord[], subjectStats: SubjectStats[]) {
  const overall = calculateOverallStats(records);
  const atRisk = subjectStats.filter((s) => s.eligibility !== "eligible").length;
  const perfect = subjectStats.filter((s) => s.attendancePercentage === 100 && s.total > 0).length;

  return {
    ...overall,
    totalSubjects: subjectStats.length,
    subjectsAtRisk: atRisk,
    perfectSubjects: perfect,
    streak: calculateStreak(records),
  };
}

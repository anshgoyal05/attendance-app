import { NextResponse } from "next/server";
import { getAttendanceForStats } from "@/lib/db";
import {
  calculateOverallStats,
  calculateSubjectStats,
  calculateStreak,
  getMonthlySummaries,
  getWeeklyReports,
  getRiskAlerts,
  getTrendData,
  getSubjectBarData,
  getDistributionData,
  getMonthlyPieData,
  rankSubjects,
  getMissedClassHistory,
  getSemesterSummary,
} from "@/lib/calculations";

export async function GET() {
  try {
    const { subjects, records } = await getAttendanceForStats();

    const subjectStats = subjects.map((subject) => {
      const subjectRecords = records.filter((r) => r.subjectId === subject.id);
      return calculateSubjectStats(
        subject.id,
        subject.name,
        subject.module,
        subjectRecords
      );
    });

    const overall = calculateOverallStats(records);
    const monthlySummaries = getMonthlySummaries(records);
    const weeklyReports = getWeeklyReports(records);
    const riskAlerts = getRiskAlerts(subjectStats);
    const ranking = rankSubjects(subjectStats);
    const missedHistory = getMissedClassHistory(records);
    const semesterSummary = getSemesterSummary(records, subjectStats);

    return NextResponse.json({
      overall,
      subjectStats,
      records,
      streak: calculateStreak(records),
      monthlySummaries,
      weeklyReports,
      riskAlerts,
      ranking,
      missedHistory,
      semesterSummary,
      analytics: {
        trend: getTrendData(records),
        subjectBar: getSubjectBarData(subjectStats),
        distribution: getDistributionData(overall),
        monthlyPie: getMonthlyPieData(monthlySummaries),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

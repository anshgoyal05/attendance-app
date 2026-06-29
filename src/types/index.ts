export type AttendanceStatus = "PRESENT" | "ABSENT" | "OD";

export interface Subject {
  id: string;
  name: string;
  module: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subjectId: string;
  status: AttendanceStatus;
  lectureCount: number;
  remarks: string | null;
  createdAt: string;
  subject?: Subject;
}

export interface SubjectStats {
  subjectId: string;
  name: string;
  module: string;
  total: number;
  present: number;
  absent: number;
  od: number;
  attendancePercentage: number;
  eligibility: EligibilityStatus;
}

export type EligibilityStatus = "eligible" | "warning" | "not-eligible";

export interface OverallStats {
  totalClasses: number;
  present: number;
  absent: number;
  od: number;
  attendancePercentage: number;
  eligibility: EligibilityStatus;
}

export interface PredictionResult {
  canMiss: number;
  needToAttend: number;
  message: string;
}

export interface MonthlySummary {
  month: string;
  total: number;
  present: number;
  absent: number;
  od: number;
  percentage: number;
}

export interface WeeklyReport {
  week: string;
  total: number;
  attended: number;
  percentage: number;
}

export interface RiskAlert {
  subjectId: string;
  subjectName: string;
  currentPercentage: number;
  message: string;
  severity: "warning" | "danger";
}

export interface AttendanceFormDraft {
  date: string;
  subjectId: string;
  status: AttendanceStatus;
  lectureCount: number;
  remarks: string;
}

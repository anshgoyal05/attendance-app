export const ATTENDANCE_THRESHOLD = 75;
export const WARNING_THRESHOLD = 80;

export const STATUS_LABELS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  OD: "OD",
} as const;

export const STATUS_COLORS = {
  PRESENT: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
    calendar: "bg-emerald-500",
  },
  ABSENT: {
    bg: "bg-red-500/15",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-500",
    calendar: "bg-red-500",
  },
  OD: {
    bg: "bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
    calendar: "bg-blue-500",
  },
} as const;

export const ELIGIBILITY_CONFIG = {
  eligible: {
    label: "Eligible",
    description: "Attendance ≥ 75%",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  warning: {
    label: "Warning",
    description: "Attendance between 75% and 80%",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
  },
  "not-eligible": {
    label: "Not Eligible",
    description: "Attendance < 75%",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-500",
  },
} as const;

export const FORM_DRAFT_KEY = "attendance-form-draft";
export const THEME_KEY = "attendance-theme";

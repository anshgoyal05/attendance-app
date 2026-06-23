import { cn } from "@/lib/utils";
import type { EligibilityStatus } from "@/types";
import { ELIGIBILITY_CONFIG } from "@/lib/constants";

interface BadgeProps {
  status: EligibilityStatus;
  className?: string;
}

export function EligibilityBadge({ status, className }: BadgeProps) {
  const config = ELIGIBILITY_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.bg,
        config.border,
        config.color,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: "PRESENT" | "ABSENT" | "OD";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = {
    PRESENT: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    ABSENT: "bg-red-500/15 text-red-600 dark:text-red-400",
    OD: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  };
  const labels = { PRESENT: "Present", ABSENT: "Absent", OD: "OD" };

  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        colors[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}

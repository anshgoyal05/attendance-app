import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel = true }: ProgressBarProps) {
  const color =
    value >= 80
      ? "bg-emerald-500"
      : value >= 75
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{value}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-900",
        "transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-zinc-500 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

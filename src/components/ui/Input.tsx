import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm",
        "text-zinc-900 placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent",
        "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
        "dark:placeholder:text-zinc-500 dark:focus:ring-zinc-600",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm",
      "text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300",
      "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
      "dark:focus:ring-zinc-600 transition-all duration-200",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm",
      "text-zinc-900 placeholder:text-zinc-400 resize-none",
      "focus:outline-none focus:ring-2 focus:ring-zinc-300",
      "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
      "dark:placeholder:text-zinc-500 dark:focus:ring-zinc-600",
      "transition-all duration-200",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5",
        className
      )}
      {...props}
    />
  );
}

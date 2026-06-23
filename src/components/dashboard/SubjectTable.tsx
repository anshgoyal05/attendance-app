"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { EligibilityBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { SubjectStats } from "@/types";
import { Search, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = keyof Pick<
  SubjectStats,
  "name" | "module" | "total" | "present" | "absent" | "od" | "attendancePercentage"
>;

interface SubjectTableProps {
  subjectStats: SubjectStats[];
}

export function SubjectTable({ subjectStats }: SubjectTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "eligible" | "warning" | "not-eligible">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let data = [...subjectStats];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.module.toLowerCase().includes(q)
      );
    }

    if (filter !== "all") {
      data = data.filter((s) => s.eligibility === filter);
    }

    data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return data;
  }, [subjectStats, search, filter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "name", label: "Subject" },
    { key: "module", label: "Module" },
    { key: "total", label: "Total" },
    { key: "present", label: "Present" },
    { key: "absent", label: "Absent" },
    { key: "od", label: "OD" },
    { key: "attendancePercentage", label: "Att. %" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Attendance</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 pl-8"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="all">All</option>
            <option value="eligible">Eligible</option>
            <option value="warning">Warning</option>
            <option value="not-eligible">Not Eligible</option>
          </select>
        </div>
      </CardHeader>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="cursor-pointer px-3 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.subjectId}
                className="border-b border-zinc-50 hover:bg-zinc-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-3 py-3 font-medium text-zinc-900 dark:text-zinc-100 max-w-[200px]">
                  <div className="truncate" title={s.name}>
                    {s.name}
                  </div>
                  <ProgressBar
                    value={s.attendancePercentage}
                    showLabel={false}
                    className="mt-2 max-w-[180px]"
                  />
                </td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                  {s.module}
                </td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">{s.total}</td>
                <td className="px-3 py-3 text-emerald-600 dark:text-emerald-400">
                  {s.present}
                </td>
                <td className="px-3 py-3 text-red-600 dark:text-red-400">{s.absent}</td>
                <td className="px-3 py-3 text-blue-600 dark:text-blue-400">{s.od}</td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "font-semibold",
                      s.attendancePercentage >= 80
                        ? "text-emerald-600 dark:text-emerald-400"
                        : s.attendancePercentage >= 75
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {s.attendancePercentage}%
                  </span>
                </td>
                <td className="px-3 py-3">
                  <EligibilityBadge status={s.eligibility} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-zinc-500">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

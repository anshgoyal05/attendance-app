"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AttendanceRecord } from "@/types";
import { deleteAttendance } from "@/hooks/useData";
import { formatDisplayDate, cn } from "@/lib/utils";
import { Search, Trash2, Loader2 } from "lucide-react";
import { STATUS_COLORS } from "@/lib/constants";

interface AttendanceHistoryTableProps {
  records: AttendanceRecord[];
  onDeleted: () => void;
}

export function AttendanceHistoryTable({
  records,
  onDeleted,
}: AttendanceHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    let data = [...records];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.subject?.name.toLowerCase().includes(q) ||
          r.subject?.module.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.date.includes(q)
      );
    }
    return data;
  }, [records, search]);

  const handleDelete = async (id: string, subjectName: string, date: string) => {
    if (!confirm(`Are you sure you want to delete attendance for ${subjectName} on ${formatDisplayDate(date)}?`)) {
      return;
    }

    setDeletingId(id);
    setError("");
    try {
      await deleteAttendance(id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History & Management</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search date, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 pl-8"
          />
        </div>
      </CardHeader>

      {error && <p className="mb-3 text-xs text-red-500 px-5">{error}</p>}

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Date
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Subject
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Status
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Lectures
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Remarks
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-50 hover:bg-zinc-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-3 py-3 whitespace-nowrap font-medium text-zinc-700 dark:text-zinc-300">
                  {formatDisplayDate(r.date)}
                </td>
                <td className="px-3 py-3 max-w-[220px]">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate" title={r.subject?.name}>
                    {r.subject?.name}
                  </p>
                  <p className="text-xs text-zinc-500">{r.subject?.module}</p>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white",
                      STATUS_COLORS[r.status].calendar
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">
                  {r.lectureCount ?? 1} {r.lectureCount && r.lectureCount > 1 ? "(Lab)" : ""}
                </td>
                <td className="px-3 py-3 text-zinc-500 max-w-[180px] truncate" title={r.remarks || ""}>
                  {r.remarks || "—"}
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    disabled={deletingId === r.id}
                    onClick={() => handleDelete(r.id, r.subject?.name || "Subject", r.date)}
                    title="Delete wrong entry"
                  >
                    {deletingId === r.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

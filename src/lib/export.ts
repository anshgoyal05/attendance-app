import type { AttendanceRecord, SubjectStats } from "@/types";
import { formatDisplayDate } from "./utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(
  records: AttendanceRecord[],
  subjectStats: SubjectStats[]
): string {
  const attendanceRows = records.map((r) => ({
    Date: formatDisplayDate(r.date),
    Subject: r.subject?.name || "",
    Module: r.subject?.module || "",
    Status: r.status,
    Lectures: r.lectureCount ?? 1,
    Remarks: r.remarks || "",
  }));

  const summaryRows = subjectStats.map((s) => ({
    Subject: s.name,
    Module: s.module,
    Total: s.total,
    Present: s.present,
    Absent: s.absent,
    OD: s.od,
    "Attendance %": s.attendancePercentage,
    Eligibility: s.eligibility,
  }));

  const attendanceCsv = rowsToCsv(attendanceRows);
  const summaryCsv = rowsToCsv(summaryRows);

  return `ATTENDANCE RECORDS\n${attendanceCsv}\n\nSUBJECT SUMMARY\n${summaryCsv}`;
}

function rowsToCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") ? `"${val}"` : val;
        })
        .join(",")
    ),
  ];
  return lines.join("\n");
}

export function exportToExcel(
  records: AttendanceRecord[],
  subjectStats: SubjectStats[]
): ArrayBuffer {
  const wb = XLSX.utils.book_new();

  const attendanceData = records.map((r) => ({
    Date: formatDisplayDate(r.date),
    Subject: r.subject?.name || "",
    Module: r.subject?.module || "",
    Status: r.status,
    Lectures: r.lectureCount ?? 1,
    Remarks: r.remarks || "",
  }));

  const summaryData = subjectStats.map((s) => ({
    Subject: s.name,
    Module: s.module,
    Total: s.total,
    Present: s.present,
    Absent: s.absent,
    OD: s.od,
    "Attendance %": s.attendancePercentage,
    Eligibility: s.eligibility,
  }));

  const ws1 = XLSX.utils.json_to_sheet(attendanceData);
  const ws2 = XLSX.utils.json_to_sheet(summaryData);

  XLSX.utils.book_append_sheet(wb, ws1, "Attendance");
  XLSX.utils.book_append_sheet(wb, ws2, "Summary");

  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
}

export function exportToPDF(
  records: AttendanceRecord[],
  subjectStats: SubjectStats[],
  overallPercentage: number
): ArrayBuffer {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Attendance Management Report", 14, 20);
  doc.setFontSize(11);
  doc.text(`Overall Attendance: ${overallPercentage}%`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 37);

  autoTable(doc, {
    startY: 45,
    head: [["Subject", "Module", "Total", "Present", "Absent", "OD", "Att. %"]],
    body: subjectStats.map((s) => [
      s.name,
      s.module,
      s.total,
      s.present,
      s.absent,
      s.od,
      `${s.attendancePercentage}%`,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [16, 185, 129] },
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
    ?.finalY || 100;

  autoTable(doc, {
    startY: finalY + 10,
    head: [["Date", "Subject", "Status", "Lectures", "Remarks"]],
    body: records.slice(0, 50).map((r) => [
      formatDisplayDate(r.date),
      r.subject?.name || "",
      r.status,
      r.lectureCount ?? 1,
      r.remarks || "",
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  return doc.output("arraybuffer");
}

export function downloadFile(
  content: string | ArrayBuffer,
  filename: string,
  mimeType: string
) {
  const blob =
    typeof content === "string"
      ? new Blob([content], { type: mimeType })
      : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

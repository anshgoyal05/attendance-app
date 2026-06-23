"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import type { AttendanceRecord, SubjectStats } from "@/types";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  downloadFile,
} from "@/lib/export";

interface ExportPanelProps {
  records: AttendanceRecord[];
  subjectStats: SubjectStats[];
  overallPercentage: number;
}

export function ExportPanel({
  records,
  subjectStats,
  overallPercentage,
}: ExportPanelProps) {
  const handleCSV = () => {
    const csv = exportToCSV(records, subjectStats);
    downloadFile(csv, "attendance-report.csv", "text/csv");
  };

  const handleExcel = () => {
    const buffer = exportToExcel(records, subjectStats);
    downloadFile(
      buffer,
      "attendance-report.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };

  const handlePDF = () => {
    const buffer = exportToPDF(records, subjectStats, overallPercentage);
    downloadFile(buffer, "attendance-report.pdf", "application/pdf");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={handleCSV}>
          <Download className="h-4 w-4" /> CSV
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExcel}>
          <FileSpreadsheet className="h-4 w-4" /> Excel
        </Button>
        <Button variant="secondary" size="sm" onClick={handlePDF}>
          <FileText className="h-4 w-4" /> PDF
        </Button>
      </div>
    </Card>
  );
}

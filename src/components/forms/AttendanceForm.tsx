"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Label } from "@/components/ui/Input";
import { useSubjects, saveAttendance } from "@/hooks/useData";
import type { AttendanceStatus, AttendanceFormDraft } from "@/types";
import { FORM_DRAFT_KEY } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Save, Loader2 } from "lucide-react";

interface AttendanceFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  preselectedStatus?: AttendanceStatus;
}

export function AttendanceForm({
  open,
  onClose,
  onSaved,
  preselectedStatus,
}: AttendanceFormProps) {
  const { subjects } = useSubjects();
  const [date, setDate] = useState(formatDate(new Date()));
  const [subjectId, setSubjectId] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>("PRESENT");
  const [lectureCount, setLectureCount] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const draft = localStorage.getItem(FORM_DRAFT_KEY);
      if (draft) {
        try {
          const parsed: AttendanceFormDraft = JSON.parse(draft);
          setDate(parsed.date || formatDate(new Date()));
          setSubjectId(parsed.subjectId || "");
          setStatus(preselectedStatus || parsed.status || "PRESENT");
          setLectureCount(parsed.lectureCount || 1);
          setRemarks(parsed.remarks || "");
        } catch {
          setDate(formatDate(new Date()));
          setSubjectId("");
          setStatus(preselectedStatus || "PRESENT");
          setLectureCount(1);
          setRemarks("");
          setError("");
        }
      } else {
        setDate(formatDate(new Date()));
        setSubjectId(subjects[0]?.id || "");
        setStatus(preselectedStatus || "PRESENT");
        setLectureCount(1);
        setRemarks("");
        setError("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, preselectedStatus]);

  useEffect(() => {
    if (!open) return;
    const draft: AttendanceFormDraft = { date, subjectId, status, lectureCount, remarks };
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draft));
  }, [date, subjectId, status, lectureCount, remarks, open]);

  const resetForm = () => {
    setDate(formatDate(new Date()));
    setSubjectId(subjects[0]?.id || "");
    setStatus(preselectedStatus || "PRESENT");
    setLectureCount(1);
    setRemarks("");
    setError("");
  };

  useEffect(() => {
    if (subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects, subjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setError("Please select a subject");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await saveAttendance({ date, subjectId, status, lectureCount, remarks });
      localStorage.removeItem(FORM_DRAFT_KEY);
      onSaved();
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Mark Attendance">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select
            id="subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.module})
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
            required
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="OD">OD</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="lectureCount">Class Type / Lecture Count</Label>
          <Select
            id="lectureCount"
            value={lectureCount}
            onChange={(e) => setLectureCount(Number(e.target.value))}
            required
          >
            <option value={1}>1 Lecture (Regular Class)</option>
            <option value={2}>2 Lectures (Lab / Double Session)</option>
            <option value={3}>3 Lectures</option>
            <option value={4}>4 Lectures</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="Optional notes..."
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Attendance
          </Button>
        </div>
      </form>
    </Modal>
  );
}

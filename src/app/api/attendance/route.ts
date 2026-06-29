import { NextRequest, NextResponse } from "next/server";
import { getAllAttendance, upsertAttendance, deleteAttendance } from "@/lib/db";
import type { AttendanceStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") ?? undefined;
    const subjectId = searchParams.get("subjectId") ?? undefined;

    const records = await getAllAttendance({ month, subjectId });
    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, subjectId, status, lectureCount, remarks } = body as {
      date: string;
      subjectId: string;
      status: AttendanceStatus;
      lectureCount?: number;
      remarks?: string;
    };

    if (!date || !subjectId || !status) {
      return NextResponse.json(
        { error: "Date, subject, and status are required" },
        { status: 400 }
      );
    }

    const record = await upsertAttendance({
      date,
      subjectId,
      status,
      lectureCount: typeof lectureCount === "number" ? lectureCount : Number(lectureCount) || 1,
      remarks: remarks || null,
    });

    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await deleteAttendance(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete attendance" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getAllSubjects } from "@/lib/db";

export async function GET() {
  try {
    const subjects = await getAllSubjects();
    return NextResponse.json(subjects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

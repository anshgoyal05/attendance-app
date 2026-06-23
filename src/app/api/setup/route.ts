import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  findUserByUsername,
  findSubjectByNameModule,
  createUser,
  createSubject,
} from "@/lib/db";

const subjects = [
  { name: "Programming Abstraction", module: "Module-I" },
  { name: "Algorithm Design & Implementation", module: "Module-II" },
  { name: "Back-end Engineering", module: "Module-I" },
  { name: "Professional Practices – System Design", module: "Module-II" },
  {
    name: "Business & Professional Communication / Art of Communication-II",
    module: "Full Semester",
  },
  {
    name: "Numerical Aptitude & Logical Reasoning-I",
    module: "Entire Semester",
  },
];

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-setup-secret");
    if (!secret || secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await findUserByUsername("student");
    if (!existingUser) {
      const password = await bcrypt.hash("student123", 10);
      await createUser({
        username: "student",
        password,
        name: "University Student",
      });
    }

    let createdSubjects = 0;
    for (const subject of subjects) {
      const existing = await findSubjectByNameModule(subject.name, subject.module);
      if (!existing) {
        await createSubject(subject);
        createdSubjects++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized",
      user: existingUser ? "already exists" : "created (student/student123)",
      subjectsCreated: createdSubjects,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { prisma } from "./prisma";
import type { AttendanceStatus, AttendanceRecord, Subject } from "@/types";

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function createUser(data: {
  username: string;
  password: string;
  name: string | null;
}) {
  return prisma.user.create({ data });
}

export async function getAllSubjects(): Promise<Subject[]> {
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  return subjects.map((s) => ({
    id: s.id,
    name: s.name,
    module: s.module,
    createdAt: s.createdAt.toISOString(),
  }));
}

export async function findSubjectByNameModule(name: string, module: string) {
  return prisma.subject.findUnique({
    where: {
      name_module: { name, module },
    },
  });
}

export async function createSubject(data: { name: string; module: string }) {
  return prisma.subject.create({ data });
}

function toAttendanceRecord(row: {
  id: string;
  date: Date;
  subjectId: string;
  status: AttendanceStatus;
  lectureCount?: number;
  remarks: string | null;
  createdAt: Date;
  subject?: {
    id: string;
    name: string;
    module: string;
    createdAt: Date;
  };
}): AttendanceRecord {
  return {
    id: row.id,
    date: row.date.toISOString().split("T")[0],
    subjectId: row.subjectId,
    status: row.status,
    lectureCount: row.lectureCount ?? 1,
    remarks: row.remarks,
    createdAt: row.createdAt.toISOString(),
    subject: row.subject
      ? {
          id: row.subject.id,
          name: row.subject.name,
          module: row.subject.module,
          createdAt: row.subject.createdAt.toISOString(),
        }
      : undefined,
  };
}

export async function getAllAttendance(filters?: {
  month?: string;
  subjectId?: string;
}): Promise<AttendanceRecord[]> {
  const where: {
    date?: { gte: Date; lte: Date };
    subjectId?: string;
  } = {};

  if (filters?.month) {
    const [year, month] = filters.month.split("-").map(Number);
    where.date = {
      gte: new Date(year, month - 1, 1),
      lte: new Date(year, month, 0),
    };
  }

  if (filters?.subjectId) {
    where.subjectId = filters.subjectId;
  }

  const rows = await prisma.attendance.findMany({
    where,
    include: { subject: true },
    orderBy: { date: "desc" },
  });

  return rows.map((r) => toAttendanceRecord(r));
}

export async function upsertAttendance(data: {
  date: string;
  subjectId: string;
  status: AttendanceStatus;
  lectureCount?: number;
  remarks?: string | null;
}): Promise<AttendanceRecord> {
  const count = data.lectureCount && data.lectureCount > 0 ? data.lectureCount : 1;
  const row = await prisma.attendance.upsert({
    where: {
      date_subjectId: {
        date: new Date(data.date),
        subjectId: data.subjectId,
      },
    },
    update: {
      status: data.status,
      lectureCount: count,
      remarks: data.remarks ?? null,
    },
    create: {
      date: new Date(data.date),
      subjectId: data.subjectId,
      status: data.status,
      lectureCount: count,
      remarks: data.remarks ?? null,
    },
    include: { subject: true },
  });

  return toAttendanceRecord(row);
}

export async function deleteAttendance(id: string): Promise<void> {
  await prisma.attendance.delete({ where: { id } });
}

export async function getAttendanceForStats(): Promise<{
  subjects: Subject[];
  records: AttendanceRecord[];
}> {
  const [subjects, rows] = await Promise.all([
    getAllSubjects(),
    prisma.attendance.findMany({
      include: { subject: true },
      orderBy: { date: "asc" },
    }),
  ]);

  return {
    subjects,
    records: rows.map((r) => toAttendanceRecord(r)),
  };
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

async function main() {
  const password = await bcrypt.hash("student123", 10);

  await prisma.user.upsert({
    where: { username: "student" },
    update: {},
    create: {
      username: "student",
      password,
      name: "University Student",
    },
  });

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: {
        name_module: {
          name: subject.name,
          module: subject.module,
        },
      },
      update: {},
      create: subject,
    });
  }

  console.log("Seed complete: student/student123 and 6 subjects ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

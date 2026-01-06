import { prisma } from "./prisma";

async function main() {
  const created = await prisma.note.create({
    data: { title: "Smoke test", content: "Prisma is working." },
  });

  const all = await prisma.note.findMany();

  console.log("Created:", created);
  console.log("All notes:", all);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

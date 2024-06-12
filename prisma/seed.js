const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const taskData = [
  {
    name: "Task 1",
    slug: "t-1",
    description: "my first task",
    completed: true,
    due_date: new Date(),
  },
  {
    name: "Task 2",
    slug: "t-2",
    description: "my second task",
    completed: false,
    due_date: new Date(),
  },
  {
    name: "Task 3",
    slug: "t-3",
    description: "my third task",
    completed: false,
    due_date: new Date(),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const t of taskData) {
    const task = await prisma.task.create({
      data: t,
    });
    console.log(`Created task with id: ${task.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

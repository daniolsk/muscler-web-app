const { PrismaClient } = require("@prisma/client");
const { exercise, log, user, workout } = require("./data.js");
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.tag.deleteMany();

    await prisma.$queryRaw`ALTER TABLE Tag AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`DELETE FROM _TagToWorkout`;
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    prisma.$disconnect();
  }
};

load();

// let data = await prisma.workout.findMany({
//   where: {
//     userId: dataFromToken.id,
//   },
//   orderBy: {
//     date: "asc",
//   },
//   include: {
//     exercises: {
//       orderBy: {
//         exerciseNumber: "asc",
//       },
//       include: {
//         logs: {
//           orderBy: {
//             setNumber: "asc",
//           },
//         },
//       },
//     },
//   },
// });

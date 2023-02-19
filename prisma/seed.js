const { PrismaClient } = require('@prisma/client');
const { exercise, log, user, workout } = require('./data.js');
const prisma = new PrismaClient();

const load = async () => {
	try {
		await prisma.exercise.deleteMany();
		await prisma.log.deleteMany();
		await prisma.user.deleteMany();
		await prisma.workout.deleteMany();

		await prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
		await prisma.$queryRaw`ALTER TABLE Workout AUTO_INCREMENT = 1`;
		await prisma.$queryRaw`ALTER TABLE Exercise AUTO_INCREMENT = 1`;
		await prisma.$queryRaw`ALTER TABLE Log AUTO_INCREMENT = 1`;

		await prisma.exercise.createMany({
			data: exercise,
		});
		await prisma.log.createMany({
			data: log,
		});
		await prisma.user.createMany({
			data: user,
		});
		await prisma.workout.createMany({
			data: workout,
		});

		// let data = await prisma.workout.findMany({
		// 	where: {
		// 		userId: 1,
		// 	},
		// 	orderBy: {
		// 		date: 'asc',
		// 	},
		// 	include: {
		// 		exercises: {
		// 			orderBy: {
		// 				exerciseNumber: 'asc',
		// 			},
		// 			include: {
		// 				logs: {
		// 					orderBy: {
		// 						setNumber: 'asc',
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// });

		//console.dir(JSON.stringify(data));
	} catch (e) {
		console.error(e);
		process.exit(1);
	} finally {
		prisma.$disconnect();
	}
};

load();

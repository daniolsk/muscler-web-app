const { Prisma } = require('@prisma/client');

const user = [
	{
		username: 'Daniel',
		password: 'Daniel123',
	},
	{
		username: 'Maciek',
		password: 'Maciek123',
	},
];

const workout = [
	{
		name: 'klata',
		userId: 1,
	},
];

const exercise = [
	{
		name: 'wyciskanie leżąc',
		workoutId: 1,
		exerciseNumber: 1,
	},
	{
		name: 'skos hantlami',
		workoutId: 1,
		exerciseNumber: 2,
	},
	{
		name: 'brama z dołu',
		workoutId: 1,
		exerciseNumber: 3,
	},
];

const log = [
	{
		weight: 60,
		reps: 12,
		workoutId: 1,
		excerciseId: 1,
		setNumber: 1,
	},
	{
		weight: 80,
		reps: 6,
		workoutId: 1,
		excerciseId: 1,
		setNumber: 2,
	},
	{
		weight: 85,
		reps: 6,
		workoutId: 1,
		excerciseId: 2,
		setNumber: 1,
	},
	{
		weight: 90,
		reps: 4,
		workoutId: 1,
		excerciseId: 2,
		setNumber: 2,
	},
];

module.exports = {
	exercise,
	log,
	workout,
	user,
};

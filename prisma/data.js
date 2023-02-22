const { Prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");

const user = [
  {
    username: "Daniel",
    password: bcrypt.hashSync("Daniel123", 10),
  },
  {
    username: "Maciek",
    password: bcrypt.hashSync("Maciek123", 10),
  },
];

const workout = [
  {
    name: "Klata",
    userId: 1,
    isActive: true,
  },
  {
    name: "Nogi",
    userId: 1,
    isActive: false,
  },
  {
    name: "Plecy i barki",
    userId: 1,
    isActive: false,
  },
];

const exercise = [
  {
    name: "wyciskanie leżąc",
    workoutId: 1,
    exerciseNumber: 1,
  },
  {
    name: "skos hantlami",
    workoutId: 1,
    exerciseNumber: 2,
  },
  {
    name: "brama z dołu",
    workoutId: 1,
    exerciseNumber: 3,
  },
];

const log = [
  {
    weight: 60,
    reps: 12,
    workoutId: 1,
    exerciseId: 1,
    setNumber: 1,
  },
  {
    weight: 80,
    reps: 6,
    workoutId: 1,
    exerciseId: 1,
    setNumber: 2,
  },
  {
    weight: 85,
    reps: 6,
    workoutId: 1,
    exerciseId: 2,
    setNumber: 1,
  },
  {
    weight: 90,
    reps: 4,
    workoutId: 1,
    exerciseId: 2,
    setNumber: 2,
  },
];

module.exports = {
  exercise,
  log,
  workout,
  user,
};

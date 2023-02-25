const { Prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");

const user = [
  {
    username: "Daniel",
    password: bcrypt.hashSync("Daniel123", 10),
  },
  {
    username: "Sylwia",
    password: bcrypt.hashSync("Sylwia123", 10),
  },
];

const workout = [
  {
    name: "Klata",
    userId: 1,
    isActive: true,
    tags: [{ name: "CHEST" }],
  },
  {
    name: "Nogi",
    userId: 1,
    isActive: false,
    tags: [{ name: "LEGS" }, { name: "CALVES" }],
  },
  {
    name: "Plecy i barki",
    userId: 1,
    isActive: false,
    tags: [{ name: "BACK" }, { name: "SHOULDERS" }],
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

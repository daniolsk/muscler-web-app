import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const { workoutId } = req.body;

      const deleteLogs = prisma.log.deleteMany({
        where: {
          workoutId: workoutId,
        },
      });
      const deleteExercises = prisma.exercise.deleteMany({
        where: {
          workoutId: workoutId,
        },
      });
      const deleteWorkout = prisma.workout.delete({
        where: {
          id: workoutId,
        },
      });

      await prisma.$transaction([deleteLogs, deleteExercises, deleteWorkout]);

      return res.status(200).json({ msg: "Workout removed" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}

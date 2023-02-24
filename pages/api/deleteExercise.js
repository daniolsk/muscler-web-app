import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const { exerciseId } = req.body;

      const deleteLogs = prisma.log.deleteMany({
        where: {
          exerciseId: exerciseId,
        },
      });
      const deleteExercises = prisma.exercise.deleteMany({
        where: {
          id: exerciseId,
        },
      });

      await prisma.$transaction([deleteLogs, deleteExercises]);

      return res.status(200).json({ msg: "Exercise removed" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}

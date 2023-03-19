import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const { userId, skipNumber } = req.body;

      let data = await prisma.workout.findMany({
        skip: skipNumber,
        take: 10,
        where: {
          userId: userId,
          isTemplate: false,
        },
        orderBy: [
          {
            isActive: "desc",
          },
          {
            date: "desc",
          },
        ],
        include: {
          logs: true,
          tags: true,
          exercises: {
            include: {
              logs: true,
            },
          },
          _count: {
            select: { logs: true, exercises: true },
          },
        },
      });

      let workouts = data.map((workout) => ({
        ...workout,
        date: workout.date.toString(),
      }));

      workouts.forEach((workout) => {
        let totalWeight = 0;

        workout.logs.forEach((log) => {
          totalWeight += log.weight * log.reps;
        });

        workout.totalWeight = totalWeight;
      });

      return res.status(200).json({ workouts });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}

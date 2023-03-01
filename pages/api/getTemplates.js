import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const { userId } = req.body;

      let data = await prisma.workout.findMany({
        where: {
          userId: userId,
          isTemplate: true,
        },
        orderBy: {
          date: "desc",
        },
        include: {
          tags: true,
          exercises: {
            include: {
              logs: true,
              _count: {
                select: { logs: true },
              },
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

      return res.status(200).json({ workouts });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}

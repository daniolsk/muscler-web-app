import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const { userId, name, tags, isTemplate, templateId, isFromTemplate } =
        req.body;

      let data = {
        name: name,
        isActive: true,
        userId: userId,
      };

      if (isTemplate) {
        data = {
          ...data,
          isTemplate: true,
          tags: {
            create: tags,
          },
        };
      } else if (isFromTemplate) {
        data = {
          ...data,
          isTemplate: false,
        };

        const workoutOrgin = await prisma.workout.findUnique({
          where: {
            id: templateId,
          },
          include: {
            tags: true,
            exercises: {
              include: {
                logs: true,
              },
            },
          },
        });

        data = {
          ...data,
          tags: {
            create: workoutOrgin.tags.map((tag) => {
              name: tag.name;
            }),
          },
        };

        console.log(workoutOrgin);
      }

      const workout = await prisma.workout.create({
        data,
      });

      return res
        .status(200)
        .json({ msg: "Workout added", newWorkout: workout });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}

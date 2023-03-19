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

      let newWorkout;

      if (isTemplate) {
        data = {
          ...data,
          isTemplate: true,
          tags: {
            connectOrCreate: tags.map((tag) => {
              return {
                where: tag,
                create: tag,
              };
            }),
          },
        };

        newWorkout = await prisma.workout.create({
          data,
        });
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

        let tagsTmp = [];
        for (const tag of workoutOrgin.tags) {
          tagsTmp.push({ name: tag.name });
        }

        data = {
          ...data,
          tags: {
            connectOrCreate: tagsTmp.map((tag) => {
              return {
                where: tag,
                create: tag,
              };
            }),
          },
        };

        newWorkout = await prisma.workout.create({
          data,
        });

        for (const ex of workoutOrgin.exercises) {
          const exericse = await prisma.exercise.create({
            data: {
              name: ex.name,
              exerciseNumber: ex.exerciseNumber,
              workoutId: newWorkout.id,
            },
          });

          for (const log of ex.logs) {
            await prisma.log.create({
              data: {
                weight: log.weight,
                reps: log.reps,
                setNumber: log.setNumber,
                workoutId: newWorkout.id,
                exerciseId: exericse.id,
              },
            });
          }
        }
      } else {
        data = {
          ...data,
          isTemplate: false,
          tags: {
            connectOrCreate: tags.map((tag) => {
              return {
                where: tag,
                create: tag,
              };
            }),
          },
        };

        newWorkout = await prisma.workout.create({
          data,
        });
      }

      const newWorkoutRes = await prisma.workout.findUnique({
        where: {
          id: newWorkout.id,
        },
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

      newWorkoutRes.date = newWorkoutRes.date.toString();

      let totalWeight = 0;

      newWorkoutRes.logs.forEach((log) => {
        totalWeight += log.weight * log.reps;
      });

      newWorkoutRes.totalWeight = totalWeight;

      return res.status(200).json({ msg: "Workout added", newWorkoutRes });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}

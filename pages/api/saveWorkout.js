import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const {
        workoutId,
        newExercises,
        newLogs,
        modifiedExercises,
        modifiedLogs,
        name,
        tagsChanged,
        tags,
      } = req.body;

      let idsToChange = [];

      for (const exercise of newExercises) {
        const newExercise = await prisma.exercise.create({
          data: {
            name: exercise.name,
            exerciseNumber: exercise.exerciseNumber,
            workoutId: exercise.workoutId,
          },
        });

        idsToChange.push([exercise.id, newExercise.id]);

        newLogs.forEach((log) => {
          if (log.exerciseId == exercise.id) {
            log.exerciseId = newExercise.id;
          }
        });
      }

      for (const log of newLogs) {
        const newLog = await prisma.log.create({
          data: {
            weight: log.weight,
            reps: log.reps,
            setNumber: log.setNumber,
            workoutId: log.workoutId,
            exerciseId: log.exerciseId,
          },
        });

        idsToChange.push([log.id, newLog.id]);
      }

      for (const exercise of modifiedExercises) {
        const updatedExercise = await prisma.exercise.update({
          where: {
            id: exercise.id,
          },
          data: {
            name: exercise.name,
            exerciseNumber: exercise.number,
            workoutId: exercise.workoutId,
          },
        });

        idsToChange.push([exercise.id, updatedExercise.id]);
      }

      for (const log of modifiedLogs) {
        const updatedLog = await prisma.log.update({
          where: {
            id: log.id,
          },
          data: {
            weight: log.weight,
            reps: log.reps,
            setNumber: log.setNumber,
            workoutId: log.workoutId,
            exerciseId: log.exerciseId,
          },
        });

        idsToChange.push([log.id, updatedLog.id]);
      }

      if (name) {
        await prisma.workout.update({
          where: {
            id: workoutId,
          },
          data: {
            name: name,
          },
        });
      }

      if (tagsChanged) {
        await prisma.workout.update({
          where: {
            id: workoutId,
          },
          data: {
            tags: {
              set: [],
            },
          },
        });

        await prisma.workout.update({
          where: {
            id: workoutId,
          },
          data: {
            tags: {
              connectOrCreate: tags.map((tag) => {
                return {
                  where: { id: tag.id },
                  create: { name: tag.name },
                };
              }),
            },
          },
        });
      }

      return res.status(200).json({ msg: "Workout saved", data: idsToChange });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}

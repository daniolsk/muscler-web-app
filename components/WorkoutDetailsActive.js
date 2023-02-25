import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Exercise from "./Exercise";
import { useRouter } from "next/router";

import { toast } from "react-hot-toast";

import { v4 as uuidv4 } from "uuid";

function WorkoutDetailsInactive({ _count, workout }) {
  const [exercises, setExercises] = useState(workout.exercises);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setExercises(workout.exercises);
  }, [workout]);

  const router = useRouter();

  const finishWorkout = async () => {
    await saveWorkout(false);
    const toastId = toast.loading("Finishing workout...");
    const response = await fetch("/api/finishWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: workout.id,
      }),
    });

    const data = await response.json();

    if (response.status != 200) {
      setError(data.msg);
      toast.error("Something went wrong!", {
        id: toastId,
      });
      return;
    }

    toast.success("Workout finished!", {
      id: toastId,
    });
    router.replace(router.asPath);
  };

  const saveWorkout = async (refresh) => {
    setIsSaving(true);

    let newExercises = [];
    let newLogs = [];
    let modifiedExercises = [];
    let modifiedLogs = [];

    exercises.forEach((exercise) => {
      if (exercise.isNew) {
        newExercises.push(exercise);
      } else {
        if (exercise.isChanged) {
          modifiedExercises.push(exercise);
        }
      }

      exercise.logs.forEach((log) => {
        if (log.isNew) {
          newLogs.push(log);
        } else {
          if (log.isChanged) {
            modifiedLogs.push(log);
          }
        }
      });
    });

    if (
      newExercises.length == 0 &&
      newLogs.length == 0 &&
      modifiedExercises.length == 0 &&
      modifiedLogs.length == 0
    ) {
      setIsSaving(false);
      return;
    }

    const toastId = toast.loading("Saving...");

    const response = await fetch("/api/saveWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newExercises,
        newLogs,
        modifiedExercises,
        modifiedLogs,
      }),
    });

    const data = await response.json();

    if (response.status != 200) {
      setError(data.msg);
      setIsSaving(false);
      toast.error("Something went wrong!", {
        id: toastId,
      });
      return;
    }

    setIsSaving(false);

    toast.success("Workout saved!", {
      id: toastId,
    });

    if (refresh) {
      router.replace(router.asPath);
    }
  };

  const setExericse = (id, logs) => {
    let index = exercises.findIndex((ex) => ex.id == id);
    let exercisesTmp = exercises;
    exercisesTmp[index].logs = logs;
    setExercises([...exercisesTmp]);
  };

  const addExercise = () => {
    let setNmr =
      exercises.length == 0
        ? 1
        : exercises[exercises.length - 1].exerciseNumber + 1;

    setExercises([
      ...exercises,
      {
        id: uuidv4(),
        exerciseNumber: setNmr,
        logs: [],
        name: "New exercise",
        isNew: true,
        workoutId: workout.id,
      },
    ]);
  };

  const setExerciseName = (id, name) => {
    let index = exercises.findIndex((ex) => ex.id == id);
    let exercisesTmp = exercises;
    exercisesTmp[index].name = name;
    exercisesTmp[index].isChanged = true;
    setExercises([...exercisesTmp]);
  };

  const removeLog = async (id, isNew) => {
    if (isSaving) return;

    let tmpExercises = exercises;
    tmpExercises.forEach((ex) => {
      ex.logs = ex.logs.filter((log) => log.id != id);
    });
    console.log(tmpExercises);
    setExercises([...tmpExercises]);

    if (!isNew) {
      const response = await fetch("/api/deleteLog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logId: id,
        }),
      });

      const data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        toast.error("Something went wrong!");
        return;
      }
    }
  };

  const removeExericse = async (id, isNew) => {
    if (isSaving) return;

    let tmpExercises = exercises;
    tmpExercises = tmpExercises.filter((ex) => ex.id != id);
    setExercises([...tmpExercises]);

    if (!isNew) {
      const response = await fetch("/api/deleteExercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseId: id,
        }),
      });

      const data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        toast.error("Something went wrong!");
        return;
      }
    }
  };

  const formatDate = (date) => {
    let dateObj = new Date(date);

    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString().slice(0, -3)
    );
  };
  return (
    <main className="text-white">
      <div className="flex items-center justify-between bg-background-darker-color p-3">
        <div>
          MUSCLER{" "}
          <span className="text-sm font-thin italic text-neutral-400">
            by Daniel Skowron
          </span>
        </div>
        <div
          onClick={async () => {
            if (!isSaving) await saveWorkout(false);
            router.push("/dashboard");
          }}
          className="flex cursor-pointer items-center"
        >
          <div className="mr-2">Back</div>
          <Image
            alt="go back icon"
            src="/icons/go-back.svg"
            width={15}
            height={15}
          ></Image>
        </div>
      </div>
      <div className="flex items-center justify-between py-4 px-6">
        <div>
          <h1 className="mb-2 text-left text-2xl font-bold">{workout.name}</h1>
          <h3 className="text-left text-sm">{formatDate(workout.date)}</h3>
          <div className=" flex flex-col justify-start text-white">
            <div className="text-sm">
              Total sets:{" "}
              <span className="text-base font-bold">{workout._count.logs}</span>
            </div>
            <div className="text-sm">
              Total exercises:{" "}
              <span className="text-base font-bold">
                {workout._count.exercises}
              </span>
            </div>
            <div className="text-sm">
              Total weight:{" "}
              <span className="text-base font-bold">
                {workout.totalWeight} kg
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => saveWorkout(true)}
          className="cursor-pointer rounded-md bg-blue-dark px-4 py-3 text-lg font-bold"
        >
          Save
        </button>
      </div>
      <div className="text-md text-center font-bold text-red-600">
        {error ? error : ""}
      </div>
      <div className="mt-4 px-4 text-xs text-neutral-400">EXERCISE</div>
      <div>
        {exercises.length == 0 ? (
          <div className="p-4">No exerices in this workout</div>
        ) : (
          ""
        )}
        {exercises.map((exercise, index) => (
          <Exercise
            setExerciseName={setExerciseName}
            workoutId={workout.id}
            setExericse={setExericse}
            removeLog={removeLog}
            removeExericse={removeExericse}
            exercise={exercise}
            key={index}
          />
        ))}
        <div className="flex justify-between">
          <button
            onClick={addExercise}
            className="my-3 mr-0 ml-3 flex cursor-pointer items-center rounded-md p-2"
          >
            <Image
              alt="plus icon"
              src={"/icons/plus.svg"}
              width={25}
              height={25}
            ></Image>
            <span>Add an exercise</span>
          </button>
          {exercises.length != 0 ? (
            <button
              disabled={isSaving ? true : false}
              onClick={finishWorkout}
              className="my-3 mr-3 ml-0 flex cursor-pointer items-center rounded-md bg-blue-dark p-2"
            >
              <span className="mr-1">Finish workout</span>
              <Image
                alt="finish icon"
                src={"/icons/finish.svg"}
                width={23}
                height={23}
              ></Image>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </main>
  );
}

export default WorkoutDetailsInactive;

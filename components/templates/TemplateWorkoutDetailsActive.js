import { useState, useEffect } from "react";
import Image from "next/image";
import TemplateExercise from "./TemplateExericse";
import { useRouter } from "next/router";
import Header from "../Header";

import { toast } from "react-hot-toast";

import { v4 as uuidv4 } from "uuid";

import { usePageVisibility } from "../hooks/usePageVisibility";

function WorkoutDetailsInactive({ workout }) {
  const [exercises, setExercises] = useState(workout.exercises);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isVisible = usePageVisibility();

  useEffect(() => {
    setExercises(workout.exercises);
  }, [workout]);

  useEffect(() => {
    if (isVisible == false) {
      if (!isSaving) saveWorkout(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const router = useRouter();

  const saveWorkout = async (showToast) => {
    setIsSaving(true);

    let toastId = null;

    if (showToast) {
      toastId = toast.loading("Saving...");
    }

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
      if (showToast)
        toast.success("Workout saved!", {
          id: toastId,
        });
      return;
    }

    if (showToast) {
      if (!toastId) {
        toastId = toast.loading("Saving...");
      }
    }

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

    if (data.data && data.data.length > 0) {
      let tmpExercises = exercises;
      for (const ids of data.data) {
        tmpExercises.forEach((exercise) => {
          if (exercise.id == ids[0]) {
            delete exercise.isNew;
            delete exercise.isChanged;
            exercise.id = ids[1];
          }

          exercise.logs.forEach((log) => {
            if (log.id == ids[0]) {
              delete log.isNew;
              delete log.isChanged;
              log.id = ids[1];
            }
          });
        });
      }

      setExercises([...tmpExercises]);
    }

    if (showToast)
      toast.success("Workout saved!", {
        id: toastId,
      });
  };

  const setExericse = (id, logs) => {
    if (isSaving) return;
    let index = exercises.findIndex((ex) => ex.id == id);
    let exercisesTmp = exercises;
    exercisesTmp[index].logs = logs;
    setExercises([...exercisesTmp]);
  };

  const addExercise = () => {
    if (isSaving) return;
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
    if (isSaving) return;
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

  const [date, setDate] = useState();
  useEffect(() => {
    setDate(formatDate(workout.date));
  }, [workout.date]);

  return (
    <main className="text-white">
      <Header
        buttonText={"Back"}
        buttonOnClick={async () => {
          if (!isSaving) await saveWorkout(false, false);
          router.push("/profile/workout-templates");
        }}
        buttonImageName="go-back"
      />
      <div className="m-auto max-w-5xl">
        <div className="flex items-center justify-between py-4 px-6">
          <div>
            <h1 className="mb-2 text-left text-2xl font-bold">
              {workout.name}
            </h1>
            <h3 className="text-left text-sm">{date}</h3>
            <div className=" flex flex-col justify-start text-white">
              <div className="text-sm">
                Total sets:{" "}
                <span className="text-base font-bold">
                  {workout._count.logs}
                </span>
              </div>
              <div className="text-sm">
                Total exercises:{" "}
                <span className="text-base font-bold">
                  {workout._count.exercises}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => saveWorkout(true, true)}
            className="cursor-pointer rounded-md bg-blue-dark px-4 py-3 text-lg font-bold hover:bg-blue-darker-lighter"
          >
            Save
          </button>
        </div>
        <div className="flex items-center px-6 py-2">
          {workout.tags.map((tag) => (
            <div
              key={tag.id}
              className="mr-2 rounded-full bg-red-800 p-2 text-xs font-bold"
            >
              {tag.name}
            </div>
          ))}
        </div>
        <div className="text-md text-center font-bold text-red-600">
          {error ? error : ""}
        </div>
        <div className="mt-4 px-4 text-xs text-neutral-400">EXERCISE</div>
        <div className="mb-2 flex flex-col md:grid md:grid-cols-2">
          {exercises.length == 0 ? (
            <div className="p-4 text-center text-neutral-400 sm:col-span-2">
              No exerices in this template
            </div>
          ) : (
            ""
          )}
          {exercises.map((exercise, index) => (
            <TemplateExercise
              setExerciseName={setExerciseName}
              workoutId={workout.id}
              setExericse={setExericse}
              removeLog={removeLog}
              removeExericse={removeExericse}
              exercise={exercise}
              key={exercise.id}
            />
          ))}
          <div className="flex justify-between">
            <button
              onClick={addExercise}
              className="my-3 mr-0 ml-3 flex cursor-pointer items-center self-start rounded-md p-2 hover:bg-background-color"
            >
              <Image
                alt="plus icon"
                src={"/icons/plus.svg"}
                width={25}
                height={25}
                priority
              ></Image>
              <span>Add an exercise</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WorkoutDetailsInactive;

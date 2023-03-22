import { useState, useEffect, use } from "react";
import Image from "next/image";
import Exercise from "./Exercise";
import { useRouter } from "next/router";
import Header from "../components/Header";

import { toast } from "react-hot-toast";

import { v4 as uuidv4 } from "uuid";

import { usePageVisibility } from "./hooks/usePageVisibility";
import FullScreenConfirm from "./FullScreenConfirm";

function WorkoutDetailsInactive({ workout }) {
  const [exercises, setExercises] = useState(workout.exercises);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [workoutName, setWorkoutName] = useState(workout.name);

  const [tags, setTags] = useState(workout.tags);
  const [tagsChanged, setTagsChanged] = useState(false);

  const [isFinishing, setIsFinishing] = useState(false);

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

  const handleDeleteTag = (id) => {
    setTags((tags) => tags.filter((tag) => tag.id != id));
    setTagsChanged(true);
  };

  const finishWorkout = async () => {
    if (!isSaving) await saveWorkout(false);
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

  const saveWorkout = async (showToast) => {
    setIsSaving(true);

    if (workoutName == "") {
      toast.error("Name can not be empty!", {
        position: "top-center",
      });
      setIsSaving(false);
      return;
    }

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
      modifiedLogs.length == 0 &&
      workout.name == workoutName &&
      !tagsChanged
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

    const bodyToSend = {
      workoutId: workout.id,
      newExercises,
      newLogs,
      modifiedExercises,
      modifiedLogs,
    };

    if (workout.name != workoutName) {
      bodyToSend.name = workoutName;
    }

    if (tagsChanged) {
      bodyToSend.tags = tags;
      bodyToSend.tagsChanged = true;
    }

    const response = await fetch("/api/saveWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    });

    const data = await response.json();

    if (response.status != 200) {
      setError(data.msg);
      setIsSaving(false);
      if (showToast)
        toast.error("Something went wrong!", {
          id: toastId,
        });
      return;
    }

    setIsSaving(false);
    setTagsChanged(false);

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
          if (!isSaving) await saveWorkout(false);
          router.push("/dashboard");
        }}
        buttonImageName="go-back"
      />
      <div className="m-auto max-w-5xl">
        <div className="text-md text-center font-bold text-red-600">
          {error ? error : ""}
        </div>
        <div className="flex items-center justify-between py-4 px-6">
          <div className="mr-4 flex-1">
            <input
              className="mb-2 w-3/4 flex-1 resize-none border-none bg-transparent text-left text-2xl font-bold text-white"
              type="text"
              value={workoutName}
              onFocus={(e) => {
                e.target.select();
              }}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
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
              <div className="text-sm">
                Total weight:{" "}
                <span className="text-base font-bold">
                  {workout.totalWeight} kg
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => saveWorkout(true)}
              className="cursor-pointer rounded-md bg-blue-dark px-3 py-2 text-lg font-bold hover:bg-blue-darker-lighter"
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex items-center justify-start px-6 py-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="mr-2 cursor-pointer rounded-full bg-red-800 p-2 text-xs font-bold hover:bg-red-700"
              onClick={() => {
                handleDeleteTag(tag.id);
              }}
            >
              {tag.name}
              <span className="ml-2 font-extrabold">-</span>
            </div>
          ))}
          <div className="flex cursor-pointer rounded-full fill-red-500 p-1.5 text-lg font-bold hover:bg-background-color">
            <Image
              alt="plus icon"
              src={"/icons/plus.svg"}
              className="fill-red-500"
              width={23}
              height={23}
              priority
            ></Image>
          </div>
        </div>
        <div className="mt-4 px-4 text-xs text-neutral-400">EXERCISE</div>
        <div className="flex flex-col md:grid md:grid-cols-2">
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
              key={exercise.id}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <div>
            <button
              onClick={addExercise}
              className="my-3 mr-0 ml-3 flex cursor-pointer items-center self-start rounded-md px-3 py-2 hover:bg-background-color md:ml-0"
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

          <div>
            {isFinishing ? (
              <FullScreenConfirm
                onCancel={() => setIsFinishing(false)}
                onConfirm={() => {
                  setIsFinishing(false);
                  finishWorkout();
                }}
                button="Finish"
                prompt={() => (
                  <div>
                    Finish workout{" "}
                    <span className="italic">{workout.name}</span>?
                  </div>
                )}
              />
            ) : (
              ""
            )}
            <button
              disabled={isSaving ? true : false}
              onClick={() => setIsFinishing(true)}
              className="my-3 ml-0 mr-3 flex cursor-pointer items-center rounded-md bg-blue-dark px-3 py-2 hover:bg-blue-darker-lighter md:mr-0"
            >
              <span className="mr-1">Finish workout</span>
              <Image
                alt="finish icon"
                src={"/icons/finish.svg"}
                width={23}
                height={23}
                priority
              ></Image>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WorkoutDetailsInactive;

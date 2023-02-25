import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

function WorkoutDetailsInactive({ workout }) {
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
        <Link href="/dashboard" className="flex cursor-pointer items-center">
          <div className="mr-2">Back</div>
          <Image
            alt="go back icon"
            src="/icons/go-back.svg"
            width={15}
            height={15}
          ></Image>
        </Link>
      </div>
      <div className="mb-4 flex items-center justify-between py-4 px-6">
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
      </div>
      <div className="px-4 text-xs text-neutral-400">EXERCISE</div>
      <div>
        {workout.exercises.length == 0 ? (
          <div className="p-4">No exerices in this workout</div>
        ) : (
          ""
        )}
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="mb-4 mt-2 flex px-4">
            <div className="w-20 font-bold">{exercise.name}</div>
            <div className="ml-8 grid flex-1 grid-cols-[1fr,_2fr] items-center gap-2 pr-5 ">
              <div className="text-xs text-neutral-400">SET</div>
              {/* <div className="text-xs text-neutral-400">PREV</div> */}
              <div className="text-xs text-neutral-400">WEIGHT X REPS</div>
              {exercise.logs.map((log, index) => (
                <Fragment key={log.id}>
                  <div className="text-sm text-neutral-400">{index + 1}</div>
                  {/* <div className="text-sm text-neutral-400">...</div> */}
                  <div className="flex justify-start text-neutral-400">
                    <div className="text-center text-white">{log.weight}</div>
                    <span className="px-2">kg x</span>
                    <div className="text-center text-white">{log.reps}</div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default WorkoutDetailsInactive;

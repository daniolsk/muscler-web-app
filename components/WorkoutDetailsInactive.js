import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Header from "../components/Header";

function WorkoutDetailsInactive({ workout, guest }) {
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
        asLink
        href="/dashboard"
        buttonImageName="go-back"
      />
      <div className="m-auto max-w-5xl">
        <div>
          {guest ? (
            <h1 className="-mb-4 px-6 pt-4 text-left text-xl font-bold italic ">
              {workout.user.username}&apos;s workout
            </h1>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-between px-6 pt-4 text-left text-2xl font-extrabold">
          <div className="mr-4">{workout.name}</div>
          <button
            className="flex items-center rounded-md bg-background-darker-color px-2.5 py-1.5 hover:bg-background-darker-color-lighter"
            onClick={() => {
              if (window.isSecureContext)
                navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}
          >
            <div className="mr-1 text-sm">Share</div>
            <Image
              alt="share icon"
              priority
              src={"/icons/share.svg"}
              width={18}
              height={18}
            ></Image>
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between py-4 px-6">
          <div>
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
          <div className="flex flex-col items-end">
            {workout.tags.map((tag) => (
              <div
                key={tag.id}
                className="mb-2 rounded-full bg-red-800 p-2 text-xs font-bold"
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 text-xs text-neutral-400">EXERCISE</div>
        <div className="mb-4 sm:grid sm:grid-cols-2 sm:p-2">
          {workout.exercises.length == 0 ? (
            <div className="p-4 text-center text-neutral-400 sm:col-span-2">
              No exerices in this workout
            </div>
          ) : (
            ""
          )}
          {workout.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="mb-2 mt-2 flex bg-background-darker-color-lighter/25 px-4 py-2 sm:odd:mr-2 sm:even:ml-2"
            >
              <div className="w-20 text-sm font-bold">
                {index + 1 + ". " + exercise.name}
              </div>
              <div className="ml-4 grid flex-1 grid-cols-[2fr,_6fr,_1fr,_6fr] items-center justify-items-center gap-0.5 ">
                <div className="text-xs text-neutral-400">SET</div>
                <div className="text-xs text-neutral-400">WEIGHT</div>
                <div className="text-xs text-neutral-400"></div>
                <div className="text-xs text-neutral-400">REPS</div>
                {exercise.logs.length == 0 ? (
                  <div className="col-span-4 flex w-full items-center justify-center self-end p-2 text-sm italic text-neutral-400">
                    This exercise contains no sets
                  </div>
                ) : (
                  <>
                    {exercise.logs.map((log, index) => (
                      <Fragment key={log.id}>
                        <div className="text-sm text-blue-darker-lighter">
                          {index + 1}
                        </div>
                        <div className="w-full text-center text-white">
                          {log.weight}
                        </div>
                        <span className="px-2 text-sm">x</span>
                        <div className="w-full text-center text-white">
                          {log.reps}
                        </div>
                      </Fragment>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default WorkoutDetailsInactive;

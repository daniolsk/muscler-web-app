import Image from "next/image";
import { Fragment, useState } from "react";

import FullScreenConfirm from "../FullScreenConfirm";

import { v4 as uuidv4 } from "uuid";

function Exercise({
  exercise,
  setExericse,
  workoutId,
  setExerciseName,
  removeLog,
  removeExericse,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="mt-2 mb-2 flex border-background-darker-color bg-background-darker-color-lighter/25 p-3.5 md:odd:mr-2 md:even:ml-2">
      <div className="flex w-20 flex-col justify-between self-stretch text-sm font-bold">
        <textarea
          className="mb-2 min-h-[5rem] w-20 flex-1 resize-none border-none bg-transparent text-left text-white"
          type="text"
          value={exercise.name}
          onChange={(e) => setExerciseName(exercise.id, e.target.value)}
        />
        {isDeleting ? (
          <FullScreenConfirm
            button="Delete"
            onCancel={() => setIsDeleting(false)}
            onConfirm={() => removeExericse(exercise.id, exercise.isNew)}
            prompt={() => (
              <div>
                Delete exericsie <span className="italic">{exercise.name}</span>
                ?
              </div>
            )}
          />
        ) : (
          ""
        )}
        <button
          onClick={() => {
            setIsDeleting(true);
          }}
          className="flex w-full items-center justify-center rounded-md bg-blue-dark p-2 hover:bg-blue-darker-lighter"
        >
          <Image
            alt="trash icon"
            src={"/icons/trash.svg"}
            width={13}
            height={13}
            priority
          ></Image>
        </button>
      </div>
      <div className="ml-4 grid grid-cols-[2fr,_6fr,_1fr,_6fr,_2fr] items-center justify-items-center gap-2">
        <div className="text-xs text-neutral-400">SET</div>
        <div className="text-xs text-neutral-400">WEIGHT</div>
        <div className="text-xs text-neutral-400"></div>
        <div className="text-xs text-neutral-400">REPS</div>
        <div className="text-xs text-neutral-400">DELETE</div>
        {exercise.logs.length == 0 ? (
          <div className="col-span-5 flex w-full items-center justify-center self-end text-sm italic text-neutral-400">
            Add sets using the button below
          </div>
        ) : (
          <>
            {exercise.logs.map((log, index) => (
              <Fragment key={log.id}>
                <div className="text-md text-blue-darker-lighter">
                  {index + 1}
                </div>
                <div className="flex items-center text-neutral-400">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="appear w-full bg-background-darker-color/50 p-2 text-center text-neutral-600"
                    value="0"
                    disabled
                  />
                </div>
                <span className="px-2 text-sm">x</span>
                <div>
                  {" "}
                  <input
                    type="text"
                    inputMode="numeric"
                    className="appear w-full bg-background-darker-color/50 p-2 text-center text-neutral-600"
                    value="0"
                    disabled
                  />
                </div>
                <div className="flex items-center justify-end text-sm  text-neutral-400">
                  <button
                    onClick={() => {
                      removeLog(log.id, log.isNew);
                    }}
                    className="flex items-center justify-center p-2 hover:bg-blue-darker-lighter"
                  >
                    <Image
                      alt="trash icon"
                      src={"/icons/trash.svg"}
                      width={20}
                      height={20}
                      priority
                    ></Image>
                  </button>
                </div>
              </Fragment>
            ))}
          </>
        )}
        <button
          onClick={() => {
            let logsTmp = exercise.logs;

            let setNmr =
              exercise.logs.length == 0
                ? 1
                : exercise.logs[exercise.logs.length - 1].setNumber + 1;

            logsTmp.push({
              id: uuidv4(),
              exerciseId: exercise.id,
              isNew: true,
              reps: 0,
              setNumber: setNmr,
              weight: 0,
              workoutId: workoutId,
            });
            setExericse(exercise.id, logsTmp);
          }}
          className="col-span-5 flex w-full items-center justify-center self-end rounded-md bg-background-darker-color py-0.5"
        >
          <Image
            alt="plus icon"
            src={"/icons/plus.svg"}
            width={25}
            height={25}
            priority
          ></Image>
        </button>
      </div>
    </div>
  );
}

export default Exercise;

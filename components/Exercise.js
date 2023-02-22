import Image from "next/image";
import { Fragment, useState } from "react";

import { v4 as uuidv4 } from "uuid";

function Exercise({ exercise, setExericse, workoutId, setExerciseName }) {
  return (
    <div className="flex border-b-[1px] border-background-darker-color py-4 px-4">
      <div className="w-20 self-stretch text-sm font-bold">
        <textarea
          className="h-full w-20 resize-none border-none bg-transparent text-left text-white"
          type="text"
          value={exercise.name}
          onChange={(e) => setExerciseName(exercise.id, e.target.value)}
        />
      </div>
      <div className="ml-4 grid flex-1 grid-cols-[1fr,_1fr,_2fr] items-center gap-2">
        <div className="text-xs text-neutral-400">SET</div>
        <div className="text-xs text-neutral-400">PREV</div>
        <div className="text-xs text-neutral-400">TODAY</div>
        {exercise.logs.map((log, index) => (
          <Fragment key={index}>
            <div className="text-sm text-neutral-400">{log.setNumber}</div>
            <div className="flex text-sm  text-neutral-400">
              <div className="text-center">0</div>
              <span className="px-1">x</span>
              <div className="text-center">0</div>
            </div>
            <div className="flex text-neutral-400">
              <input
                type="text"
                className="w-12 bg-background-darker-color/50 p-2 text-center text-white"
                value={log.weight}
                onChange={(e) => {
                  let logsTmp = exercise.logs;
                  logsTmp[index].weight = Number(e.target.value);
                  logsTmp[index].id = log.id;
                  logsTmp[index].isChanged = true;
                  setExericse(exercise.id, logsTmp);
                }}
              />

              <span className="px-2">x</span>
              <input
                type="text"
                className="w-12 bg-background-darker-color/50 p-2 text-center text-white"
                value={log.reps}
                onChange={(e) => {
                  let logsTmp = exercise.logs;
                  logsTmp[index].reps = Number(e.target.value);
                  logsTmp[index].id = log.id;
                  logsTmp[index].isChanged = true;
                  setExericse(exercise.id, logsTmp);
                }}
              />
            </div>
          </Fragment>
        ))}
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
          className="col-span-3 flex items-center justify-center rounded-md bg-background-darker-color py-0.5"
        >
          <Image
            alt="plus icon"
            src={"/icons/plus.svg"}
            width={25}
            height={25}
          ></Image>
        </button>
      </div>
    </div>
  );
}

export default Exercise;

import Image from "next/image";
import { Fragment, useState } from "react";

import { v4 as uuidv4 } from "uuid";

function Exercise({
  exercise,
  setExericse,
  workoutId,
  setExerciseName,
  removeLog,
  removeExericse,
}) {
  return (
    <div className="flex border-b-[1px] border-background-darker-color py-4 px-4">
      <div className="flex w-20 flex-col justify-between self-stretch text-sm font-bold">
        <textarea
          className="mb-2 w-20 flex-1 resize-none border-none bg-transparent text-left text-white"
          type="text"
          value={exercise.name}
          onChange={(e) => setExerciseName(exercise.id, e.target.value)}
        />
        <button
          onClick={() => {
            removeExericse(exercise.id, exercise.isNew);
          }}
          className="flex w-full items-center justify-center rounded-md bg-blue-dark p-2"
        >
          <Image
            alt="plus icon"
            src={"/icons/trash.svg"}
            width={13}
            height={13}
          ></Image>
        </button>
      </div>
      <div className="ml-4 grid flex-1 grid-cols-[1fr,_8fr,_2fr] items-center gap-2">
        <div className="text-xs text-neutral-400">SET</div>
        <div className="text-xs text-neutral-400">TODAY</div>
        <div className="justify-self-end text-xs text-neutral-400">DELETE</div>
        {exercise.logs.map((log, index) => (
          <Fragment key={log.id}>
            <div className="text-sm text-neutral-400">{index + 1}</div>
            <div className="flex items-center text-neutral-400">
              <input
                type="number"
                inputMode="numeric"
                className="w-14 bg-background-darker-color/50 p-2 text-center text-white"
                value={log.weight}
                onFocus={(e) => {
                  e.target.select();
                }}
                onClick={(e) => {
                  e.target.select();
                }}
                onChange={(e) => {
                  let logsTmp = exercise.logs;
                  logsTmp[index].weight = Number(e.target.value);
                  logsTmp[index].id = log.id;
                  logsTmp[index].isChanged = true;
                  setExericse(exercise.id, logsTmp);
                }}
              />

              <span className="px-2 text-sm">kg x</span>
              <input
                type="text"
                inputMode="numeric"
                className="appear w-14 bg-background-darker-color/50 p-2 text-center text-white"
                value={log.reps}
                onFocus={(e) => {
                  e.target.select();
                }}
                onClick={(e) => {
                  e.target.select();
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (/^\d*$/.test(inputValue)) {
                    let logsTmp = exercise.logs;
                    logsTmp[index].reps = Number(inputValue);
                    logsTmp[index].id = log.id;
                    logsTmp[index].isChanged = true;
                    setExericse(exercise.id, logsTmp);
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-end text-sm  text-neutral-400">
              <button
                onClick={() => {
                  removeLog(log.id, log.isNew);
                }}
                className="col-span-3 flex items-center justify-center p-2"
              >
                <Image
                  alt="trash icon"
                  src={"/icons/trash.svg"}
                  width={20}
                  height={20}
                ></Image>
              </button>
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

import React, { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { motion } from "framer-motion";

function Calendar({ workouts }) {
  const [workoutsDates, setWorkoutsDates] = useState([]);
  const [lastDays, setLastDays] = useState([]);
  const [numberOfOldDays, setNumberOfOldDays] = useState(0);

  const generateMoreDays = (offset) => {
    setNumberOfOldDays(lastDays.length);

    let lastDaysTmp = [];
    let now = moment();

    now.subtract(offset, "days");

    lastDaysTmp.push(moment(now));

    for (let i = 1; i < 14; i++) {
      now.subtract(1, "days");
      lastDaysTmp.push(moment(now));
    }

    setLastDays([...lastDays, ...lastDaysTmp]);
  };

  useEffect(() => {
    let workoutsDatesTmp = [];
    workouts &&
      workouts.forEach((workout) => {
        workoutsDatesTmp.push({
          ...workout,
          date: moment(new Date(workout.date).valueOf()),
        });
      });

    setWorkoutsDates([...workoutsDatesTmp]);
  }, [workouts]);

  useEffect(() => {
    if (lastDays.length == 0) {
      generateMoreDays(0);
    }
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between gap-2 overflow-auto pb-2">
        {lastDays.map((day, i) => (
          <motion.div
            key={i}
            initial={{
              x: 50,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 100,
              transition: {
                delay: (i - numberOfOldDays) * 0.05,
              },
            }}
          >
            <div
              className={`whitespace-nowrap border-b-2 border-blue-light px-4 py-2 text-center ${
                i == 0 ? "font-bold text-blue-light" : "text-white"
              }`}
            >
              <div className="text-md font-bold">
                {i == 0 ? "Today" : `${day.format("ddd")}`}
              </div>
              <div className="text-xs">{`${day.format("DD.MM")}`}</div>
            </div>
            <div className="mt-2 flex flex-col items-start p-2">
              {workoutsDates.filter((workout) =>
                workout.date.isSame(day, "day")
              ).length != 0 ? (
                workoutsDates
                  .filter((workout) => workout.date.isSame(day, "day"))
                  .map((workout) => (
                    <div key={workout.id} className="flex flex-col items-start">
                      {workout.tags.map((tag) => (
                        <div
                          key={tag.name}
                          className="mb-1 rounded-full bg-red-800 p-2 text-center text-xs font-semibold"
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  ))
              ) : (
                <div className="text-center text-sm text-neutral-400">
                  Rest day
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{
            x: 50,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 100,
            transition: {
              delay: 15 * 0.05,
            },
          }}
          className="flex min-w-fit cursor-pointer items-center self-center"
        >
          <button
            className="rounded-md p-2 hover:bg-white/20"
            onClick={() => generateMoreDays(lastDays.length)}
          >
            <Image
              className=""
              src={"/icons/arrow-right.svg"}
              alt="arrow right"
              width={18}
              height={18}
            ></Image>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Calendar;

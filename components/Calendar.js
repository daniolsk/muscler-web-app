import React, { useEffect, useState } from "react";

import moment from "moment";

function Calendar({ workouts }) {
  const [workoutsDates, setWorkoutsDates] = useState([]);

  const [lastDays, setLastDays] = useState([]);

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

    let lastDaysTmp = [];
    let now = moment();
    lastDaysTmp.push(moment(now));

    for (let i = 1; i < 10; i++) {
      now.subtract(1, "days");
      lastDaysTmp.push(moment(now));
    }

    setLastDays([...lastDaysTmp]);
  }, [workouts]);

  return (
    <div className="p-4">
      <div className="flex justify-between overflow-auto pb-2">
        {lastDays.map((day, i) => (
          <div key={i}>
            <div
              className={`whitespace-nowrap border-b-2 border-blue-light px-4 py-2 text-center ${
                i == 0 ? "font-bold text-blue-light" : "text-white"
              }`}
            >
              {i == 0 ? "Today" : `${day.format("DD.MM")}`}
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;

import Head from "next/head";
import Image from "next/image";
import { verifyToken } from "../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../lib/prisma";
import { useRouter } from "next/navigation";

import NewWorkout from "../components/NewWorkout";
import DeleteWorkout from "../components/DeleteWorkout";
import Header from "../components/Header";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard({ user, workouts }) {
  const router = useRouter();

  console.log(workouts);

  const [workoutsState, setWorkoutsState] = useState(workouts);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);
  const [isFilter, setIsFilter] = useState(false);

  useEffect(() => {
    setWorkoutsState(workouts);
  }, [workouts]);

  const handleFilterInput = (e) => {
    let val = e.target.value;

    if (val == "") {
      setIsFilter(false);
    } else {
      setIsFilter(true);

      let tmpWrk = workoutsState.filter((workout) => {
        if (workout.name.toLowerCase().includes(val.toLowerCase())) {
          return true;
        } else {
          if (
            workout.tags.filter((tag) =>
              tag.name.toLowerCase().includes(val.toLowerCase())
            ).length != 0
          ) {
            return true;
          }
        }

        return false;
      });
      setFilteredWorkouts([...tmpWrk]);
    }

    setFilter(val);
  };

  const formatDate = (date) => {
    let dateObj = new Date(date);

    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString().slice(0, -3)
    );
  };

  const deleteWorkout = (id) => {
    let tmpWrks = workoutsState;
    tmpWrks = tmpWrks.filter((wrk) => wrk.id != id);
    setWorkoutsState([...tmpWrks]);
  };

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    let data = await response.json();

    if (response.status != 200) {
      setError(data.msg);
      return;
    }

    router.push("/login");
  };

  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white">
        <Header
          buttonText={"Log out"}
          buttonOnClick={handleLogout}
          buttonImageName="logout"
        />
        <div className="m-auto max-w-3xl">
          <div className="flex items-center justify-center p-5 pb-2">
            <h1 className="mr-2 text-center text-4xl font-bold md:text-5xl">
              <span className="text-2xl font-normal md:text-3xl">Hello</span>{" "}
              {user.username}
            </h1>
            <Link href={"/profile"} className="p-1 md:p-2">
              <Image
                alt="profile settings"
                src="/icons/settings.svg"
                width={21}
                height={21}
                priority
              ></Image>
            </Link>
          </div>
          <p className="mb-4 text-center text-xl md:text-2xl">
            Your recent workouts:
          </p>
          <div className="text-md text-center font-bold text-red-600">
            {error ? error : ""}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 md:text-lg">
              <input
                className="flex-1 rounded-md border-2 border-black bg-background-darker-color p-2 text-white"
                type="text"
                placeholder="Filter workouts by name or tag..."
                value={filter}
                onChange={handleFilterInput}
              />
            </div>
            <div className="p-4 pt-2">
              <NewWorkout user={user} />
              {workoutsState.length < 1 ? (
                <>
                  <div className="mt-10 mb-2 px-4 text-center">
                    No workouts yet...
                  </div>
                  <div className="px-4 text-center text-lg font-bold text-blue-light">
                    Go ahead and create one using button above!
                  </div>
                </>
              ) : (
                <>
                  {(isFilter ? filteredWorkouts : workoutsState).map(
                    (workout) => (
                      <div key={workout.id} className="mb-2 flex flex-1">
                        <div
                          className={`flex flex-1 rounded-md border-2 border-black bg-gradient-to-r ${
                            workout.isActive
                              ? "from-purple-500 to-pink-500"
                              : "from-sky-600 to-indigo-600"
                          }`}
                        >
                          <Link
                            href={`/workout/${workout.id}`}
                            className="flex-1"
                          >
                            <div className="p-4">
                              <div className="mb-2 flex justify-between">
                                <div className="text-lg font-bold md:text-xl">
                                  {workout.name}
                                </div>
                                <div className="text-white md:text-base">
                                  {formatDate(workout.date)}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className=" flex flex-col text-white">
                                  <div className="text-sm md:text-base">
                                    Total sets:{" "}
                                    <span className="text-base font-bold md:text-lg">
                                      {workout._count.logs}
                                    </span>
                                  </div>
                                  <div className="text-sm md:text-base">
                                    Total exercises:{" "}
                                    <span className="text-base font-bold md:text-lg">
                                      {workout._count.exercises}
                                    </span>
                                  </div>
                                  <div className="text-sm md:text-base">
                                    Total weight:{" "}
                                    <span className="text-base font-bold md:text-lg">
                                      {workout.totalWeight} kg
                                    </span>
                                  </div>
                                </div>
                                {/* <div className="flex max-w-min flex-col">
                                  {workout.exercises.map((exercise) => (
                                    <div
                                      key={exercise.id}
                                      className="mb-4 mt-2 flex px-4"
                                    >
                                      <div className="w-20 font-bold">
                                        {exercise.name}
                                      </div>
                                      <div className="ml-4 grid flex-1 grid-cols-[2fr,_6fr,_1fr,_6fr] items-center justify-items-center gap-2 ">
                                        <div className="text-xs text-neutral-400">
                                          SET
                                        </div>
                                        <div className="text-xs text-neutral-400">
                                          WEIGHT
                                        </div>
                                        <div className="text-xs text-neutral-400"></div>
                                        <div className="text-xs text-neutral-400">
                                          REPS
                                        </div>
                                        {exercise.logs.map((log, index) => (
                                          <Fragment key={log.id}>
                                            <div className="text-sm text-neutral-400">
                                              {index + 1}
                                            </div>
                                            <div className="w-full text-center text-white">
                                              {log.weight}
                                            </div>
                                            <span className="px-2 text-sm">
                                              x
                                            </span>
                                            <div className="w-full text-center text-white">
                                              {log.reps}
                                            </div>
                                          </Fragment>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div> */}
                                <div className="flex flex-col items-end">
                                  {workout.tags.map((tag) => (
                                    <div
                                      key={tag.id}
                                      className="mb-1 rounded-full bg-red-800 p-2 text-xs font-semibold md:text-sm"
                                    >
                                      {tag.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="flex flex-col justify-start bg-background-darker-color/60">
                            <DeleteWorkout
                              deleteWorkoutHandle={deleteWorkout}
                              workout={workout}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies["access-token"];

  if (token && verifyToken(token)) {
    const dataFromToken = decode(token);

    let data = await prisma.workout.findMany({
      where: {
        userId: dataFromToken.id,
        isTemplate: false,
      },
      orderBy: [
        {
          isActive: "desc",
        },
        {
          date: "desc",
        },
      ],
      include: {
        logs: true,
        tags: true,
        exercises: {
          include: {
            logs: true,
          },
        },
        _count: {
          select: { logs: true, exercises: true },
        },
      },
    });

    let workouts = data.map((workout) => ({
      ...workout,
      date: workout.date.toString(),
    }));

    workouts.forEach((workout) => {
      let totalWeight = 0;

      workout.logs.forEach((log) => {
        totalWeight += log.weight * log.reps;
      });

      workout.totalWeight = totalWeight;
    });

    return {
      props: {
        user: {
          username: dataFromToken.username,
          id: dataFromToken.id,
        },
        workouts: workouts,
      },
    };
  }

  return {
    redirect: {
      destination: "/login",
    },
  };
}

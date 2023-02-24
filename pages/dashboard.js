import Head from "next/head";
import Image from "next/image";
import { verifyToken } from "../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../lib/prisma";
import { useRouter } from "next/navigation";

import NewWorkout from "../components/NewWorkout";
import DeleteWorkout from "../components/DeleteWorkout";
import { useState } from "react";
import Link from "next/link";

export default function Dashboard({ user, workouts }) {
  const router = useRouter();

  const [error, setError] = useState("");

  const formatDate = (date) => {
    let dateObj = new Date(date);

    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString().slice(0, -3)
    );
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
        <title>Workout tracker app</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white">
        <div className="flex items-center justify-between bg-background-darker-color p-3">
          <div>
            MUSCLER{" "}
            <span className="text-sm font-thin italic text-neutral-400">
              by Daniel Skowron
            </span>
          </div>
          <div
            className="flex cursor-pointer items-center"
            onClick={handleLogout}
          >
            <div className="mr-2">Log out</div>
            <Image
              alt="log out icon"
              src="/icons/logout.svg"
              width={15}
              height={15}
            ></Image>
          </div>
        </div>
        <h1 className="p-5 pb-2 text-center text-4xl font-bold">
          <span className="text-2xl font-normal">Hello</span> {user.username}
        </h1>
        <p className="mb-4 text-center text-xl">Your last workouts:</p>
        <div className="text-md text-center font-bold text-red-600">
          {error ? error : ""}
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between px-8 py-1">
            <div>Name</div>
            <div>Date</div>
          </div>
          <div className="p-4">
            <NewWorkout user={user} />
            {workouts.length < 1 ? (
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
                {workouts.map((workout) => (
                  <div key={workout.id} className="mb-2 flex flex-1">
                    <Link
                      href={`/workout/${workout.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div
                        className={`rounded-l-md border-2 border-black bg-gradient-to-r ${
                          workout.isActive
                            ? "from-purple-500 to-pink-500"
                            : "from-sky-600 to-indigo-600"
                        } p-4`}
                      >
                        <div className="mb-2 flex justify-between">
                          <div className="text-lg font-bold">
                            {workout.name}
                          </div>
                          <div className="text-white">
                            {formatDate(workout.date)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className=" flex flex-col text-white">
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
                      </div>
                    </Link>
                    <div className="flex flex-col justify-start rounded-r-md bg-background-darker-color">
                      <DeleteWorkout workout={workout} />
                    </div>
                  </div>
                ))}
              </>
            )}
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
      },
      orderBy: {
        date: "desc",
      },
      include: {
        logs: true,
        exercises: true,
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

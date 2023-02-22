import Head from "next/head";
import Image from "next/image";
import { verifyToken } from "../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../lib/prisma";
import { useRouter } from "next/navigation";

import NewWorkout from "../components/NewWorkout";
import DeleteWorkout from "../components/DeleteWorkout";
import { useState } from "react";

export default function Dashboard({ user, workouts }) {
  const router = useRouter();

  const [error, setError] = useState("");

  const formatDate = (date) => {
    let dateObj = new Date(date);

    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
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
            WTA{" "}
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
        <div className="flex flex-col">
          <div className="flex justify-between px-8 py-1">
            <div>Name</div>
            <div>Date</div>
          </div>
          <div className="p-4">
            <NewWorkout user={user} />
            {workouts.length < 1 ? (
              <div className="py-10 text-center">No workouts yet...</div>
            ) : (
              <>
                {workouts.map((workout) => (
                  <div
                    onClick={() => router.push(`/workout/${workout.id}`)}
                    key={workout.id}
                    className="flex-1 cursor-pointer"
                  >
                    <div
                      className={`mb-2 rounded-md border-2 border-black bg-gradient-to-r ${
                        workout.isActive
                          ? "from-purple-500 to-pink-500"
                          : "from-sky-600 to-indigo-600"
                      } p-4`}
                    >
                      <div className="mb-2 flex justify-between">
                        <div className="font-bold text-white">
                          {workout.name}
                        </div>
                        <div className="text-white">
                          {formatDate(workout.date)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className=" text-white">
                          Total sets: {workout._count.logs}
                        </div>
                        <DeleteWorkout workout={workout} />
                      </div>
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
        _count: {
          select: { logs: true },
        },
      },
    });

    let workouts = data.map((workout) => ({
      ...workout,
      date: workout.date.toString(),
    }));

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
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { verifyToken } from "../../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { Fragment } from "react";

export default function Workout({ workout }) {
  const formatDate = (date) => {
    let dateObj = new Date(date);

    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
  };

  const router = useRouter();
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
            <h1 className="mb-2 text-left text-2xl font-bold">
              {workout.name}
            </h1>
            <h3 className="text-left text-sm">{formatDate(workout.date)}</h3>
          </div>
          <button className="cursor-pointer rounded-md bg-blue-dark px-4 py-3 text-lg font-bold">
            Save
          </button>
        </div>
        <div className="px-4 text-xs text-neutral-400">EXERCISES</div>
        <div>
          {workout.exercises.length == 0 ? (
            <div className="p-4">No exerices in this workout</div>
          ) : (
            ""
          )}
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="mb-4 mt-2 flex px-4">
              <div className="w-20 font-bold">{exercise.name}</div>
              <div className="ml-8 grid flex-1 grid-cols-[1fr,_1fr,_2fr] items-center gap-2 pr-5 ">
                <div className="text-xs text-neutral-400">SET</div>
                <div className="text-xs text-neutral-400">PREV</div>
                <div className="text-xs text-neutral-400">TODAY</div>
                {exercise.logs.map((log) => (
                  <Fragment key={log.id}>
                    <div className="text-sm text-neutral-400">
                      {log.setNumber}
                    </div>
                    <div className="text-sm text-neutral-400">...</div>
                    <div className="justify-betweentext-neutral-400 flex">
                      <div className="flex-1 text-center text-white">
                        {log.weight}
                      </div>
                      <span className="px-2">x</span>
                      <div className="flex-1 text-center text-white">
                        {log.reps}
                      </div>
                    </div>
                  </Fragment>
                ))}
                {workout.isActive ? (
                  <button className="col-span-3 flex items-center justify-center rounded-md bg-background-darker-color py-0.5">
                    <Image
                      alt="plus icon"
                      src={"/icons/plus.svg"}
                      width={25}
                      height={25}
                    ></Image>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies["access-token"];
  const dataFromToken = decode(token);

  if (token && verifyToken(token)) {
    const id = context.params.workoutId;

    let workout = await prisma.workout.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        exercises: {
          orderBy: {
            exerciseNumber: "asc",
          },
          include: {
            logs: {
              orderBy: {
                setNumber: "asc",
              },
            },
          },
        },
      },
    });

    if (!workout) {
      return {
        redirect: {
          destination: "/dashboard",
        },
      };
    }

    workout.date = workout.date.toString();

    if (dataFromToken.id != workout.user.id) {
      return {
        redirect: {
          destination: "/dashboard",
        },
      };
    }

    return {
      props: { workout },
    };
  }

  return {
    redirect: {
      destination: "/login",
    },
  };
}

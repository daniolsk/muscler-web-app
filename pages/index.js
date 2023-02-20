import Head from "next/head";
import { verifyToken } from "../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../lib/prisma";

export default function Home({ user, workouts }) {
  return (
    <div>
      <Head>
        <title>Workout tracker app</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-4xl p-10">
        <h1 className="mb-4 text-center text-4xl font-bold">
          Hello {user.username}
        </h1>
        <p className="mb-20 text-center text-xl">Your Last workouts:</p>
        <div className="flex flex-col">
          {workouts.map((workout) => (
            <div>
              {workout.id} - {workout.name} - {workout.date}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies["access-token"];

  if (token && verifyToken(token)) {
    const dataFromToken = decode(token);
    console.log(dataFromToken);

    let data = await prisma.workout.findMany({
      where: {
        userId: dataFromToken.id,
      },
      orderBy: {
        date: "asc",
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

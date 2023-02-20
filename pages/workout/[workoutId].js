import Head from "next/head";
import { useRouter } from "next/router";
import { verifyToken } from "../../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../../lib/prisma";

export default function Workout({ workout }) {
  const formatDate = (date) => {
    let dateObj = new Date(date);

    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
  };

  console.log(workout);

  const router = useRouter();
  const { workoutId } = router.query;
  return (
    <div>
      <Head>
        <title>Workout tracker app</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-4xl p-10">
        <h1 className="mb-2 text-center text-2xl font-bold">{workout.name}</h1>
        <h3 className="mb-6 text-center text-sm">{formatDate(workout.date)}</h3>
        <ul>
          {workout.exercises.map((exercise) => (
            <li key={exercise.id} className="mb-4 list-disc">
              {exercise.exerciseNumber} - <b>{exercise.name}</b>
              <ul className="list-inside list-disc">
                {exercise.logs.map((log) => (
                  <li key={log.id}>
                    {log.setNumber} - {log.weight} kg * {log.reps}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
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

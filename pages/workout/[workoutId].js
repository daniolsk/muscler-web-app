import Head from "next/head";
import { useRouter } from "next/router";
import { verifyToken } from "../../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../../lib/prisma";
import WorkoutDetailsInactive from "../../components/WorkoutDetailsInactive";
import WorkoutDetailsActive from "../../components/WorkoutDetailsActive";

export default function Workout({ workout }) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Workout tracker app</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {workout.isActive ? (
        <WorkoutDetailsActive workout={workout} />
      ) : (
        <WorkoutDetailsInactive workout={workout} />
      )}
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

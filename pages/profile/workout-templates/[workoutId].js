import Head from "next/head";
import { verifyToken } from "../../../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../../../lib/prisma";
import TemplateWorkoutDetailsActive from "../../../components/templates/TemplateWorkoutDetailsActive";

export default function Workout({ workout }) {
  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <TemplateWorkoutDetailsActive workout={workout} />
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
        tags: true,
        _count: {
          select: { logs: true, exercises: true },
        },
        logs: true,
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
          destination: "/profile/workout-templates",
        },
      };
    }

    if (!workout.isTemplate) {
      return {
        redirect: {
          destination: "/profile/workout-templates",
        },
      };
    }

    let totalWeight = 0;

    workout.logs.forEach((log) => {
      totalWeight += log.weight * log.reps;
    });

    workout.totalWeight = totalWeight;

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

import Head from "next/head";
import { verifyToken } from "../../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../../lib/prisma";
import WorkoutDetailsInactive from "../../components/WorkoutDetailsInactive";
import WorkoutDetailsActive from "../../components/WorkoutDetailsActive";

export default function Workout({ workout, infoForGuest }) {
  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {workout.isActive ? (
        <WorkoutDetailsActive workout={workout} />
      ) : (
        <WorkoutDetailsInactive workout={workout} guest={infoForGuest} />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies["access-token"];

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
        destination: "/dashboard",
      },
    };
  }

  if (workout.isTemplate) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  let infoForGuest = false;

  if (workout.isActive) {
    if (!(token && verifyToken(token))) {
      return {
        redirect: {
          destination: "/login",
        },
      };
    } else {
      let dataFromToken = decode(token);
      if (dataFromToken.id != workout.user.id) {
        return {
          redirect: {
            destination: "/dashboard",
          },
        };
      }
    }
  } else {
    if (!(token && verifyToken(token))) {
      infoForGuest = true;
    } else {
      let dataFromToken = decode(token);
      if (dataFromToken.id != workout.user.id) {
        infoForGuest = true;
      }
    }
  }

  let dataFromToken = decode(token);

  let totalWeight = 0;

  workout.logs.forEach((log) => {
    totalWeight += log.weight * log.reps;
  });

  workout.totalWeight = totalWeight;

  workout.date = workout.date.toString();

  if (workout.isActive && dataFromToken.id != workout.user.id) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  return {
    props: { workout, infoForGuest },
  };
}

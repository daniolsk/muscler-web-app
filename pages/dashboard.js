import Head from "next/head";
import { verifyToken } from "../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../lib/prisma";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard({ user, workouts }) {
  const router = useRouter();
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
      console.log(data.msg);
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

      <main className="mx-auto max-w-4xl p-10">
        <h1 className="mb-4 text-center text-4xl font-bold">
          Hello {user.username}
        </h1>
        <div
          onClick={handleLogout}
          className="mb-2 cursor-pointer text-center text-red-600 underline"
        >
          Log out
        </div>
        <p className="mb-4 text-center text-xl">Your Last workouts:</p>
        <div className="flex flex-col">
          <div className="flex justify-between p-4 text-neutral-600">
            <div>Name</div>
            <div>Date</div>
          </div>
          {workouts.map((workout) => (
            <Link
              href={`/workout/${workout.id}`}
              key={workout.id}
              className="mb-2"
            >
              <div className="rounded-md border-2 border-black bg-gradient-to-r from-sky-600 to-indigo-600 p-4">
                <div className="flex justify-between">
                  <div className="font-bold text-white">{workout.name}</div>
                  <div className="text-white">{formatDate(workout.date)}</div>
                </div>
              </div>
            </Link>
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

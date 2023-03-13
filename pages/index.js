import Head from "next/head";
import Link from "next/link";
import { verifyToken } from "../lib/jwt";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white">
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="mt-12 mb-1 text-center text-5xl font-bold">MUSCLER</h1>
          <h3 className="mb-6 text-center text-lg font-normal italic">
            by Daniel Skowron
          </h3>
          <p className="mb-8 text-center text-lg">
            Log your workouts, track your progress, improve your form 💪
          </p>
          <p className="mb-4 text-center text-lg font-bold text-blue-light">
            IT IS THAT SIMPLE
          </p>
          <div className="flex items-center justify-center">
            <Link
              className="text-md cursor-pointer rounded-md border-2 border-black bg-blue-dark p-6 font-bold text-white hover:bg-blue-darker-lighter"
              href="/dashboard"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies["access-token"];

  if (token && verifyToken(token)) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  return {
    props: {},
  };
}

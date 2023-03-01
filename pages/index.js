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

      <main className="h-screen text-white">
        <div className="flex h-full flex-col items-center justify-center p-4">
          <h1 className="mt-4 text-center text-4xl font-bold">MUSCLER</h1>
          <h3 className="text-md mb-8 text-center font-normal italic">
            by Daniel Skowron
          </h3>
          <p className="mb-8 text-center text-lg">
            Log your workouts, track your progress, improve your form
          </p>
          <p className="text-center text-lg font-bold text-blue-light">
            IT IS THAT SIMPLE
          </p>
          <div className="flex items-center justify-center p-6">
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
        destination: "/login",
      },
    };
  }
}

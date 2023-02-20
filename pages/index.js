import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Workout tracker app</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mflex flex-col p-8">
        <h1 className="text-center text-4xl font-bold">Workout tracker app</h1>
        <h3 className="text-md mt-4 mb-8 text-center font-normal italic">
          by Daniel Skowron
        </h3>
        <p className="mb-8 text-center text-lg">
          Log your workouts, track your progress, improve your form
        </p>
        <div className="flex items-center justify-center p-6">
          <Link
            className="cursor-pointer rounded-md border-4 border-red-900 bg-red-200 p-4 font-bold"
            href="/dashboard"
          >
            Open dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

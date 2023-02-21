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

      <main className="h-screen text-white">
        <div className="flex items-center justify-between bg-background-darker-color p-3">
          <div>
            WTA{" "}
            <span className="text-sm font-thin italic text-neutral-400">
              by Daniel Skowron
            </span>
          </div>
        </div>
        <div className="flex h-full flex-col items-center p-4">
          <h1 className="mt-8 text-center text-4xl font-bold">
            Workout tracker app
          </h1>
          <h3 className="text-md mt-4 mb-8 text-center font-normal italic">
            by Daniel Skowron
          </h3>
          <p className="mb-8 text-center text-lg">
            Log your workouts, track your progress, improve your form
          </p>
          <div className="flex items-center justify-center p-6">
            <Link
              className="text-md cursor-pointer rounded-md border-2 border-black bg-blue-dark p-6 font-bold text-white hover:bg-background-darker-color"
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

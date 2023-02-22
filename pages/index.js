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

      <main className="h-screen bg-gradient-to-t from-background-darker-color to-background-color text-white">
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

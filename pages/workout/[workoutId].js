import Head from "next/head";
import { useRouter } from "next/router";

export default function Workout() {
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
        <h1 className="mb-4 text-center text-4xl font-bold">{workoutId}</h1>
      </main>
    </div>
  );
}

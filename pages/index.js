import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { verifyToken } from "../lib/jwt";

import mainImage from "../public/images/screens/539shots_so_short.png";
import mainImage2 from "../public/images/screens/21shots_so.png";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white">
        <div className="flex flex-col items-center p-4 text-center">
          <h1 className="mt-6 text-5xl font-bold">MUSCLER</h1>
          <h3 className="mb-8 text-lg font-normal italic">by Daniel Skowron</h3>
          <div className="mb-8 text-lg font-semibold">
            Log your workouts, track your progress, improve your form 💪
          </div>

          <div className="mb-2 text-lg font-bold italic text-blue-light">
            IT IS THAT SIMPLE
          </div>
          <Link
            className="text-md cursor-pointer rounded-md border-2 border-black bg-blue-dark p-6 font-bold text-white hover:bg-blue-darker-lighter"
            href="/dashboard"
          >
            Open dashboard
          </Link>
        </div>
        <Image
          alt="app showcase"
          src={mainImage}
          className="fixed bottom-0 left-1/2 w-[300px] translate-x-[-50%] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] sm:w-[350px] md:w-[360px] lg:hidden"
        ></Image>
        <Image
          alt="app showcase big screen"
          src={mainImage2}
          className="fixed bottom-[-5rem] left-1/2 hidden w-[800px] translate-x-[-50%] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] lg:block xl:bottom-[-8rem] xl:w-[900px]"
        ></Image>
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

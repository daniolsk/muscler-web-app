import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { verifyToken } from "../lib/jwt";

import mainImage from "../public/images/screens/539shots_so.png";
import mainImage2 from "../public/images/screens/125shots_so.png";
import { motion } from "framer-motion";

import imageBrowser from "../public/images/screens/21shots_so.png";
import imageBrowser2 from "../public/images/screens/33shots_so.png";

import phoneImage from "../public/images/screens/539shots_so.png";
import phoneImage2 from "../public/images/screens/870shots_so.png";
import phoneImage3 from "../public/images/screens/443shots_so.png";

import blob from "../public/images/blobs/blob.svg";
import blob2 from "../public/images/blobs/blob2.svg";
import blob3 from "../public/images/blobs/blob3.svg";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white">
        <div className="flex h-[60vh] flex-col items-center justify-center px-6 py-4 text-center sm:h-[50vh]">
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
        <div className="flex items-start justify-center pt-4 pb-6">
          <motion.div
            whileHover={{ scale: 1.04 }}
            transformTemplate={({ scale }) => `scale(${scale})`}
          >
            <Image
              alt="app showcase"
              draggable={false}
              src={mainImage}
              quality={100}
              priority
              className="-z-10 w-[240px] self-start sm:w-[300px] md:hidden"
            ></Image>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            transformTemplate={({ scale }) => `scale(${scale})`}
          >
            <Image
              alt="app showcase big screen"
              draggable={false}
              src={mainImage2}
              quality={100}
              priority
              className="-z-10 hidden w-[800px] self-start md:block"
            ></Image>
          </motion.div>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-4 font-semibold">
            <h3 className="mb-4 text-center text-2xl">
              With <span className="font-bold text-blue-light">MUSCLER</span>{" "}
              you can:
            </h3>
            <ul className="list-disc pl-6">
              <li className="mb-2">
                Add workout - save your progress, add tags, sets and weight
              </li>
              <li className="mb-2">
                After finishg your workout, see the results, analyze and share
                with your friends!
              </li>
              <li>Create templates and add workouts even faster!</li>
            </ul>
          </div>
          <div className="flex items-start justify-center pt-4 pb-6">
            <Image
              alt="app showcase"
              draggable={false}
              src={mainImage2}
              quality={100}
              priority
              className="-z-10 w-[700px] self-start px-4 md:hidden"
            ></Image>
            <div className="hidden p-4 md:flex">
              <Image
                alt="app showcase"
                draggable={false}
                src={phoneImage}
                quality={100}
                priority
                className="-z-10 w-1/3 self-start px-4 lg:w-[340px]"
              ></Image>
              <Image
                alt="app showcase"
                draggable={false}
                src={phoneImage2}
                quality={100}
                priority
                className="-z-10 w-1/3 self-start px-4 lg:w-[340px]"
              ></Image>
              <Image
                alt="app showcase"
                draggable={false}
                src={phoneImage3}
                quality={100}
                priority
                className="-z-10 w-1/3 self-start px-4 lg:w-[340px]"
              ></Image>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-4 font-semibold">
            <h3 className="text-center text-2xl">
              <span className="font-bold text-blue-light">MUSCLER</span> works
              in browser
              <div className="text-base">(on mobile or desktop)</div>
            </h3>
          </div>
          <div className="overflow-hidden lg:flex">
            <div className="flex items-start justify-center py-4">
              <Image
                alt="app showcase"
                draggable={false}
                src={imageBrowser}
                quality={100}
                priority
                className="-z-10 w-[700px] self-start px-4"
              ></Image>
            </div>
            <div className="flex items-start justify-center py-4">
              <Image
                alt="app showcase"
                draggable={false}
                src={imageBrowser2}
                quality={100}
                priority
                className="-z-10 w-[700px] self-start px-4"
              ></Image>
            </div>
          </div>
          <div className="px-6 py-12">
            <Link
              className="text-md cursor-pointer rounded-md border-2 border-black bg-blue-dark p-6 font-bold text-white hover:bg-blue-darker-lighter"
              href="/dashboard"
            >
              Get started
            </Link>
          </div>
          <div className="bg-background-darker-color py-4">
            Made with ❤ by Daniel Skowron
          </div>
        </div>
      </main>
    </div>
  );
}

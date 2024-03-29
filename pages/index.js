import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Header from "../components/Header";

import mainImage from "../public/images/screens/539shots_so.png";
import mainImage2 from "../public/images/screens/125shots_so.png";
import { motion } from "framer-motion";

import imageBrowser from "../public/images/screens/21shots_so.png";
import imageBrowser2 from "../public/images/screens/33shots_so.png";

import phoneImage from "../public/images/screens/539shots_so.png";
import phoneImage2 from "../public/images/screens/870shots_so.png";
import phoneImage3 from "../public/images/screens/443shots_so.png";

import BackgroundImages from "../components/BackgroundImages";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="relative overflow-hidden text-white">
        <div className="hidden lg:block">
          <Header noButton logoHref={"/"} />
        </div>
        <BackgroundImages />
        <div className="flex flex-col bg-[url('/images/bg.png')] bg-[length:170px_170px] bg-fixed bg-repeat lg:flex-row lg:bg-[length:220px_220px] lg:p-8 lg:py-20 lg:px-12 xl:px-20 2xl:px-36">
          <div className="flex h-[50vh] flex-1 flex-col items-center justify-center p-8 text-center md:h-[60vh] lg:h-auto lg:flex-1 lg:items-start lg:text-left">
            <h1 className="mt-6 mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl lg:tracking-tighter">
              Take your workouts to the next level with{" "}
              <span className="text-blue-dark">MUSCLER</span>
            </h1>
            <div className="mb-8 text-lg text-slate-400 sm:text-xl lg:text-2xl">
              Log your workouts, track your progress, improve your form 💪
            </div>

            <Link
              className="cursor-pointer rounded-md border-2 border-black bg-blue-dark px-8 py-6 text-lg font-bold text-white hover:bg-blue-darker-lighter sm:text-xl"
              href="/dashboard"
            >
              Open dashboard
            </Link>
          </div>
          <motion.div
            className="mb-8 mt-6 flex items-start justify-center lg:flex-1 lg:items-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div>
              <Image
                alt="app showcase"
                draggable={false}
                src={mainImage}
                quality={100}
                priority
                className="w-[240px] self-start sm:w-[300px] md:hidden"
              ></Image>
            </div>
            <div>
              <Image
                alt="app showcase big screen"
                draggable={false}
                src={mainImage2}
                quality={100}
                priority
                className="hidden w-[800px] self-start md:block"
              ></Image>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col items-center bg-background-darker-color/60 py-8 backdrop-blur-md">
          <div className="mb-4 p-4 font-semibold">
            <h3 className="mb-4 text-center text-2xl lg:text-3xl">
              With{" "}
              <span className="text-3xl font-extrabold text-blue-light lg:text-4xl">
                MUSCLER
              </span>{" "}
              you can:
            </h3>
            <ul className="list-disc pl-6 text-lg lg:text-xl">
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
          <motion.div
            className="flex items-start justify-center pt-4 pb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 100 },
            }}
          >
            <div>
              <Image
                alt="app showcase"
                draggable={false}
                src={mainImage2}
                quality={100}
                priority
                className="w-[700px] self-start px-4 md:hidden"
              ></Image>
            </div>
            <div className="hidden p-4 md:flex">
              <Image
                alt="app showcase"
                draggable={false}
                src={phoneImage}
                quality={100}
                priority
                className="w-1/3 self-start px-4 lg:w-[340px]"
              ></Image>
              <Image
                alt="app showcase"
                draggable={false}
                src={phoneImage2}
                quality={100}
                priority
                className="w-1/3 self-start px-4 lg:w-[340px]"
              ></Image>
              <Image
                alt="app showcase"
                draggable={false}
                src={phoneImage3}
                quality={100}
                priority
                className="w-1/3 self-start px-4 lg:w-[340px]"
              ></Image>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col items-center bg-background-darker-color/60  py-8 backdrop-blur-md">
          <div className="mb-4 p-6 font-semibold">
            <h3 className="text-center text-2xl lg:text-3xl">
              <span className="text-3xl font-extrabold text-blue-light lg:text-4xl">
                MUSCLER
              </span>{" "}
              works in browser
              <div className="text-lg lg:text-xl">(on mobile or desktop)</div>
            </h3>
          </div>
          <div className="overflow-hidden lg:flex">
            <motion.div
              className="flex items-start justify-center py-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: -300 },
              }}
            >
              <Image
                alt="app showcase"
                draggable={false}
                src={imageBrowser}
                quality={100}
                priority
                className="w-[700px] self-start px-4"
              ></Image>
            </motion.div>
            <motion.div
              className="flex items-start justify-center py-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: 300 },
              }}
            >
              <Image
                alt="app showcase"
                draggable={false}
                src={imageBrowser2}
                quality={100}
                priority
                className="w-[700px] self-start px-4"
              ></Image>
            </motion.div>
          </div>

          <Link
            className="my-8 cursor-pointer rounded-md border-2 border-black bg-blue-dark px-12 py-8 text-xl font-bold text-white hover:bg-blue-darker-lighter lg:text-2xl"
            href="/dashboard"
          >
            Get started
          </Link>
        </div>
        <div className="w-full bg-background-darker-color/90 py-4 text-center backdrop-blur-md">
          Made with ❤ by Daniel Skowron
        </div>
      </main>
    </div>
  );
}

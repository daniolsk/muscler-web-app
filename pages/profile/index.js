import Head from "next/head";
import Header from "../../components/Header";

import { verifyToken } from "../../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../../lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home({ user }) {
  const formatDate = (date) => {
    let dateObj = new Date(date);

    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString().slice(0, -3)
    );
  };

  const [date, setDate] = useState();
  useEffect(() => {
    setDate(formatDate(user.createdAt));
  }, [user.createdAt]);

  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white">
        <Header
          buttonText={"Back"}
          asLink
          href="/dashboard"
          buttonImageName="go-back"
        />
        <div>
          <div className="m-auto max-w-3xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <div className="mb-3">
                  <div className="text-sm text-neutral-400">Username:</div>
                  <div className="pl-4 text-xl font-semibold">
                    {user.username}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-sm text-neutral-400">Created at:</div>
                  <div className="pl-4 text-xl ">{date}</div>
                </div>
              </div>
              <Image
                alt="workout templates"
                src={`/icons/profile.svg`}
                width={70}
                height={70}
                priority
              ></Image>
            </div>
            <div className="flex flex-col p-4">
              <div className="mb-4">Settings:</div>
              <Link
                href="/profile/workout-templates"
                className="mb-3 flex cursor-pointer rounded-md bg-background-color p-3 hover:bg-white/5"
              >
                <Image
                  alt="workout templates"
                  src={`/icons/arrow-right.svg`}
                  width={15}
                  height={24}
                  priority
                ></Image>
                <div className="ml-2">Workout templates</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies["access-token"];

  if (token && verifyToken(token)) {
    const dataFromToken = decode(token);

    let data = await prisma.user.findUnique({
      where: {
        id: dataFromToken.id,
      },
    });

    data.createdAt = data.createdAt.toString();

    return {
      props: {
        user: data,
      },
    };
  }

  return {
    redirect: {
      destination: "/login",
    },
  };
}

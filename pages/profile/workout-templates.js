import Head from "next/head";
import Header from "../../components/Header";

import { verifyToken } from "../../lib/jwt";
import { decode } from "jsonwebtoken";
import prisma from "../../lib/prisma";
import Link from "next/link";

export default function Home({ user }) {
  const formatDate = (date) => {
    let dateObj = new Date(date);

    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString().slice(0, -3)
    );
  };

  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen bg-gradient-to-t from-background-darker-color to-background-color text-white">
        <Header
          buttonText={"Back"}
          asLink
          href="/profile"
          buttonImageName="go-back"
        />
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

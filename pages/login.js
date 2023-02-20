import Head from "next/head";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { verifyToken } from "../lib/jwt";

const loginF = async (username, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return response;
};

const registerF = async (username, password) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return response;
};

export default function Login() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username == "" || password == "") {
      setError("Username and password can not be empty");
      return;
    }

    if (isNewUser) {
      if (password.length < 5) {
        setError("Password too short");
        return;
      }

      let response = await registerF(username, password);

      let data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        return;
      }

      response = await loginF(username, password);
      data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        return;
      }
    } else {
      let response = await loginF(username, password);
      let data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        return;
      }
    }

    router.push("/dashboard");
  };

  return (
    <div>
      <Head>
        <title>Workout tracker app</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto p-10">
        <h1 className="mb-4 text-center text-4xl font-bold">Dashboard</h1>
        {isNewUser ? (
          <div>
            <p className="mb-12 text-center text-2xl">Create account</p>
            <div className="flex flex-col">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 rounded-md border-2 border-black p-2"
                type="text"
                name="username"
                id="username"
                placeholder="username"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="mb-4 rounded-md border-2 border-black p-2"
              />
              <input
                onClick={handleSubmit}
                className="cursor-pointer rounded-md border-2 border-black p-2 hover:bg-slate-200"
                type="button"
                value="Register"
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-12 text-center text-2xl">Please log in</p>
            <div className="flex flex-col">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 rounded-md border-2 border-black p-2"
                type="text"
                name="username"
                id="username"
                placeholder="username"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="mb-4 rounded-md border-2 border-black p-2"
              />
              <input
                onClick={handleSubmit}
                className="cursor-pointer rounded-md border-2 border-black p-2 hover:bg-slate-200"
                type="button"
                value="Login"
              />
            </div>
          </div>
        )}
        <div
          onClick={() => setIsNewUser(!isNewUser)}
          className="mt-3 cursor-pointer text-center text-blue-500 underline"
        >
          {isNewUser ? "Login instead" : "New user? Create account"}
        </div>
        <div className="mt-5 text-center text-xl font-bold text-red-600">
          {error ? error : ""}
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
        destination: "/dashboard",
      },
    };
  }

  return { props: {} };
}

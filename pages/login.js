import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyToken } from "../lib/jwt";

import { toast } from "react-hot-toast";

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

    let toastId;

    if (isNewUser) {
      if (password.length < 5) {
        setError("Password too short");
        return;
      }

      toastId = toast.loading("Creating new user...");

      let response = await registerF(username, password);

      let data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        setPassword("");
        return;
      }

      response = await loginF(username, password);
      data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        toast.error("Something went wrong!", {
          id: toastId,
        });
        setPassword("");
        return;
      }
    } else {
      toastId = toast.loading("Logging in...");

      let response = await loginF(username, password);
      let data = await response.json();

      if (response.status != 200) {
        setError(data.msg);
        toast.error("Something went wrong!", {
          id: toastId,
        });
        setPassword("");
        return;
      }
    }

    toast.success("Logged in!", {
      id: toastId,
    });
    router.push("/dashboard");
  };

  return (
    <div>
      <Head>
        <title>Muscler</title>
        <meta name="description" content="Workout tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" text-white">
        <div className="flex items-center justify-between bg-background-darker-color p-3">
          <div>
            MUSCLER{" "}
            <span className="text-sm font-thin italic text-neutral-400">
              by Daniel Skowron
            </span>
          </div>
        </div>
        <div className="mt-4 p-4">
          {isNewUser ? (
            <div>
              <h1 className="mb-4 text-center text-4xl font-bold">Register</h1>
              <p className="mb-12 text-center text-2xl">Create new account</p>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mb-4 rounded-md border-2 border-black p-3 text-black"
                  type="text"
                  placeholder="Username"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="mb-4 rounded-md border-2 border-black p-3 text-black"
                />
                <input
                  onClick={handleSubmit}
                  className="cursor-pointer rounded-md border-2 border-black bg-blue-dark p-3 hover:bg-background-darker-color"
                  type="submit"
                  value="Register"
                />
              </form>
            </div>
          ) : (
            <div>
              <div className="m-auto max-w-md">
                <h1 className="mb-4 text-center text-4xl font-bold">Log in</h1>
                <p className="mb-12 text-center text-2xl">
                  Log in to your account
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 rounded-md border-2 border-black p-3 text-black"
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="mb-4 rounded-md border-2 border-black p-3 text-black"
                  />
                  <input
                    onClick={handleSubmit}
                    className="cursor-pointer rounded-md border-2 border-black bg-blue-dark p-3 hover:bg-background-darker-color"
                    type="submit"
                    value="Login"
                  />
                </form>
              </div>
            </div>
          )}
          <div
            onClick={() => setIsNewUser(!isNewUser)}
            className="mt-3 cursor-pointer text-center text-blue-500 underline"
          >
            {isNewUser ? "Login instead" : "New user? Create account"}
          </div>
        </div>
        <div className="text-md text-center font-bold text-red-600">
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

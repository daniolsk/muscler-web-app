import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Muscle_group } from "@prisma/client";

import { toast } from "react-hot-toast";

function NewWorkout({ user }) {
  const [addingWorkout, setAddingWorkout] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    CHEST: false,
    BACK: false,
    BICEP: false,
    TRICEP: false,
    SHOULDERS: false,
    LEGS: false,
    CALVES: false,
    ABS: false,
  });

  const router = useRouter();

  const addWorkout = () => {
    setAddingWorkout(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name == "") {
      setError("Name can not be empty");
      return;
    }

    let categories = [];
    Object.keys(Muscle_group).map((muscle, i) => {
      if (checkboxes[muscle]) {
        categories.push({ name: checkboxes[muscle] });
      }
    });
    if (categories.length == 0) {
      setError("Select at least one category");
      return;
    }

    setAddingWorkout(false);
    const toastId = toast.loading("Adding workout...");

    const response = await fetch("/api/addWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        userId: user.id,
        tags: categories,
      }),
    });

    const data = await response.json();

    if (response.status != 200) {
      setError(data.msg);
      toast.error("Something went wrong!", {
        id: toastId,
      });
      return;
    }

    setError("");
    setName("");

    toast.success("Workout added!", {
      id: toastId,
    });
    router.replace(router.asPath);
  };
  return (
    <>
      {addingWorkout ? (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background-darker-color/90 p-4">
          <h1 className="mb-4 text-2xl font-bold">Add Workout</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="mb-4 rounded-md border-2 border-black p-3 text-black"
            />
            <h3 className="text-md mb-4 text-center font-medium text-white">
              Choose categories:
            </h3>
            <ul className="mb-4 flex flex-wrap justify-center gap-2">
              {Object.keys(Muscle_group).map((muscle, i) => (
                <li key={i}>
                  <input
                    type="checkbox"
                    id={muscle}
                    checked={checkboxes[muscle]}
                    onChange={(e) => {
                      let tmpBoxes = checkboxes;
                      checkboxes[muscle] = e.target.checked;
                      setCheckboxes({ ...tmpBoxes });
                    }}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={muscle}
                    className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-700 bg-gray-800 p-3 text-gray-400  hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                  >
                    <div className="block">
                      <div className="text-sm font-semibold">{muscle}</div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
            <input
              className="cursor-pointer rounded-md border-2 border-black bg-blue-dark p-3 hover:bg-background-darker-color"
              type="submit"
              value="Add"
            />
          </form>
          <div
            className=" cursor-pointer p-4 text-sm underline"
            onClick={() => {
              setError("");
              setName("");
              setAddingWorkout(false);
            }}
          >
            Cancel
          </div>
          <div className="text-md text-center font-bold text-red-600">
            {error ? error : ""}
          </div>
        </div>
      ) : (
        ""
      )}
      <button
        onClick={addWorkout}
        className="mb-2 flex w-full items-center justify-center rounded-md bg-background-darker-color py-0.5"
      >
        <Image
          alt="plus icon"
          src={"/icons/plus.svg"}
          width={30}
          height={30}
        ></Image>
      </button>
    </>
  );
}

export default NewWorkout;

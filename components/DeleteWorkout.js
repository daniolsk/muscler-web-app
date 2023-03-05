import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

import { toast } from "react-hot-toast";

function DeleteWorkout({ workout, deleteWorkoutHandle }) {
  const [deletingWorkout, setDeletingWorkout] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const deleteWorkout = () => {
    setDeletingWorkout(true);
  };

  const handleSubmit = async (e) => {
    setDeletingWorkout(false);

    const toastId = toast.loading("Removing workout...");

    deleteWorkoutHandle(workout.id);

    e.preventDefault();
    const response = await fetch("/api/deleteWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workoutId: workout.id,
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

    toast.success("Workout removed!", {
      id: toastId,
    });
    setError("");
  };

  return (
    <>
      {deletingWorkout ? (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen cursor-auto flex-col items-center justify-center bg-background-darker-color/90">
          <h1 className="mb-4 text-2xl font-bold">
            Delete workout <span className="italic">{workout.name}</span>?
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              className="cursor-pointer rounded-md border-2 border-black bg-blue-dark p-3 hover:bg-blue-darker-lighter"
              type="submit"
              value="Delete"
            />
          </form>
          <button
            className=" cursor-pointer p-4 text-sm underline"
            onClick={() => {
              setError("");
              setDeletingWorkout(false);
            }}
          >
            Cancel
          </button>
          <div className="text-md text-center font-bold text-red-600">
            {error ? error : ""}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="cursor-pointer p-3 " onClick={deleteWorkout}>
        <Image
          src="/icons/trash.svg"
          width={20}
          height={20}
          alt="trash can icon"
          priority
        ></Image>
      </div>
    </>
  );
}

export default DeleteWorkout;

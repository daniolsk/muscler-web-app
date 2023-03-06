import Image from "next/image";
import { useState } from "react";
import FullScreenConfirm from "../components/FullScreenConfirm";

import { toast } from "react-hot-toast";

function DeleteWorkout({ workout, deleteWorkoutHandle }) {
  const [deletingWorkout, setDeletingWorkout] = useState(false);
  const [error, setError] = useState("");

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
        <FullScreenConfirm
          button="Delete"
          onCancel={() => {
            setError("");
            setDeletingWorkout(false);
          }}
          error={error}
          onConfirm={() => handleSubmit()}
          prompt={() => (
            <div>
              Delete template <span className="italic">{workout.name}</span>?
            </div>
          )}
        />
      ) : (
        ""
      )}
      <div
        className="m-1.5 cursor-pointer rounded-sm p-1.5 hover:bg-white/20"
        onClick={deleteWorkout}
      >
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

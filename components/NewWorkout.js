import Image from "next/image";
import { Fragment, useState } from "react";
import { Muscle_group } from "@prisma/client";
import Loading from "../components/Loading";

import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const initialState = {
  CHEST: false,
  BACK: false,
  BICEPS: false,
  TRICEPS: false,
  SHOULDERS: false,
  LEGS: false,
  CALVES: false,
  ABS: false,
};

function NewWorkout({ user, handleNewWorkout }) {
  const [addingWorkout, setAddingWorkout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectingTemplate, setSelectingTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [checkboxes, setCheckboxes] = useState({ ...initialState });
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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

    if (!selectedTemplate) {
      Object.keys(Muscle_group).map((muscle, i) => {
        if (checkboxes[muscle]) {
          categories.push({ name: muscle });
        }
      });
      if (categories.length == 0) {
        setError("Select at least one category");
        return;
      }
    }

    setAddingWorkout(false);
    const toastId = toast.loading("Adding workout...");

    let bodyTmp;

    if (!selectedTemplate) {
      bodyTmp = {
        name: name,
        userId: user.id,
        isFromTemplate: false,
        tags: categories,
      };
    } else {
      bodyTmp = {
        name: name,
        userId: user.id,
        isFromTemplate: true,
        templateId: selectedTemplate,
      };
    }

    const response = await fetch("/api/addWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyTmp),
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
    setCheckboxes({ ...initialState });

    toast.success("Workout added!", {
      id: toastId,
    });

    handleNewWorkout(data.newWorkoutRes);
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    const response = await fetch("/api/getTemplates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });

    const data = await response.json();

    if (response.status != 200) {
      setError(data.msg);
      return;
    }

    setTemplates(data.workouts);
    setIsLoading(false);
  };

  return (
    <>
      {addingWorkout ? (
        <div className="fixed top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background-darker-color/90 p-4">
          <h1 className="mb-4 text-2xl font-bold">Add Workout</h1>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-lg flex-col"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="mb-4 rounded-md border-2 border-black p-3 text-black"
            />
            {selectingTemplate ? (
              <div className="mb-4 flex min-h-[150px] overflow-x-auto py-2">
                {isLoading ? (
                  <Loading />
                ) : (
                  templates.map((template, i) => (
                    <motion.div
                      initial={{
                        x: 50,
                        opacity: 0,
                      }}
                      animate={{
                        x: 0,
                        opacity: 100,
                        transition: {
                          delay: i * 0.1,
                        },
                      }}
                      onClick={() => setSelectedTemplate(template.id)}
                      key={template.id}
                      className={`mr-2 flex cursor-pointer flex-col rounded-lg border-2 border-gray-700 bg-gray-800 text-gray-300  hover:border-gray-600 ${
                        selectedTemplate == template.id
                          ? `!border-blue-dark !text-white`
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between rounded-t-md bg-gray-900 p-3">
                        <div className="mr-5 flex flex-col">
                          <div className="whitespace-nowrap text-lg font-bold">
                            {template.name}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-nowrap items-start justify-end">
                          {template.tags.map((tag) => (
                            <div
                              key={tag.id}
                              className="ml-1 rounded-full bg-red-800 p-1.5 text-xs font-semibold"
                            >
                              {tag.name}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-1 p-3">
                        <div className="grid flex-1 grid-cols-[2fr,_1fr] items-center justify-items-center gap-2">
                          {template.exercises.map((exercise) => (
                            <Fragment key={exercise.id}>
                              <div className="text-sm">{exercise.name}</div>
                              <div className="w-full text-center text-sm text-white">
                                {exercise._count.logs}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <>
                <h3 className="text-md mb-4 text-center font-medium text-white">
                  Choose categories:
                </h3>
                <ul className="mb-4 flex flex-wrap items-center justify-center gap-2 py-2">
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
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-700 bg-gray-800 p-3 text-gray-400  hover:text-gray-300 peer-checked:border-blue-dark peer-checked:text-gray-300"
                      >
                        <div className="block">
                          <div className="text-sm font-semibold">{muscle}</div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {selectingTemplate ? (
              <button
                type="button"
                onClick={() => {
                  setSelectingTemplate(false);
                  setSelectedTemplate(null);
                }}
                className="mb-2 flex items-center justify-center rounded-md border-2 border-gray-700 bg-gray-800 p-2 text-white hover:bg-gray-700"
              >
                <div className="mr-1">Back</div>
                <Image
                  src={"/icons/go-back.svg"}
                  alt="arrow right"
                  width={15}
                  height={15}
                ></Image>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectingTemplate(true);
                  fetchTemplates();
                }}
                className="mb-2 flex items-center justify-center rounded-md border-2 border-gray-700 bg-gray-800 p-2 text-white hover:bg-gray-700"
              >
                <div className="mr-1">Or select from templates</div>
                <Image
                  src={"/icons/arrow-right.svg"}
                  alt="arrow right"
                  width={15}
                  height={15}
                ></Image>
              </button>
            )}
            <input
              className="cursor-pointer rounded-md border-2 border-black bg-blue-dark p-3 hover:bg-blue-darker-lighter"
              type="submit"
              value="Add"
            />
          </form>
          <div
            className=" cursor-pointer p-4 text-sm underline"
            onClick={() => {
              setError("");
              setName("");
              setCheckboxes({ ...initialState });
              setSelectingTemplate(false);
              setTemplates([]);
              setAddingWorkout(false);
              setSelectedTemplate(null);
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
        className="mb-2 flex w-full items-center justify-center rounded-md border-2 border-black bg-background-darker-color py-0.5 hover:bg-background-darker-color-lighter"
      >
        <Image
          alt="plus icon"
          src={"/icons/plus.svg"}
          width={30}
          height={30}
          priority
        ></Image>
      </button>
    </>
  );
}

export default NewWorkout;

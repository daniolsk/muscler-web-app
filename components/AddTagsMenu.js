import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const tagsInit = [
  "CHEST",
  "BACK",
  "BICEPS",
  "TRICEPS",
  "SHOULDERS",
  "LEGS",
  "CALVES",
  "ABS",
];

function AddTagsMenu({ tags, addTag }) {
  const menuRef = useRef(null);
  const [tagsState, setTagsState] = useState([]);

  useEffect(() => {
    setTagsState(
      tagsInit.filter((tag) => !tags.find((tagProps) => tagProps.name == tag))
    );
  }, [tags]);

  return (
    <>
      {tagsState.length == 0 ? (
        ""
      ) : (
        <div
          className="my-2 flex gap-2 overflow-auto bg-background-darker-color/90 p-2"
          ref={menuRef}
        >
          {tagsState.map((tag, i) => (
            <div
              className="cursor-pointer whitespace-nowrap rounded-md p-2 text-xs last:mb-0 hover:bg-background-darker-color-lighter"
              onClick={() => {
                addTag(tag, tagsInit.findIndex((tagTmp) => tagTmp == tag) + 1);
              }}
              key={i}
            >
              {tag} +
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AddTagsMenu;

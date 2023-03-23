import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

function FullScreenConfirm({ prompt, button, onConfirm, onCancel, error }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector("#portal");
    setMounted(true);
  }, []);

  return mounted && ref.current
    ? createPortal(
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen cursor-auto flex-col items-center justify-center bg-background-darker-color/90 p-4 text-center">
          <h1 className="mb-4 text-2xl font-bold">{prompt()}</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="flex flex-col"
          >
            <input
              className="cursor-pointer rounded-md border-2 border-black bg-blue-dark p-3 text-white hover:bg-blue-darker-lighter"
              type="submit"
              value={button}
            />
          </form>
          <button
            className=" cursor-pointer p-4 text-sm underline"
            onClick={onCancel}
          >
            Cancel
          </button>
          <div className="text-md text-center font-bold text-red-600">
            {error ? error : ""}
          </div>
        </div>,
        ref.current
      )
    : null;
}

export default FullScreenConfirm;

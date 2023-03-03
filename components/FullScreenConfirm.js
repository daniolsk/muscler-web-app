import React from "react";

function FullScreenConfirm({ prompt, button, onConfirm, onCancel }) {
  return (
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
          className="cursor-pointer rounded-md border-2 border-black bg-blue-dark p-3 hover:bg-blue-darker-lighter"
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
    </div>
  );
}

export default FullScreenConfirm;

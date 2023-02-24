import "../styles/globals.css";

import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "1rem",
            background: "#040914",
            color: "#fff",
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

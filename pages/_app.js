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
            background: "rgba(4, 9, 20, 0.8)",
            color: "#fff",
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

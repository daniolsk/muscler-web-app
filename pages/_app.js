import "../styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
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
      <div id="portal"></div>
      <Component {...pageProps} />
    </div>
  );
}

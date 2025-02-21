import { ThemeProvider } from "@/provider/theme.provider";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" reverseOrder={false} />
    </ThemeProvider>
  );
}

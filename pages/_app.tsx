import type { AppProps } from "next/app";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-800 via-indigo-900 to-indigo-700 text-slate-300 min-h-screen justify-center flex ">
      <div className="w-4/5 text-sm">
        <Toaster />
        <Header />
        <Component {...pageProps} />
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <header className="p-4 pt-6 w-full mb-8">
      <Link href="/" className="text-xl hover:text-slate-400">
        Nano CI CD
      </Link>
    </header>
  );
};

import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { AuthStore } from "./login";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [ok, setOk] = useState(false);
  const isLoggedIn = AuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      setOk(true);
    } else {
      router.push("/login");
    }
  }, [isLoggedIn, router.asPath]);

  if (!ok && router.pathname !== "/login") {
    return (
      <div className="text-slate-300 h-screen w-screen flex justify-center items-center">
        <div>Redirecting...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gradient-to-br from-indigo-800 via-indigo-900 to-indigo-700 text-slate-300 min-h-screen justify-center flex ">
        <div className="w-4/5 text-sm">
          <Toaster
            toastOptions={{
              className: "!bg-indigo-600 !text-slate-300",
            }}
          />
          <Header />
          <Component {...pageProps} />
        </div>
      </div>
    </QueryClientProvider>
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

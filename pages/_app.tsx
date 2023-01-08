import type { AppProps } from "next/app";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { showEnv } from "../api/nanoContext";
import AppButton from "../components/button";
import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
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
          <AppButton
            onClick={() => {
              showEnv();
            }}
          >
            show env
          </AppButton>
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

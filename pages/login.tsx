import router from "next/router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { login } from "../api/nanoContext";
import AppButton from "../components/button";

type AuthStoreType = {
  isLoggedIn: boolean;
  token: string;
  serverUrl: string;
};

export const AuthStore = create<AuthStoreType>()(
  persist(
    immer((get, set, store) => {
      return {
        token: "",
        isLoggedIn: false,
        serverUrl:
          process.env.NEXT_PUBLIC_NANO_SERVER_URL ?? "http://localhost:8080",
      };
    }),
    {
      name: "nano-auth",
    }
  )
);

type FormStoreType = {
  username: string;
  password: string;
};

const formStore = create<FormStoreType>()(
  immer((set) => {
    return {
      username: "",
      password: "",
      serverUrl: "",
    };
  })
);

const LoginPage = () => {
  const serverUrlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (serverUrlInputRef.current) {
      serverUrlInputRef.current.value = AuthStore.getState().serverUrl;
    }
    if (AuthStore.getState().isLoggedIn) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-3 items-center justify-center">
      <form className="flex flex-col flex-1 gap-3 items-center justify-center">
        <div className="flex gap-2 items-center">
          <label>Username: </label>
          <input
            type="text"
            className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
            placeholder="Username"
            onChange={(e) => {
              formStore.setState((state: any) => {
                state.username = e.currentTarget.value ?? "";
              });
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <label>Password: </label>
          <input
            type="password"
            className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
            placeholder="Password"
            onChange={(e) => {
              formStore.setState((state: any) => {
                state.password = e.currentTarget.value ?? "";
              });
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <label>Server url: </label>
          <input
            ref={serverUrlInputRef}
            type="text"
            className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
            placeholder="Server url"
            onChange={(e) => {
              formStore.setState((state: any) => {
                state.serverUrl = e.currentTarget.value ?? "";
              });
            }}
          />
        </div>
        <AppButton
          onClick={async (e) => {
            e.preventDefault();
            try {
              AuthStore.setState((state) => {
                state.serverUrl = AuthStore.getState().serverUrl;
              });
              const response = await login(
                formStore.getState().username,
                formStore.getState().password
              );
              AuthStore.setState((state) => {
                state.token = response;
                state.isLoggedIn = true;
              });
              router.push("/");
              toast("Logged in successfully");
            } catch (e) {
              toast.error("Login failed");
            }
          }}
        >
          Login
        </AppButton>
      </form>
    </div>
  );
};

export default LoginPage;

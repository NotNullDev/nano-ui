import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { globalStore } from ".";
import { resetToken, showEnv, updateUser } from "../api/nanoContext";
import AppButton from "../components/button";
import { AuthStore } from "./login";

type resetPasswordStoreType = {
  username: string;
  password: string;
  repeatedPassword: string;
  backendUrl: string;
  newToken: string;
};

const resetPasswordStore = create<resetPasswordStoreType>()(
  immer((set) => {
    return {
      username: "",
      password: "",
      repeatedPassword: "",
      backendUrl: AuthStore.getState().serverUrl,
      newToken: "",
    };
  })
);

const NanoManagementPage = () => {
  const backendUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (backendUrlRef.current) {
      backendUrlRef.current.value = AuthStore.getState().serverUrl;
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 p-4">
        <AppButton
          onClick={() => {
            showEnv();
          }}
        >
          show env
        </AppButton>
        <AppButton
          className="h-min"
          onClick={async () => {
            await navigator.clipboard.writeText(
              globalStore.getState().nanoConfig.token
            );
            toast.success("token copied to clipboard");
          }}
        >
          Copy token
        </AppButton>
        <AppButton
          className="whitespace-nowrap h-min"
          onClick={async () => {
            const token = await resetToken();
            if (token) {
              globalStore.setState((state) => {
                state.nanoConfig.token = token;
              });
              toast("success", { icon: "🎉" });
            }
          }}
        >
          Reset token
        </AppButton>
      </div>
      <div className="flex gap-2 items-center">
        <label>New token: </label>
        <input
          //   ref={appNameRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Token"
          onChange={(e) => {
            resetPasswordStore.setState((state: any) => {
              state.newToken = e.currentTarget.value ?? "";
            });
          }}
        />
        <AppButton
          onClick={() => {
            toast.error("not implemented yet");
          }}
        >
          Update
        </AppButton>
      </div>
      <div className="flex gap-2 items-center">
        <label>Backend url: </label>
        <input
          ref={backendUrlRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Url"
          onChange={(e) => {
            resetPasswordStore.setState((state: any) => {
              state.backendUrl = e.currentTarget.value ?? "";
            });
          }}
        />
        <AppButton
          onClick={() => {
            AuthStore.setState((state: any) => {
              state.serverUrl = resetPasswordStore.getState().backendUrl;
            });
            toast.success("Url updated!");
          }}
        >
          Update
        </AppButton>
      </div>

      <form className="p-4 bg-indigo-800 rounded-xl w-min flex flex-col gap-3 whitespace-nowrap">
        <div className="flex gap-2 items-center">
          <label>Username: </label>
          <input
            type="text"
            name="username"
            className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
            placeholder="Username"
            onChange={(e) => {
              resetPasswordStore.setState((state: any) => {
                state.username = e.currentTarget.value ?? "";
              });
            }}
          />
        </div>

        <div className="flex gap-2 items-center">
          <label>Password: </label>
          <input
            type="password"
            name="password"
            className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
            placeholder="Password"
            onChange={(e) => {
              resetPasswordStore.setState((state: any) => {
                state.password = e.currentTarget.value ?? "";
              });
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <label>Repeat password: </label>
          <input
            type="password"
            name="password"
            className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
            placeholder="Repeat password"
            onChange={(e) => {
              resetPasswordStore.setState((state: any) => {
                state.repeatedPassword = e.currentTarget.value ?? "";
              });
            }}
          />
        </div>
        <AppButton
          onClick={async (e) => {
            e.preventDefault();
            if (
              resetPasswordStore.getState().password !==
              resetPasswordStore.getState().repeatedPassword
            ) {
              toast.error("Passwords do not match");
              return;
            }
            const resp = await updateUser(
              resetPasswordStore.getState().username,
              resetPasswordStore.getState().password
            );
            toast.success("user data updated");
          }}
        >
          Update
        </AppButton>
      </form>
    </div>
  );
};

export default NanoManagementPage;

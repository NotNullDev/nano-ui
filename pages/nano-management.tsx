import toast from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { showEnv, updateUser } from "../api/nanoContext";
import AppButton from "../components/button";

type resetPasswordStoreType = {
  username: string;
  password: string;
  repeatedPassword: string;
};

const resetPasswordStore = create<resetPasswordStoreType>()(
  immer((set) => {
    return {
      username: "",
      password: "",
      repeatedPassword: "",
    };
  })
);

const NanoManagementPage = () => {
  return (
    <div className="flex flex-col gap-3">
      <AppButton
        onClick={() => {
          showEnv();
        }}
      >
        show env
      </AppButton>
      <div className="flex gap-2 items-center">
        <label>New token: </label>
        <input
          //   ref={appNameRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Token"
          onChange={(e) => {}}
        />
        <AppButton>Update</AppButton>
      </div>
      <div className="flex gap-2 items-center">
        <label>Backend url: </label>
        <input
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Url"
          onChange={(e) => {}}
        />
        <AppButton>Update</AppButton>
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

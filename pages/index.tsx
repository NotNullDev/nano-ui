import { Inter } from "@next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { UseNanoContext } from "../api/hooks";
import {
  createApp,
  fetchNanoContext,
  logout,
  updateGlobalEnv,
} from "../api/nanoContext";
import AppButton from "../components/button";
import { Modal, modalStore } from "../components/modal";
import { App, NanoContext } from "../types/aa";
import { appInfoStore } from "./app";

const inter = Inter({ subsets: ["latin"] });

type GlobalStoreType = NanoContext;

export const globalStore = create<GlobalStoreType>()(
  immer((set, get, store) => {
    return {
      apps: [],
      nanoConfig: {
        globalEnvironment: "",
        token: "",
      },
      buildingAppId: 0, // 0 means no app is building
    };
  })
);

export default function Home() {
  const { status } = UseNanoContext();

  return (
    <div>
      <div className="w-full h-[70px] mb-4 shadow shadow-indigo-600 flex gap-2 items-center px-10 justify-between">
        <div className="flex gap-2">
          <AppButton className="min-w-[140px] ">
            <Link href="/nano-management">Management page</Link>
          </AppButton>
          <AppButton
            className="w-16 ml-2"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </AppButton>
        </div>
        <div>
          <Modal onClick={onGlobalEnvClick}>
            <AppButton className="whitespace-nowrap min-w-[150px]">
              Global environment
            </AppButton>
          </Modal>
        </div>
        <CreateAppComponent />
      </div>
      <div className="mb-3">
        <input
          placeholder="search apps"
          className="bg-indigo-700 px-3 py-1 rounded-xl"
        />
      </div>
      <div className="grid grid-cols-4 gap-12">
        <Apps />
      </div>
    </div>
  );
}

const CreateAppComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex gap-1">
      <input
        ref={inputRef}
        placeholder="app name"
        className="bg-indigo-700 px-3 py-1 rounded-xl"
      />
      <AppButton
        className="whitespace-nowrap min-w-[120px] bg-green-800 hover:bg-green-900"
        onClick={async () => {
          if (inputRef.current) {
            const app = await createApp(inputRef.current.value);
            globalStore.setState((state) => {
              state.apps.push(app);
            });
            toast("success", { icon: "🎉" });
            inputRef.current.value = "";
          }
        }}
      >
        Add application
      </AppButton>
    </div>
  );
};

type AppPreviewProps = {
  app: App;
};

const AppPreview = ({ app }: AppPreviewProps) => {
  const router = useRouter();
  const buildingAPpId = globalStore((state) => state.buildingAppId);

  return (
    <div className="w-[300px] h-[220px] shadow  bg-gradient-to-tr from-bg-indigo-800 via-bg-indigo-900 to-bg-indigo-800 flex flex-col p-6 rounded">
      <div className="flex flex-1 flex-col gap-1">
        <div className="text-center mb-4">{app.appName}</div>
        {app.appStatus === "enabled" && (
          <div className="text-lime-500">enabled</div>
        )}
        {!(app.appStatus === "enabled") && (
          <div className="text-orange-500">disabled</div>
        )}
        {buildingAPpId === app.ID && (
          <div className="text-green-500 animate-pulse">building...</div>
        )}
        {!(buildingAPpId === app.ID) && (
          <div className="text-orange-500">not building</div>
        )}
      </div>
      <div className="justify-end flex">
        <button
          className="p-1 shadow-sm active:shadow-inner shadow-black w-[80px] rounded hover:bg-transparent/10 transition-all"
          onClick={() => {
            appInfoStore.setState((state) => {
              return globalStore.getState().apps.find((a) => a.ID === app.ID);
            });
            router.push("/app?appId=" + app.ID);
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
};

const Apps = () => {
  const apps = globalStore((state) => state.apps);
  return (
    <>
      {apps.map((app, idx) => {
        return (
          <div key={app.ID} className={``}>
            <AppPreview app={app} />
          </div>
        );
      })}
    </>
  );
};

function onGlobalEnvClick() {
  modalStore.setState((state) => {
    state.modalVal = globalStore.getState().nanoConfig.globalEnvironment;

    state.modalOnChange = (newVal) => {
      globalStore.setState((state) => {
        state.nanoConfig.globalEnvironment = newVal;
      });
    };
    state.modalOnClose = async () => {
      const updated = await updateGlobalEnv(
        globalStore.getState().nanoConfig.globalEnvironment
      );

      globalStore.setState((state) => {
        state.nanoConfig.globalEnvironment = updated;
      });
      toast("Global env updated", { icon: "🎉" });
    };
  });
}

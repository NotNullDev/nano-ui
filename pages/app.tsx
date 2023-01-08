import router, { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { globalStore } from ".";
import { deleteApp, updateApp } from "../api/nanoContext";
import AppButton from "../components/button";
import { Modal, modalStore } from "../components/modal";
import { App } from "../types/aa";

export type AppInfo = {
  appId: number;
  appName: string;
  appStatus: string;
  envVal: string;
  envMountPath: string;
  buildVal: string;
  buildValMountPath: string;
  repoUrl: string;
};

type AppInfoStoreType = {
  resetStore: () => void;
} & App;

const appInfoStore = create<AppInfoStoreType>()(
  immer((set, get, store) => {
    const resetStore = () => {
      set((state) => {
        state = {
          ...state,
          appName: "",
          appStatus: "",
          envVal: "",
          envMountPath: "",
          buildVal: "",
          buildValMountPath: "hahh",
          repoUrl: "",
          CreatedAt: "",
          DeletedAt: "",
          ID: 0,
          UpdatedAt: "",
        };
      });
    };

    return {
      appName: "",
      appStatus: "",
      envVal: "",
      envMountPath: "",
      buildVal: "",
      buildValMountPath: "",
      repoUrl: "",
      CreatedAt: "",
      DeletedAt: "",
      ID: 0,
      UpdatedAt: "",
      resetStore,
    };
  })
);

export const AppInfoPage = () => {
  const router = useRouter();

  const appInfo = appInfoStore((state) => state);
  const envVal = appInfoStore((state) => state.envVal);
  const repoUrlRef = useRef<HTMLInputElement>(null);
  const buildPathRef = useRef<HTMLInputElement>(null);
  const envPathRef = useRef<HTMLInputElement>(null);
  const appNameRef = useRef<HTMLInputElement>(null);

  const { appId } = router.query;

  useEffect(() => {
    router.beforePopState(() => {
      toast("bye!");
      return true;
    });
    if (repoUrlRef.current) {
      repoUrlRef.current.value = appInfo.repoUrl;
    }
    if (buildPathRef.current) {
      buildPathRef.current.value = appInfo.buildValMountPath;
    }
    if (envPathRef.current) {
      envPathRef.current.value = appInfo.envMountPath;
    }
    if (appNameRef.current) {
      appNameRef.current.value = appInfo.appName;
    }
  }, []);

  useEffect(() => {
    if (appId) {
      appInfoStore.setState((state) => {
        const foundApp = globalStore
          .getState()
          .apps.find((app) => app.ID === Number(appId));
        if (foundApp) {
          return foundApp;
        }
      });
    }
  }, [appId]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <AppButton
            className="bg-green-800 hover:bg-green-900"
            onClick={onSaveAppClick}
          >
            Save
          </AppButton>
          <AppButton
            className="bg-orange-800 hover:bg-orange-700"
            onClick={() => {
              router.push("/");
            }}
          >
            Cancel
          </AppButton>
        </div>
        <div>
          <AppButton
            className="bg-orange-800 hover:bg-orange-700"
            onClick={onDeleteClick}
          >
            delete
          </AppButton>
        </div>
      </div>
      <div>App ID: {appInfo.ID}</div>
      <div className="flex gap-2 items-center">
        <label>App name: </label>
        <input
          ref={appNameRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="App name"
          onChange={(e) => {
            appInfoStore.setState((state) => {
              state.appName = e.currentTarget.value ?? "";
            });
          }}
        />
      </div>
      <div>App status: {appInfo.appStatus}</div>
      <div className="flex gap-2 items-center">
        <label>Repo url: </label>
        <input
          ref={repoUrlRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Repo url"
          onChange={(e) => {
            appInfoStore.setState((state) => {
              state.repoUrl = e.currentTarget.value ?? "";
            });
          }}
        />
      </div>
      <div className="flex gap-2">
        <div>environment variables: 3</div>
        <Modal
          onClick={() => {
            modalStore.setState((state) => {
              state.modalVal = appInfoStore.getState().envVal;

              state.modalOnChange = (newVal) => {
                appInfoStore.setState((state) => {
                  state.envVal = newVal;
                });
              };

              state.modalOnClose = () => {
                toast("saved!");
              };
            });
          }}
        >
          <div className="w-[50px] shadow py-[1px] rounded bg-fuchsia-800 hover:bg-fuchsia-700 active:bg-fuchsia-700 active:scale-95">
            Edit
          </div>
        </Modal>
        <input
          ref={envPathRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Mount path"
          onChange={(e) => {
            appInfoStore.setState((state) => {
              state.envMountPath = e.currentTarget.value ?? "";
            });
          }}
        />
      </div>
      <div className="flex gap-2">
        <div>build variables: 3</div>
        <Modal
          onClick={() => {
            modalStore.setState((state) => {
              state.modalVal = appInfoStore.getState().buildVal;
            });

            modalStore.setState((state) => {
              state.modalOnChange = (newVal) => {
                appInfoStore.setState((state) => {
                  state.buildVal = newVal;
                });
              };
            });
          }}
        >
          <div className="w-[50px] shadow py-[1px] rounded bg-fuchsia-800 hover:bg-fuchsia-700 active:bg-fuchsia-700 active:scale-95">
            Edit
          </div>
        </Modal>
        <input
          ref={buildPathRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Mount path"
          onChange={(e) => {
            appInfoStore.setState((state) => {
              state.buildValMountPath = e.currentTarget.value ?? "";
            });
          }}
        />
      </div>
      <div className=""></div>
    </div>
  );
};

async function onSaveAppClick() {
  const updatedApp = await updateApp(appInfoStore.getState());
  globalStore.setState((state) => {
    const idx = state.apps.findIndex((app) => app.ID === updatedApp.ID);
    state.apps[idx] = updatedApp;
  });
  toast("success!", { icon: "👍" });
}

async function onDeleteClick() {
  const deletedId = await deleteApp(appInfoStore.getState().ID);
  globalStore.setState((state) => {
    state.apps = state.apps.filter((app) => app.ID !== deletedId);
  });
  toast("Successfully deleted app with ID  " + deletedId, { icon: "👍" });
  router.push("/");
}

export default AppInfoPage;

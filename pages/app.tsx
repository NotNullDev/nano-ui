import router, { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { globalStore } from ".";
import { deleteApp, fetchLogs, runBuild, updateApp } from "../api/nanoContext";
import AppButton from "../components/button";
import { Modal, modalStore } from "../components/modal";
import { App } from "../types/aa";
import { queryClient } from "./_app";

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

export type AppLogsType = {
  logs: string;
  appId: number;
  ID: number;
  startedAt: string;
  finishedAt: string;
  buildStatus: string;
};

type AppInfoStoreType = {
  resetStore: () => void;
  appLogs: AppLogsType;
} & App;

export const appInfoStore = create<AppInfoStoreType>()(
  immer((set, get, store) => {
    const resetStore = () => {
      set((state) => {
        state = {
          ...state,
          appName: "",
          appStatus: "enabled",
          envVal: "",
          envMountPath: "",
          buildVal: "",
          buildValMountPath: "",
          repoUrl: "",
          CreatedAt: "",
          DeletedAt: "",
          repoBranch: "",
          ID: 0,
          UpdatedAt: "",
          appLogs: {
            appId: 0,
            finishedAt: "",
            ID: 0,
            logs: "",
            startedAt: "",
            buildStatus: "",
          },
        };
        return state;
      });
    };

    return {
      appName: "",
      appStatus: "enabled",
      envVal: "",
      envMountPath: "",
      buildVal: "",
      buildValMountPath: "",
      repoUrl: "",
      CreatedAt: "",
      DeletedAt: "",
      repoBranch: "",
      ID: 0,
      UpdatedAt: "",
      appLogs: {
        appId: 0,
        finishedAt: "",
        ID: 0,
        logs: "",
        startedAt: "",
        buildStatus: "",
      },
      resetStore,
    };
  })
);

const getAppIdFromWindowLocation = () => {
  return new URLSearchParams(window.location.search).get("appId");
};

export const AppInfoPage = () => {
  const apps = globalStore((state) => state.apps);
  const router = useRouter();
  const buildingAppId = globalStore((state) => state.buildingAppId);

  const appInfo = appInfoStore((state) => state);
  const repoUrlRef = useRef<HTMLInputElement>(null);
  const repoBranchRef = useRef<HTMLInputElement>(null);
  const buildPathRef = useRef<HTMLInputElement>(null);
  const envPathRef = useRef<HTMLInputElement>(null);
  const appNameRef = useRef<HTMLInputElement>(null);
  const appStatusRef = useRef<HTMLInputElement>(null);

  const appId = getAppIdFromWindowLocation();

  useEffect(() => {
    router.beforePopState(() => {
      appInfoStore.getState().resetStore();
      return true;
    });

    if (repoUrlRef.current) {
      repoUrlRef.current.value = appInfo.repoUrl;
    }
    if (repoBranchRef.current) {
      repoBranchRef.current.value = appInfo.repoBranch;
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
    if (appStatusRef.current) {
      appStatusRef.current.checked = appInfo.appStatus === "enabled";
    }
  }, [appInfo]);

  useEffect(() => {
    appInfoStore.setState((state) => {
      const found = globalStore
        .getState()
        .apps.find((a) => a.ID === Number(appId));
      return found;
    });
  }, [apps]);

  return (
    <div className="flex flex-col gap-2" key={appInfo.ID}>
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
          <AppButton
            className="ml-12 disabled:opacity-40"
            disabled={buildingAppId !== 0}
            onClick={async () => {
              await runBuild(appInfo.appName);
              toast("Build started", { icon: "🚀" });
              queryClient.invalidateQueries("nanoContext");
              router.push("/");
            }}
          >
            Build now
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
      <div className="flex gap-2">
        <div>App status: </div>
        <div className="flex items-center">
          <input
            ref={appStatusRef}
            id="checked-checkbox"
            type="checkbox"
            value=""
            className="w-4 h-4 accent-indigo-600"
            onChange={(e) => {
              if (e.currentTarget.checked) {
                appInfoStore.setState((state) => {
                  state.appStatus = "enabled";
                });
              } else {
                appInfoStore.setState((state) => {
                  state.appStatus = "disabled";
                });
              }
            }}
          />
          <label
            htmlFor="checked-checkbox"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {appInfo.appStatus}
          </label>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <label>Repo url: </label>
        <input
          ref={repoUrlRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0 w-[400px]"
          placeholder="Repo url"
          onChange={(e) => {
            appInfoStore.setState((state) => {
              state.repoUrl = e.currentTarget.value ?? "";
            });
          }}
        />
      </div>
      <div className="flex gap-2 items-center">
        <label>Repo branch: </label>
        <input
          ref={repoBranchRef}
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0 w-[400px]"
          placeholder="default"
          onChange={(e) => {
            appInfoStore.setState((state) => {
              state.repoBranch = e.currentTarget.value ?? "";
            });
          }}
        />
      </div>
      <div className="flex gap-2">
        <div>environment variables: </div>
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
      </div>
      <div className="flex gap-2">
        <div>build variables: </div>
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
      <AppLogs />
    </div>
  );
};

const AppLogs = () => {
  const appLogs = appInfoStore((state) => state.appLogs);

  return (
    <div className="mt-10 flex flex-col gap-3">
      <AppButton className="whitespace-nowrap w-32" onClick={onFetchLatestLogs}>
        Fetch latest logs
      </AppButton>
      <div className="flex gap-2 flex-col">
        <div>Started at: {appLogs?.startedAt} </div>
        <div>Finished at at: {appLogs?.startedAt} </div>
        <div>
          Status:{" "}
          <span
            className={
              appLogs?.buildStatus === "success"
                ? "text-green-500"
                : "text-orange-500"
            }
          >
            {appLogs?.buildStatus}
          </span>
        </div>
      </div>
      <div className="w-[50wh] h-[30vh] bg-indigo-900 rounded flex flex-col-reverse overflow-auto">
        {
          <div className="p-2">
            {appLogs?.logs.split("\n").map((log, idx) => {
              return <div key={idx}> {log}</div>;
            })}
          </div>
        }
      </div>
      <AppButton
        className="whitespace-nowrap w-32"
        onClick={onDownloadLogsClick}
      >
        Download logs
      </AppButton>
    </div>
  );
};

async function onDownloadLogsClick() {
  const logs = await fetchLogs(Number(getAppIdFromWindowLocation()));

  const link = document.createElement("a");
  link.download = "logs.txt";

  const blob = new Blob([logs.logs], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

async function onFetchLatestLogs() {
  const logs = await fetchLogs(appInfoStore.getState().ID);
  appInfoStore.setState((state) => {
    state.appLogs = logs;
  });
}

async function onSaveAppClick() {
  const updatedApp = await updateApp(appInfoStore.getState());
  globalStore.setState((state) => {
    const idx = state.apps.findIndex((app) => app.ID === updatedApp.ID);
    state.apps[idx] = updatedApp;
  });
  toast("success!", { icon: "👍" });
  router.push("/");
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

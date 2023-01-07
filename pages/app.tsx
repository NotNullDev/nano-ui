import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import AppButton from "../components/button";
import { Modal, modalStore } from "../components/modal";

type AppInfoStoreType = {
  envVal: string;
  envMountPath: string;
  buildValMountPath: string;
  buildVal: string;
};

const appInfoStore = create<AppInfoStoreType>()(
  immer((set, get, store) => {
    return {
      buildArgsModalOpen: false,
      buildVal: "",
      buildValMountPath: "",
      envVal: "",
      envMountPath: "",
    };
  })
);

export const AppInfoPage = () => {
  const router = useRouter();
  const envVal = appInfoStore((state) => state.envVal);

  useEffect(() => {
    router.beforePopState(() => {
      toast("bye!");
      return true;
    });
  }, []);

  const { appId } = router.query;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <AppButton className="bg-green-800 hover:bg-green-900">Save</AppButton>
        <AppButton
          className="bg-orange-800 hover:bg-orange-700"
          onClick={() => {
            router.push("/");
          }}
        >
          Cancel
        </AppButton>
      </div>
      <div>App ID: {appId}</div>
      <div>App name: hha</div>
      <div>App status: active</div>
      <div className="flex gap-2">
        <div>environment variables: 3</div>
        <div>{envVal}</div>
        <Modal
          onClick={() => {
            modalStore.setState((state) => {
              state.modalVal = appInfoStore.getState().envVal;
            });

            modalStore.setState((state) => {
              state.modalOnChange = (newVal) => {
                appInfoStore.setState((state) => {
                  state.envVal = newVal;
                });
              };
            });
          }}
        >
          <button className="w-[50px] shadow py-[1px] rounded bg-fuchsia-800 hover:bg-fuchsia-700 active:bg-fuchsia-700 active:scale-95">
            Edit
          </button>
        </Modal>
        <input
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
          <button className="w-[50px] shadow py-[1px] rounded bg-fuchsia-800 hover:bg-fuchsia-700 active:bg-fuchsia-700 active:scale-95">
            Edit
          </button>
        </Modal>
        <input
          className="bg-indigo-700 rounded-xl px-2 py-1 focus:ring-0 focus:ring-offset-0 border-0"
          placeholder="Mount path"
          onChange={(e) => {
            appInfoStore.setState((state) => {
              state.envMountPath = e.currentTarget.value ?? "";
            });
          }}
        />
      </div>
      <div className=""></div>
    </div>
  );
};

export default AppInfoPage;

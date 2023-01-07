import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import AppButton from "../components/button";
import { Modal, modalStore } from "../components/modal";

const inter = Inter({ subsets: ["latin"] });

type GlobalStoreType = {
  globalEnv: string;
};

const globalStore = create<GlobalStoreType>()(
  immer((set, get, store) => {
    return {
      globalEnv: "",
    };
  })
);

export default function Home() {
  return (
    <div>
      <div className="w-full h-[70px] mb-4 shadow shadow-indigo-600 flex gap-2 items-center px-10 justify-between">
        <div className="flex gap-2">
          <AppButton
            className="h-min"
            onClick={async () => {
              await navigator.clipboard.writeText("hahha");
              toast.success("token copied to clipboard");
            }}
          >
            Copy token
          </AppButton>
          <AppButton className="whitespace-nowrap h-min">Reset token</AppButton>
        </div>
        <div>
          <Modal
            onClick={() => {
              modalStore.setState((state) => {
                state.modalVal = globalStore.getState().globalEnv;
              });

              modalStore.setState((state) => {
                state.modalOnChange = (newVal) => {
                  globalStore.setState((state) => {
                    state.globalEnv = newVal;
                  });
                };
              });
            }}
          >
            <AppButton className="whitespace-nowrap min-w-[150px]">
              Global environment
            </AppButton>
          </Modal>
        </div>
        <div className="flex gap-1">
          <input
            placeholder="app name"
            className="bg-indigo-700 px-3 py-1 rounded-xl"
          />
          <AppButton className="whitespace-nowrap min-w-[120px] bg-green-800 hover:bg-green-900">
            Add application
          </AppButton>
        </div>
      </div>
      <div className="mb-3">
        <input
          placeholder="search apps"
          className="bg-indigo-700 px-3 py-1 rounded-xl"
        />
      </div>
      <div className="flex flex-wrap justify-between gap-y-12">
        <AppPreview />
        <AppPreview />
        <AppPreview />
        <AppPreview />
      </div>
    </div>
  );
}

const AppPreview = () => {
  const router = useRouter();

  return (
    <div className="w-[300px] h-[220px] shadow  bg-gradient-to-tr from-bg-indigo-800 via-bg-indigo-900 to-bg-indigo-800 col-span-1 flex flex-col p-6 rounded">
      <div className="flex flex-1 flex-col gap-1">
        <div className="text-center mb-4">e-com</div>
        <div className="text-lime-500">active</div>
        <div className="">last commit at </div>
        <div className="">last build at </div>
      </div>
      <div className="justify-end flex">
        <button
          className="p-1 shadow-sm active:shadow-inner shadow-black w-[80px] rounded hover:bg-transparent/10 transition-all"
          onClick={() => {
            router.push("/app?appId=1");
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
};

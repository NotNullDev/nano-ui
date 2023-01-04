import * as Dialog from "@radix-ui/react-dialog";
import anime from "animejs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

type AppInfoStoreType = {
  envModalOpen: boolean;
  buildArgsModalOpen: boolean;
  modalOnChange: (val: string) => void;
  envVal: string;
  buildVal: string;
};

const appInfoStore = create<AppInfoStoreType>()(
  immer((set, get, store) => {
    return {
      envModalOpen: false,
      buildArgsModalOpen: false,
      modalOnChange: (val: string) => {
        // dummy
      },
      buildVal: "",
      envVal: "",
    };
  })
);

export const AppInfoPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.beforePopState(() => {
      toast("bye!");
      return true;
    });
  }, []);

  const { appId } = router.query;

  return (
    <div className="flex flex-col gap-2">
      <div>App ID: {appId}</div>
      <div>App name: hha</div>
      <div>App status: active</div>
      <div>environment variables: 10</div>
      <div className="flex gap-2">
        <div>environment variables: 3</div>
        <Modal
          onClick={() => {
            appInfoStore.setState((state) => {
              state.modalOnChange = (newVal) => {};
            });
          }}
        />
      </div>
      <div className="flex gap-2">
        <div>build variables: 3</div>
        <Modal />
      </div>
      <div className=""></div>
    </div>
  );
};

export default AppInfoPage;

type ModalProps = {
  onClick?: () => void;
};
const Modal = ({ onClick }: ModalProps) => {
  const modalOpen = appInfoStore((state) => state.envModalOpen);

  useEffect(() => {
    anime({
      targets: ".modal",
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      duration: 1000,
      opacity: [0, 0.1],
      translateX: 300,
    });
  }, []);

  const [val, setVal] = useState(true);

  return (
    <>
      <Dialog.Root open={modalOpen}>
        <Dialog.Trigger>
          <button
            className="w-[50px] shadow py-[1px] rounded bg-fuchsia-800 hover:bg-fuchsia-700 active:bg-fuchsia-700 active:scale-95"
            onClick={() => {
              if (onClick) {
                onClick();
              }
              appInfoStore.setState((state) => {
                state.envModalOpen = true;
              });
            }}
          >
            Edit
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            className="w-screen h-screen absolute top-0 left-0 bg-black/50 z-10 modal"
            onClick={() => {
              appInfoStore.setState((state) => {
                state.envModalOpen = false;
              });
            }}
          />
          <Dialog.Content
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                appInfoStore.setState((state) => {
                  state.envModalOpen = false;
                });
              }
            }}
            className="rounded pointer-events-none w-1/2 h-1/2 z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-900 ring-0 ring-offset-0 border-0"
          >
            <Dialog.Title />
            <Dialog.Description />
            <Dialog.Close />
            {val && <ModalTextArea />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

const ModalTextArea = () => {
  const onChangeCallback = appInfoStore((state) => state.modalOnChange);
  const textAreRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setTimeout(() => {
      textAreRef.current?.focus();
    }, 0);

    return () => {};
  }, [textAreRef]);
  return (
    <>
      <textarea
        onChange={(e) => {
          onChangeCallback(e.currentTarget.value);
        }}
        ref={textAreRef}
        className="w-full h-full bg-transparent text-slate-200 p-3 text-sm focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-none border-none border-0 resize-none"
      ></textarea>
    </>
  );
};

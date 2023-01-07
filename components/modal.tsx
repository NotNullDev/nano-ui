import * as Dialog from "@radix-ui/react-dialog";
import anime from "animejs";
import { useEffect, useRef, useState } from "react";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

export type ModalStoreType = {
  modalOnChange: (val: string) => void;
  modalVal: string;
  modalOpen: boolean;
};

export const modalStore = create<ModalStoreType>()(
  immer((get, set, store) => {
    return {
      modalOnChange: (val: string) => {},
      modalVal: "",
      modalOpen: false,
    };
  })
);

export type ModalProps = {
  onClick?: () => void;
  children?: React.ReactNode;
};
export const Modal = ({ onClick, children }: ModalProps) => {
  const modalOpen = modalStore((state) => state.modalOpen);

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
          <div
            onClick={() => {
              if (onClick) {
                onClick();
              }
              modalStore.setState((state) => {
                state.modalOpen = true;
              });
            }}
          >
            {children}
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            className="w-screen h-screen absolute top-0 left-0 bg-black/50 z-10 modal"
            onClick={() => {
              modalStore.setState((state) => {
                state.modalOpen = false;
              });
            }}
          />
          <Dialog.Content
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                modalStore.setState((state) => {
                  state.modalOpen = false;
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
  const onChangeCallback = modalStore((state) => state.modalOnChange);
  const textAreRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setTimeout(() => {
      textAreRef.current?.focus();
    }, 0);
    if (textAreRef.current) {
      textAreRef.current.value = modalStore.getState().modalVal;
    }
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

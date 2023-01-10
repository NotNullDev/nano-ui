export type AppButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AppButton = (props: AppButtonProps) => {
  const requestedClassName = props.className ?? "";

  return (
    <button
      {...props}
      className={
        "p-1 shadow-sm active:shadow-inner shadow-black min-w-[80px] rounded hover:bg-transparent/10 transition-all active:scale-95 " +
        requestedClassName
      }
    >
      {props.children}
    </button>
  );
};

export default AppButton;

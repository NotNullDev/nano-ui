import { Inter } from "@next/font/google";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex flex-wrap justify-between gap-y-12">
      <AppPreview />
      <AppPreview />
      <AppPreview />
      <AppPreview />
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

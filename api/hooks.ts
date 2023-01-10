import { useQuery } from "react-query";
import { globalStore } from "../pages";
import { fetchNanoContext } from "./nanoContext";

export const UseNanoContext = () => {
  return useQuery(["nanoContext"], fetchNanoContext, {
    onSuccess: (data) => {
      globalStore.setState((state) => {
        return data;
      });
      console.dir(data);
    },
    refetchInterval: 1000 * 10,
  });
};

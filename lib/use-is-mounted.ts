import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // client snapshot — always true
    () => false, // server snapshot — always false
  );
}

import { useSyncExternalStore } from "react";

/**
 * App Store is now only for UI state.
 * All business data (Members, Buildings, Assignments) is stored in SQLite
 * and managed via TanStack Query.
 */

type State = {
  sidebarOpen: boolean;
};

const initialState: State = {
  sidebarOpen: true,
};

let state: State = initialState;
const listeners = new Set<() => void>();

function setState(updater: (s: State) => State) {
  state = updater(state);
  listeners.forEach((l) => l());
}

export function useAppStore(): State {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

export function toggleSidebar() {
  setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }));
}

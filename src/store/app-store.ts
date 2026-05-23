import { useSyncExternalStore } from "react";
import {
  type Assignment,
  type Building,
  initialAssignments,
  initialBuildings,
} from "@/data/buildings";

type State = {
  buildings: Building[];
  assignments: Assignment[];
};

let state: State = {
  buildings: initialBuildings,
  assignments: initialAssignments,
};

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

export function addBuilding(b: Omit<Building, "id">) {
  setState((s) => ({
    ...s,
    buildings: [{ ...b, id: `b${Date.now()}` }, ...s.buildings],
  }));
}

export function addAssignments(
  building: Building,
  rows: { category: Assignment["category"]; count: number }[],
) {
  const date = new Date().toISOString();
  setState((s) => ({
    ...s,
    assignments: [
      ...rows.map((r, i) => ({
        id: `a${Date.now()}-${i}`,
        buildingId: building.id,
        buildingName: building.name,
        category: r.category,
        count: r.count,
        date,
      })),
      ...s.assignments,
    ],
  }));
}

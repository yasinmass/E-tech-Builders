import { useSyncExternalStore } from "react";
import {
  type Assignment,
  type Building,
  initialAssignments,
  initialBuildings,
} from "@/data/buildings";
import { type Member, dummyMembers } from "@/data/members";

type State = {
  buildings: Building[];
  assignments: Assignment[];
  members: Member[];
};

const STORAGE_KEY = "buildops_app_state";

function getInitialState(): State {
  if (typeof window === "undefined") return { 
    buildings: initialBuildings || [], 
    assignments: initialAssignments || [], 
    members: dummyMembers || [] 
  };
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved state", e);
    }
  }
  
  return {
    buildings: initialBuildings || [],
    assignments: initialAssignments || [],
    members: dummyMembers || [],
  };
}

let state: State = getInitialState();

const listeners = new Set<() => void>();

function setState(updater: (s: State) => State) {
  state = updater(state);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
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

export function addMember(m: Omit<Member, "id" | "createdAt">) {
  setState((s) => ({
    ...s,
    members: [
      { 
        ...m, 
        id: Math.random().toString(36).substr(2, 9), 
        createdAt: new Date().toISOString() 
      }, 
      ...s.members
    ],
  }));
}

export function deleteMember(id: string) {
  setState((s) => ({
    ...s,
    members: s.members.filter((m) => m.id !== id),
  }));
}

export function updateMember(id: string, m: Partial<Member>) {
  setState((s) => ({
    ...s,
    members: s.members.map((member) => 
      member.id === id ? { ...member, ...m } : member
    ),
  }));
}

export function addAssignments(
  building: Building,
  rows: { category: string; count: number }[],
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
        type: "builder" as const,
        details: []
      })),
      ...s.assignments,
    ],
  }));
}

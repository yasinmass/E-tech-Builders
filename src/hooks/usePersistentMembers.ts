import { useState, useEffect } from "react";
import { dummyMembers, type Member } from "@/data/members";

const STORAGE_KEY = "fleet_members";

export function usePersistentMembers() {
  const [members, setMembers] = useState<Member[]>(() => {
    if (typeof window === "undefined") return dummyMembers;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : dummyMembers;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const addMember = (data: Omit<Member, "id" | "createdAt">) => {
    const newMember: Member = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setMembers((prev) => [newMember, ...prev]);
    return newMember;
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return { members, addMember, deleteMember };
}

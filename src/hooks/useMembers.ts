import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  type CreateMemberPayload,
} from "@/api/members";

export const MEMBERS_KEY = ["members"] as const;

export function useMembers() {
  return useQuery({
    queryKey: MEMBERS_KEY,
    queryFn: getMembers,
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMemberPayload) => createMember(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MEMBERS_KEY });
    },
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateMemberPayload> }) =>
      updateMember(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MEMBERS_KEY });
    },
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MEMBERS_KEY });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFilteredAssignments,
  createAssignment,
  updateAssignment,
  type CreateAssignmentPayload,
} from "@/api/assignments";

export const ASSIGNMENTS_KEY = ["assignments"] as const;

/** Fetch all assignments — optionally filtered by search string and type */
export function useAssignments(search = "", type = "all") {
  return useQuery({
    queryKey: [...ASSIGNMENTS_KEY, search, type],
    queryFn: () => getFilteredAssignments(search, type),
    staleTime: 15_000,
  });
}

/** Create a new WorkSession + WorkDetails, then invalidate the assignments list */
export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) => createAssignment(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
    },
  });
}

/** Update an existing assignment record, then invalidate the list */
export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      type,
      payload,
    }: {
      id: string;
      type: "builder" | "etech";
      payload: any;
    }) => updateAssignment(id, type, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
    },
  });
}

/** Delete an assignment record (handles both builder and etech) */
export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: "builder" | "etech" }) => {
      const endpoint = type === "builder" ? `/assignments/${id}/` : `/etech/assignments/${id}/`;
      // We use the common api helper or Axios directly if needed, 
      // but here we'll assume we can call an api.delete
      const api = (await import("@/api/axios")).default;
      return api.delete(endpoint);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
    },
  });
}

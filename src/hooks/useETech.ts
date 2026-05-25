import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getETechProjects,
  createETechProject,
  addETechCategory,
  deleteETechCategory,
  createETechAssignment,
  type CreateETechPayload,
  type CreateETechAssignmentPayload,
} from "@/api/etech";
import { ASSIGNMENTS_KEY } from "./useAssignments";

export const ETECH_KEY = ["etech"] as const;

export function useETechProjects() {
  return useQuery({
    queryKey: ETECH_KEY,
    queryFn: getETechProjects,
  });
}

export function useCreateETechProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createETechProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ETECH_KEY }),
  });
}

export function useAddETechCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      addETechCategory(projectId, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ETECH_KEY }),
  });
}

export function useDeleteETechCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, categoryId }: { projectId: string; categoryId: number }) =>
      deleteETechCategory(projectId, categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ETECH_KEY }),
  });
}

export function useCreateETechAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createETechAssignment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ETECH_KEY });
      qc.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBuildings,
  getBuildingById,
  createBuilding,
  deleteBuilding,
  type CreateBuildingPayload,
} from "@/api/buildings";

export const BUILDINGS_KEY = ["buildings"] as const;

/** Fetch all buildings from the backend */
export function useBuildings() {
  return useQuery({
    queryKey: BUILDINGS_KEY,
    queryFn: getBuildings,
    staleTime: 30_000,
  });
}

/** Fetch a single building by id */
export function useBuildingById(id: string) {
  return useQuery({
    queryKey: [...BUILDINGS_KEY, id],
    queryFn: () => getBuildingById(id),
    enabled: !!id,
  });
}

/** Create a new building, then invalidate the list */
export function useCreateBuilding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBuildingPayload) => createBuilding(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BUILDINGS_KEY });
    },
  });
}

/** Delete a building, then invalidate the list */
export function useDeleteBuilding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBuilding(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BUILDINGS_KEY });
    },
  });
}

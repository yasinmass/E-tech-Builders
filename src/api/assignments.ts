import api from "./axios";
import type { Assignment, WorkerCategory } from "@/data/buildings";

/** Shape returned by GET /api/assignments/ */
export interface WorkSessionDTO {
  id: number;
  buildingId: string;
  buildingName: string;
  workDate: string;
  createdAt: string;
  details: { id: number; category: WorkerCategory; count: number }[];
}

/** Payload for POST /api/assignments/ */
export interface CreateAssignmentPayload {
  building: number; // building PK
  work_date: string; // "YYYY-MM-DD"
  work_time?: string; // "HH:MM"
  details: { category: WorkerCategory; count: number }[];
}

/** GET /api/assignments/ */
export async function getAssignments(): Promise<WorkSessionDTO[]> {
  const { data } = await api.get<WorkSessionDTO[]>("/assignments/");
  return data;
}

/** GET /api/assignments/<id>/ */
export async function getAssignmentById(id: number): Promise<WorkSessionDTO> {
  const { data } = await api.get<WorkSessionDTO>(`/assignments/${id}/`);
  return data;
}

/** POST /api/assignments/ */
export async function createAssignment(
  payload: CreateAssignmentPayload,
): Promise<WorkSessionDTO> {
  const { data } = await api.post<WorkSessionDTO>("/assignments/", payload);
  return data;
}

/** PUT /api/assignments/<id>/ or /api/etech/assignments/<id>/ */
export async function updateAssignment(
  id: string,
  type: "builder" | "etech",
  payload: any,
): Promise<WorkSessionDTO> {
  const endpoint =
    type === "builder" ? `/assignments/${id}/` : `/etech/assignments/${id}/`;
  const { data } = await api.put<WorkSessionDTO>(endpoint, payload);
  return data;
}

/**
 * GET /api/filter/?search=<query>&type=<builder|etech|all>
 * Returns flat Assignment records matching the query.
 * Response shape matches the frontend Assignment type exactly.
 */
export async function getFilteredAssignments(search = "", type = "all"): Promise<Assignment[]> {
  const params = {
    search: search.trim() || undefined,
    type: type !== "all" ? type : undefined,
  };
  const { data } = await api.get<Assignment[]>("/filter/", { params });
  return data;
}

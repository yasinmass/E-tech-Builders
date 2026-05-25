import api from "./axios";
import type { Building } from "@/data/buildings";

/** Shape the backend returns (already camelCase from serializer) */
export type BuildingDTO = Building;

/** POST body for creating/updating a building (uses FormData for file uploads) */
export interface CreateBuildingPayload {
  name: string;
  address: string;
  phone: string;
  owner_photo?: File | null;
  site_photo?: File | null;
}

/** GET /api/buildings/ */
export async function getBuildings(): Promise<BuildingDTO[]> {
  const { data } = await api.get<BuildingDTO[]>("/buildings/");
  return data;
}

/** GET /api/buildings/<id>/ */
export async function getBuildingById(id: string): Promise<BuildingDTO> {
  const { data } = await api.get<BuildingDTO>(`/buildings/${id}/`);
  return data;
}

/** POST /api/buildings/ — multipart/form-data to support file uploads */
export async function createBuilding(payload: CreateBuildingPayload): Promise<BuildingDTO> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("address", payload.address);
  formData.append("phone", payload.phone);
  if (payload.owner_photo) formData.append("owner_photo", payload.owner_photo);
  if (payload.site_photo) formData.append("site_photo", payload.site_photo);

  const { data } = await api.post<BuildingDTO>("/buildings/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** PUT /api/buildings/<id>/ */
export async function updateBuilding(
  id: string,
  payload: Partial<CreateBuildingPayload>,
): Promise<BuildingDTO> {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.address !== undefined) formData.append("address", payload.address);
  if (payload.phone !== undefined) formData.append("phone", payload.phone);
  if (payload.owner_photo) formData.append("owner_photo", payload.owner_photo);
  if (payload.site_photo) formData.append("site_photo", payload.site_photo);

  const { data } = await api.patch<BuildingDTO>(`/buildings/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** DELETE /api/buildings/<id>/ */
export async function deleteBuilding(id: string): Promise<void> {
  await api.delete(`/buildings/${id}/`);
}

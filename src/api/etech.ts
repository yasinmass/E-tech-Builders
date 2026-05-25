import api from "./axios";
import type { ETechProject, ETechCategory } from "@/data/buildings";

export interface CreateETechPayload {
  name: string;
  ownerName: string;
  location: string;
  contact: string;
  description: string;
  ownerPhoto?: File;
  sitePhoto?: File;
}

export interface CreateETechAssignmentPayload {
  project: number;
  work_date: string;
  details: { category: number; count: number }[];
}

export async function getETechProjects(): Promise<ETechProject[]> {
  const { data } = await api.get<ETechProject[]>("/etech/projects/");
  return data;
}

export async function createETechProject(payload: CreateETechPayload): Promise<ETechProject> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("ownerName", payload.ownerName);
  formData.append("location", payload.location);
  formData.append("contact", payload.contact);
  formData.append("description", payload.description);
  if (payload.ownerPhoto) formData.append("ownerPhoto", payload.ownerPhoto);
  if (payload.sitePhoto) formData.append("sitePhoto", payload.sitePhoto);

  const { data } = await api.post<ETechProject>("/etech/projects/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function addETechCategory(projectId: string, name: string): Promise<ETechCategory> {
  const { data } = await api.post<ETechCategory>(`/etech/projects/${projectId}/categories/`, { name });
  return data;
}

export async function deleteETechCategory(projectId: string, categoryId: number): Promise<void> {
  await api.delete(`/etech/projects/${projectId}/categories/${categoryId}/`);
}

export async function createETechAssignment(payload: CreateETechAssignmentPayload): Promise<any> {
  const { data } = await api.post("/etech/assignments/", payload);
  return data;
}

export async function updateETechProject(
  id: string,
  payload: Partial<CreateETechPayload>
): Promise<ETechProject> {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.ownerName !== undefined) formData.append("ownerName", payload.ownerName);
  if (payload.location !== undefined) formData.append("location", payload.location);
  if (payload.contact !== undefined) formData.append("contact", payload.contact);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.ownerPhoto) formData.append("ownerPhoto", payload.ownerPhoto);
  if (payload.sitePhoto) formData.append("sitePhoto", payload.sitePhoto);

  const { data } = await api.patch<ETechProject>(`/etech/projects/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteETechProject(id: string): Promise<void> {
  await api.delete(`/etech/projects/${id}/`);
}

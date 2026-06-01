import api from "./axios";
import type { Member } from "@/data/members";

export type MemberDTO = Member;

export interface CreateMemberPayload {
  name: string;
  phone: string;
  address: string;
  photo?: File | null;
}

export async function getMembers(): Promise<MemberDTO[]> {
  const { data } = await api.get<MemberDTO[]>("/members/");
  return data;
}

export async function createMember(payload: CreateMemberPayload): Promise<MemberDTO> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("phone", payload.phone);
  formData.append("address", payload.address);
  if (payload.photo) formData.append("photo", payload.photo);

  const { data } = await api.post<MemberDTO>("/members/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateMember(
  id: string,
  payload: Partial<CreateMemberPayload>,
): Promise<MemberDTO> {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.phone !== undefined) formData.append("phone", payload.phone);
  if (payload.address !== undefined) formData.append("address", payload.address);
  if (payload.photo) formData.append("photo", payload.photo);

  const { data } = await api.patch<MemberDTO>(`/members/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteMember(id: string): Promise<void> {
  await api.delete(`/members/${id}/`);
}

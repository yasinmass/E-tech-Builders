export interface Member {
  id: string;
  name: string;
  phone: string;
  address: string;
  photo?: string;
  createdAt: string;
}

export const dummyMembers: Member[] = [];

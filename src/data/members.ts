export interface Member {
  id: string;
  name: string;
  phone: string;
  address: string;
  photo?: string;
  createdAt: string;
}

export const dummyMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+91 9876543210",
    address: "123, Blue Street, New Delhi",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+91 9123456789",
    address: "456, Green Road, Mumbai",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Robert Wilson",
    phone: "+91 8888877777",
    address: "789, Industrial Park, Bangalore",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    createdAt: new Date().toISOString(),
  },
];

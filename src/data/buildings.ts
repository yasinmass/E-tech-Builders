export type WorkerCategory =
  | "Electrician"
  | "Plumber"
  | "Painter"
  | "Centering"
  | "Carpenter"
  | "Mason"
  | "Men Worker"
  | "Women Worker";

export const WORKER_CATEGORIES: WorkerCategory[] = [
  "Electrician",
  "Plumber",
  "Painter",
  "Centering",
  "Carpenter",
  "Mason",
  "Men Worker",
  "Women Worker",
];

export type Assignment = {
  id: string;
  buildingId: string;
  buildingName: string;
  category: WorkerCategory;
  count: number;
  date: string; // ISO
};

export type Building = {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerPhoto: string;
  sitePhoto: string;
};

export const initialBuildings: Building[] = [
  {
    id: "b1",
    name: "Skyline Residency",
    address: "12 Marina Drive, Chennai",
    phone: "+91 98765 43210",
    ownerPhoto: "https://i.pravatar.cc/200?img=12",
    sitePhoto:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=70",
  },
  {
    id: "b2",
    name: "Greenfield Towers",
    address: "44 Park Avenue, Bengaluru",
    phone: "+91 91234 56789",
    ownerPhoto: "https://i.pravatar.cc/200?img=32",
    sitePhoto:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=70",
  },
  {
    id: "b3",
    name: "Heritage Court",
    address: "8 Lake Road, Hyderabad",
    phone: "+91 99887 76655",
    ownerPhoto: "https://i.pravatar.cc/200?img=58",
    sitePhoto:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=70",
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: "a1",
    buildingId: "b1",
    buildingName: "Skyline Residency",
    category: "Mason",
    count: 6,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "a2",
    buildingId: "b1",
    buildingName: "Skyline Residency",
    category: "Electrician",
    count: 2,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "a3",
    buildingId: "b2",
    buildingName: "Greenfield Towers",
    category: "Painter",
    count: 4,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "a4",
    buildingId: "b3",
    buildingName: "Heritage Court",
    category: "Carpenter",
    count: 3,
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

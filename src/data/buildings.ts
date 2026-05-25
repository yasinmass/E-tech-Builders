// ─────────────────────────────────────────────────────────────────────────────
// Type definitions — shared across frontend and API layer.
// All actual data is fetched from the Django backend.
// ─────────────────────────────────────────────────────────────────────────────

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

export type AssignmentDetail = {
  category: string;
  count: number;
};

/** Flat assignment row used by the Filter page (matches /api/filter/ response) */
export type Assignment = {
  id: string;
  buildingId: string;
  buildingName: string;
  category: string;
  count: number;
  date: string; // ISO string
  details: AssignmentDetail[];
  type: "builder" | "etech";
};

/** Building entity (matches /api/buildings/ response — camelCase from serializer) */
export type Building = {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerPhoto: string;
  sitePhoto: string;
};

export type ETechCategory = {
  id: number;
  name: string;
};

export type ETechProject = {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  contact: string;
  description: string;
  ownerPhoto?: string;
  sitePhoto?: string;
  categories: ETechCategory[];
  createdAt?: string;
};
export const initialBuildings: Building[] = [];
export const initialAssignments: Assignment[] = [];

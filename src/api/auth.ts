import api from "./axios";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

/** POST /api/login/ */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/login/", payload);
  return data;
}

/** POST /api/logout/ */
export async function logout(): Promise<void> {
  const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
  try {
    await api.post("/logout/", { refresh });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }
}

/** Persist tokens to localStorage after login */
export function saveTokens(access: string, refresh: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
}

/** Remove tokens from localStorage */
export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

/** Check whether a valid access token is present */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}

import { API_BASE_URL } from "@/lib/admin/config";
import { clearStoredToken, getStoredToken } from "@/lib/admin/auth";

const LOGIN_PATH = "/admin/login";

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EventPhoto = {
  url: string;
  key: string;
};

export type EventRecord = {
  _id: string;
  title: string;
  description: string | null;
  date: string;
  photos: EventPhoto[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.detail === "string") return body.detail;
  } catch {
    // response wasn't JSON, fall through to generic message
  }
  return `Request failed with status ${response.status}.`;
}

async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearStoredToken();
    if (typeof window !== "undefined" && window.location.pathname !== LOGIN_PATH) {
      window.location.href = LOGIN_PATH;
    }
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return response;
}

export async function login(username: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function fetchAdminTeam(): Promise<TeamMember[]> {
  const response = await apiFetch("/api/admin/team");
  return response.json();
}

export async function fetchTeamMember(id: string): Promise<TeamMember> {
  const response = await apiFetch(`/api/admin/team/${id}`);
  return response.json();
}

export async function createTeamMember(formData: FormData): Promise<TeamMember> {
  const response = await apiFetch("/api/admin/team", {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function updateTeamMember(
  id: string,
  formData: FormData
): Promise<TeamMember> {
  const response = await apiFetch(`/api/admin/team/${id}`, {
    method: "PUT",
    body: formData,
  });
  return response.json();
}

export async function deleteTeamMember(id: string): Promise<void> {
  await apiFetch(`/api/admin/team/${id}`, { method: "DELETE" });
}

export async function fetchAdminEvents(): Promise<EventRecord[]> {
  const response = await apiFetch("/api/admin/events");
  return response.json();
}

export async function fetchEvent(id: string): Promise<EventRecord> {
  const response = await apiFetch(`/api/admin/events/${id}`);
  return response.json();
}

export async function createEvent(formData: FormData): Promise<EventRecord> {
  const response = await apiFetch("/api/admin/events", {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function updateEvent(
  id: string,
  formData: FormData
): Promise<EventRecord> {
  const response = await apiFetch(`/api/admin/events/${id}`, {
    method: "PUT",
    body: formData,
  });
  return response.json();
}

export async function deleteEvent(id: string): Promise<void> {
  await apiFetch(`/api/admin/events/${id}`, { method: "DELETE" });
}

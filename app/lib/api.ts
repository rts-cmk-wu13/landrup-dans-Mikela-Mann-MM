
import type {
  Activity,
  ActivityType,
  User,
} from "@/app/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// ─── Generic fetch helper ──────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...rest } = init ?? {};
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((rest.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${msg}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Activities ────────────────────────────────────────────────────────────

export async function getActivities(): Promise<Activity[]> {
  return apiFetch<Activity[]>("/api/v1/activities");
}

export async function getActivity(id: number): Promise<Activity> {
  return apiFetch<Activity>(`/api/v1/activities/${id}`);
}

export async function getActivityParticipants(
  id: number,
  token: string
): Promise<User[]> {
  return apiFetch<User[]>(`/api/v1/activities/${id}/users`, { token });
}

export async function getActivityTypes(): Promise<ActivityType[]> {
  return apiFetch<ActivityType[]>("/api/v1/activitytypes");
}

// ─── Users ─────────────────────────────────────────────────────────────────

// ─── Auth ──────────────────────────────────────────────────────────────────

// ─── Content ───────────────────────────────────────────────────────────────

// ─── Asset URL helper ──────────────────────────────────────────────────────

export function getAssetUrl(filename: string | undefined): string | undefined {
  if (!filename) return undefined;
  return `${BASE_URL}/assets/${filename}`;
}
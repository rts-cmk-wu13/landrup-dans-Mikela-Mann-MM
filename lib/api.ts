

import type {
  CreateActivityPayload,
  Activity,
  AuthResponse,
  ContactPayload,
  User,
  RegisterPayload,
  NewsletterPayload,
  Testimonial,
} from "@/types";
import { ApiError, AuthError, NotFoundError, ServerError, NetworkError } from "./errors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// ─── Generic fetch helper ──────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...rest } = init ?? {};

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((rest.headers as Record<string, string>) ?? {}),
  };

  if (
    !(rest.body instanceof FormData) &&
    !(headers["Content-Type"]?.includes("form"))
  ) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });
  } catch (cause) {
    throw new NetworkError(path, cause);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    if (res.status === 401) throw new AuthError(path);
    if (res.status === 404) throw new NotFoundError(path);
    if (res.status >= 500)  throw new ServerError(res.status, path, body);
    throw new ApiError(res.status, path, body);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
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
  const activity = await getActivity(id);
  return activity.users ?? [];
}

export async function createActivity(
  payload: CreateActivityPayload,
  token: string
): Promise<Activity> {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("description", payload.description);
  form.append("weekday", payload.weekday);
  form.append("time", payload.time);
  form.append("minAge", String(payload.minAge));
  form.append("maxAge", String(payload.maxAge));
  form.append("maxParticipants", String(payload.maxParticipants));
  if (payload.file) form.append("file", payload.file);

  return apiFetch<Activity>("/api/v1/activities", {
    method: "POST",
    body: form,
    token,
  });
}

export async function updateActivity(
  id: number,
  payload: Partial<CreateActivityPayload>,
  token: string
): Promise<Activity> {
  const form = new FormData();
  if (payload.name)            form.append("name", payload.name);
  if (payload.description)     form.append("description", payload.description);
  if (payload.weekday)         form.append("weekday", payload.weekday);
  if (payload.time)            form.append("time", payload.time);
  if (payload.minAge != null)  form.append("minAge", String(payload.minAge));
  if (payload.maxAge != null)  form.append("maxAge", String(payload.maxAge));
  if (payload.maxParticipants != null)
    form.append("maxParticipants", String(payload.maxParticipants));
  if (payload.file) form.append("file", payload.file);

  return apiFetch<Activity>(`/api/v1/activities/${id}`, {
    method: "PATCH",
    body: form,
    token,
  });
}

export async function deleteActivity(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/api/v1/activities/${id}`, {
    method: "DELETE",
    token,
  });
}

// ─── Users ────────────────────────────────────────────────────────────────

export async function getUser(userId: number, token: string): Promise<User> {
  return apiFetch<User>(`/api/v1/users/${userId}`, { token });
}

export async function enrollInActivity(
  userId: number,
  activityId: number,
  token: string
): Promise<void> {
  return apiFetch<void>(`/api/v1/users/${userId}/activities/${activityId}`, {
    method: "POST",
    token,
  });
}

export async function leaveActivity(
  userId: number,
  activityId: number,
  token: string
): Promise<void> {
  return apiFetch<void>(`/api/v1/users/${userId}/activities/${activityId}`, {
    method: "DELETE",
    token,
  });
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const form = new URLSearchParams();
  form.append("username",  payload.username);
  form.append("password",  payload.password);
  form.append("firstname", payload.firstname);
  form.append("lastname",  payload.lastname);
  form.append("age",       String(payload.age));
  form.append("role",      "default");

  return apiFetch<User>("/api/v1/users", {
    method: "POST",
    body: form.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function loginUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/token", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// ─── Content ───────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  return apiFetch<Testimonial[]>("/api/v1/testimonials");
}

export async function submitNewsletter(payload: NewsletterPayload): Promise<void> {
  return apiFetch<void>("/api/v1/newsletter", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  return apiFetch<void>("/api/v1/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Asset URL helper ──────────────────────────────────────────────────────

export function getAssetUrl(filename: string | undefined): string | undefined {
  if (!filename) return undefined;
  return `${BASE_URL}/assets/${filename}`;
}

import type {
    CreateActivityPayload,
    Activity,
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

    if (!(rest.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

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
    if (payload.name) form.append("name", payload.name);
    if (payload.description) form.append("description", payload.description);
    if (payload.weekday) form.append("weekday", payload.weekday);
    if (payload.time) form.append("time", payload.time);
    if (payload.minAge != null) form.append("minAge", String(payload.minAge));
    if (payload.maxAge != null) form.append("maxAge", String(payload.maxAge));
    if (payload.maxParticipants != null) form.append("maxParticipants", String(payload.maxParticipants));
    if (payload.file) form.append("file", payload.file);

    return apiFetch<Activity>(`/api/v1/activities/${id}`, {
        method: "PATCH",
        body: form,
        token,
    });
}

export default function deleteActivity(id: number, token: string): Promise<void> {
    return apiFetch<void>(`/api/v1/activities/${id}`, {
        method: "DELETE",
        token, 
    });
}


// ─── Users ─────────────────────────────────────────────────────────────────

// ─── Auth ──────────────────────────────────────────────────────────────────

// ─── Content ───────────────────────────────────────────────────────────────

// ─── Asset URL helper ──────────────────────────────────────────────────────

export function getAssetUrl(filename: string | undefined): string | undefined {
    if (!filename) return undefined;
    return `${BASE_URL}/assets/${filename}`;
}
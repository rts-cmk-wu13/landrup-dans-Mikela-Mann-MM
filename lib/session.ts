"use server"

import type { Session } from "@/types";

const COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "landrup_session";

// ─── Server-side (brug i Server Components og Server Actions) ──────────────

export async function getServerSession(): Promise<Session | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as Session;
  } catch {
    return null;
  }
}

export async function clearServerSession(): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}


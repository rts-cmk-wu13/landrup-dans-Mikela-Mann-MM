

/**
 * DAL — Data Access Layer
 * Server-side only. Reads session cookie and exposes auth helpers.
 * Never import this in client components.
 */

import { cookies } from "next/headers";
import type { Session } from "@/types";

const COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "landrup_session";

// ─── Session helpers ───────────────────────────────────────────────────────

/** Read and parse the session from the HTTP-only cookie. Returns null if missing/invalid. */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(atob(raw)) as Session;
  } catch {
    return null;
  }
}

/** Require an authenticated session. Returns the session or null. */
export async function requireAuth(): Promise<Session | null> {
  return getSession();
}

/** Require instructor or admin role. Returns session or null. */
export async function requireInstructor(): Promise<Session | null> {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== "instructor" && session.role !== "admin") return null;
  return session;
}

// ─── Cookie helpers (used in API route handlers) ───────────────────────────

/** Encode a session into a base64 string for the cookie value. */
export function encodeSession(session: Session): string {
  return btoa(JSON.stringify(session));
}
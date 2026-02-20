

"use client";

import Cookies from "js-cookie";
import type { Session } from "@/types";

const COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "landrup_session";

const REMEMBER_ME_DAYS = 30;

// ─── Read session ───────────────────────────────────────────────────────────

export function getClientSession(): Session | null {
  const raw = Cookies.get(COOKIE_NAME);
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as Session;
  } catch {
    return null;
  }
}

// ─── Save session ───────────────────────────────────────────────────────────

export function setClientSession(session: Session, rememberMe: boolean): void {
  const encoded = btoa(JSON.stringify(session));
  if (rememberMe) {
    Cookies.set(COOKIE_NAME, encoded, { expires: REMEMBER_ME_DAYS, sameSite: "Lax" });
  } else {
    // Session-cookie — slettes når browseren lukkes
    Cookies.set(COOKIE_NAME, encoded, { sameSite: "Lax" });
  }
}

// ─── Delete session ──────────────────────────────────────────────────────────

export function clearClientSession(): void {
  Cookies.remove(COOKIE_NAME);
}



"use client";

/**
 * Client session utilities
 * Uses js-cookie for client-side cookie read/write.
 */

import Cookies from "js-cookie";
import type { Session } from "@/types";

const COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "landrup_session";

export function getClientSession(): Session | null {
  const raw = Cookies.get(COOKIE_NAME);
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as Session;
  } catch {
    return null;
  }
}

export function setClientSession(session: Session, remember: boolean): void {
  const encoded = btoa(JSON.stringify(session));
  if (remember) {
    // 30 dage
    Cookies.set(COOKIE_NAME, encoded, { expires: 30, sameSite: "strict" });
  } else {
    // Session cookie (expires when browser closes)
    Cookies.set(COOKIE_NAME, encoded, { sameSite: "strict" });
  }
}

export function clearClientSession(): void {
  Cookies.remove(COOKIE_NAME);
}
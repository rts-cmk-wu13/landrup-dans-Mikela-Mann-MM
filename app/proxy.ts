

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "landrup_session";

const PROTECTED_PATHS = ["/aktiviteter", "/profil"];
const AUTH_PATHS      = ["/login", "/opret-bruger"];
const INSTRUCTOR_PATHS = ["/aktiviteter/opret", "/rediger"];

function getSession(req: NextRequest) {
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as { role: string };
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session    = getSession(req);
  const isLoggedIn = Boolean(session);

  // Redirect loggede brugere væk fra auth-sider → aktiviteter
  if (isLoggedIn && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/aktiviteter", req.url));
  }

  // Redirect ikke-loggede brugere fra beskyttede sider → login
  if (!isLoggedIn && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect ikke-instruktører fra instruktør-sider → profil
  if (
    isLoggedIn &&
    INSTRUCTOR_PATHS.some((p) => pathname.includes(p)) &&
    session?.role !== "instructor" &&
    session?.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/profil", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/opret-bruger",
    "/aktiviteter/:path*",
    "/profil/:path*",
  ],
};
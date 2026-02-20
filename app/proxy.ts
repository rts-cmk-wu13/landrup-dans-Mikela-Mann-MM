

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "landrup_session";

const PROTECTED_PATHS = ["/activities", "/profile"];
const AUTH_PATHS = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(COOKIE_NAME)?.value;
  const isLoggedIn = Boolean(session);

  // Redirect logged-in users away from auth pages → activities
  if (isLoggedIn && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/activities", req.url));
  }

  // Redirect unauthenticated users from protected pages → login
  // Note: activities list is public, but profile requires auth
  if (!isLoggedIn && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/profile/:path*"],
};
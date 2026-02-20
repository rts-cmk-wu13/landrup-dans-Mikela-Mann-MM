

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginUser } from "@/lib/api";

export type LoginState = {
  values: { username: string; password: string };
  errors: { username?: string; password?: string; general?: string };
};

const COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "landrup_session";

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const rememberMe = formData.get("rememberMe") === "on";

  // Validering
  const errors: LoginState["errors"] = {};
  if (!username.trim()) errors.username = "Brugernavn er påkrævet";
  if (!password) errors.password = "Adgangskode er påkrævet";
  if (Object.keys(errors).length) {
    return { values: { username, password }, errors };
  }

  // API-kald
  let role: string;
  try {
    const auth = await loginUser(username, password);

    const encoded = btoa(
      JSON.stringify({ userId: auth.userId, token: auth.token, role: auth.role })
    );

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, encoded, {
      httpOnly: true,       // JavaScript kan ikke læse den
      sameSite: "strict",
      path: "/",
      ...(rememberMe
        ? { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 dage
        : {}),
    });

    role = auth.role;
  } catch {
    return {
      values: { username, password },
      errors: { general: "Forkert brugernavn eller adgangskode" },
    };
  }

  // Redirect skal være udenfor try/catch
  redirect(role === "default" ? "/aktiviteter" : "/profil");
}
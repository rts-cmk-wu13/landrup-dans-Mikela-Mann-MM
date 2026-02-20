

"use server";

import { clearSession } from "@/lib/dal";
import { redirect } from "next/navigation";

export async function logout() {
  await clearSession();
  redirect("/");
}
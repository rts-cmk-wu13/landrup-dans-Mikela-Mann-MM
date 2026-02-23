

"use server";

import { deleteActivity } from "@/lib/api";
import { getSession } from "@/lib/dal";
import { redirect } from "next/navigation";

export async function deleteActivityAction(id: number): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) redirect("/login");

  try {
    await deleteActivity(id, session.token);
  } catch {
    return { error: "Kunne ikke slette aktiviteten. Prøv igen." };
  }

  return {};
}
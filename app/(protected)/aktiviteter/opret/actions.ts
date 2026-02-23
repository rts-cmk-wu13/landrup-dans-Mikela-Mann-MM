

"use server";

import { redirect } from "next/navigation";
import { createActivity } from "@/lib/api";
import { getSession } from "@/lib/dal";
import type { CreateActivityPayload } from "@/types";

export async function createActivityAction(formData: FormData): Promise<{ error?: string }> {
  const session = await getSession();
  console.log("=== createActivityAction ===");
  console.log("session:", session);
  if (!session) redirect("/login");

  const payload: CreateActivityPayload = {
    name:            String(formData.get("name") ?? ""),
    description:     String(formData.get("description") ?? ""),
    weekday:         String(formData.get("weekday") ?? ""),
    time:            String(formData.get("time") ?? ""),
    minAge:          Number(formData.get("minAge")),
    maxAge:          Number(formData.get("maxAge")),
    maxParticipants: Number(formData.get("maxParticipants")),
    file:            (formData.get("file") as File)?.size > 0
                       ? (formData.get("file") as File)
                       : undefined,
  };

  try {
    await createActivity(payload, session.token);
  } catch {
    return { error: "Noget gik galt. Prøv igen." };
  }

  redirect("/profil");
}
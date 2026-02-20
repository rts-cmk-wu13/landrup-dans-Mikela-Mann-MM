

"use server";

import { enrollInActivity, leaveActivity } from "@/lib/api";
import { getServerSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function enrollAction(activityId: number) {
  const session = await getServerSession();
  if (!session) return { error: "Ikke logget ind" };
  try {
    await enrollInActivity(session.userId, activityId, session.token);
    revalidatePath(`/activities/${activityId}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("age")) return { error: "Du opfylder ikke alderskravet." };
    if (msg.includes("weekday")) return { error: "Du er allerede tilmeldt en aktivitet denne ugedag." };
    return { error: "Tilmelding mislykkedes. Prøv igen." };
  }
}

export async function leaveAction(activityId: number) {
  const session = await getServerSession();
  if (!session) return { error: "Ikke logget ind" };
  try {
    await leaveActivity(session.userId, activityId, session.token);
    revalidatePath(`/activities/${activityId}`);
    return { success: true };
  } catch {
    return { error: "Noget gik galt. Prøv igen." };
  }
}
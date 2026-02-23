

"use server";

import { enrollInActivity, leaveActivity, getActivity, getUser } from "@/lib/api";
import { getSession } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function enrollAction(activityId: number) {
  const session = await getSession();
  if (!session) return { error: "Ikke logget ind" };

  try {
    const [targetActivity, user] = await Promise.all([
      getActivity(activityId),
      getUser(session.userId, session.token),
    ]);

     // Alderstjek
    const userAge = user.age ?? 0;
    if (userAge < targetActivity.minAge || userAge > targetActivity.maxAge) {
      return { error: `Du skal være mellem ${targetActivity.minAge} og ${targetActivity.maxAge} år for at tilmelde dig dette hold.` };
    }

     // Ugedagstjek
    const alreadyOnDay = (user.activities ?? []).some(
      (a) => a.weekday?.toLowerCase() === targetActivity.weekday?.toLowerCase()
    );
    if (alreadyOnDay) {
      return { error: "Du er allerede tilmeldt et hold på denne ugedag." };
    }

    await enrollInActivity(session.userId, activityId, session.token);
    revalidatePath(`/aktiviteter/${activityId}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.toLowerCase().includes("age")) return { error: "Du opfylder ikke alderskravet." };
    return { error: "Tilmelding mislykkedes. Prøv igen." };
  }
}

export async function leaveAction(activityId: number) {
  const session = await getSession();
  if (!session) return { error: "Ikke logget ind" };

  try {
    await leaveActivity(session.userId, activityId, session.token);
    revalidatePath(`/aktiviteter/${activityId}`);
    return { success: true };
  } catch (err) {
    console.log("leaveAction error:", err);
    return { error: "Noget gik galt. Prøv igen." };
  }
}
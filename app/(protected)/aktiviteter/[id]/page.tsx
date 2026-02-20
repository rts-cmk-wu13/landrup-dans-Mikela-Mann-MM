

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getActivity, enrollInActivity, leaveActivity, getAssetUrl } from "@/lib/api";
import { getClientSession } from "@/lib/session";
import { reportError } from "@/lib/reportError";
import type { Activity, Session } from "@/types";

export default function ActivityDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [error, setError] = useState("");

useEffect(() => {
    const s = getClientSession();
    setSession(s);
    getActivity(Number(id))
      .then((a) => {
        setActivity(a);
        if (s && a.users) setEnrolled(a.users.some((u) => u.id === s.userId));
      })
      .catch((err) => reportError(err, { page: "activity-detail", id }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!session || !activity) return;
    setEnrollLoading(true);
    setError("");
    try {
      await enrollInActivity(session.userId, activity.id, session.token);
      setEnrolled(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("age") || msg.includes("alder"))
        setError("Du opfylder ikke alderskravet for denne aktivitet.");
      else if (msg.includes("weekday") || msg.includes("ugedag"))
        setError("Du er allerede tilmeldt en aktivitet på denne ugedag.");
      else {
        setError("Tilmelding mislykkedes. Prøv igen.");
        reportError(err, { userId: session.userId, activityId: activity.id });
      }
    } finally {
      setEnrollLoading(false);
    }
  };

    const handleLeave = async () => {
    if (!session || !activity) return;
    setEnrollLoading(true);
    setError("");
    try {
      await leaveActivity(session.userId, activity.id, session.token);
      setEnrolled(false);
    } catch (err) {
      setError("Noget gik galt. Prøv igen.");
      reportError(err, { userId: session.userId, activityId: activity.id });
    } finally {
      setEnrollLoading(false);
    }
  };

  const imageUrl = getAssetUrl(activity?.asset?.filename);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <main className="page-content">
        <div className="h-[55vh] bg-brand-mid opacity-40" />
        <div className="flex flex-col gap-3 p-5">
          <div className="h-[1.625rem] w-3/5 rounded bg-grey-light opacity-30" />
          <div className="h-4 w-[30%] rounded bg-grey-light opacity-20" />
        </div>
      </main>
    );
  }

  // ── Not found ──
  if (!activity) {
    return (
      <main className="page-content px-5 pt-10">
        <p className="text-sm text-grey-mid">Aktiviteten blev ikke fundet.</p>
      </main>
    );
  }

  return (
    <main className="page-content">

      {/* ── Hero image ── */}
      <div className="relative h-[55vh]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={activity.name}
            fill
            className="object-cover"
            sizes="26.875rem"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-dark to-brand-mid" />
        )}

        {/* Back button */}
        <button
          onClick={() => router.back()}
          aria-label="Tilbage"
          className="absolute left-4 top-4 flex items-center justify-center rounded-full bg-black/40 p-2 text-white border-none cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Enroll / Leave button */}
        {session?.role === "default" && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-5">
            <button
              onClick={enrolled ? handleLeave : handleEnroll}
              disabled={enrollLoading}
              className={`
                bg-brand-dark text-white font-medium text-md font-sans
                px-14 py-[0.875rem] rounded-lg border-none transition-opacity
                ${enrollLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {enrollLoading ? "…" : enrolled ? "Forlad" : "Tilmeld"}
            </button>
          </div>
        )}
      </div>

      {/* ── Text content ── */}
      <div className="bg-white px-5 pt-5 pb-8">
        <h1 className="font-sans text-lg font-medium text-black mb-1">
          {activity.name}
        </h1>

        <p className="text-body text-grey-dark mb-4">
          {activity.minAge}+ år
        </p>

        {error && (
          <p className="text-xs text-red-600 mb-3" role="alert">
            {error}
          </p>
        )}

        <p className="font-sans text-body text-grey-dark">
          {activity.description}
        </p>

        {activity.trainer && (
          <p className="mt-4 text-sm text-grey-mid">
            Instruktør: {activity.trainer.firstname} {activity.trainer.lastname}
          </p>
        )}

        <p className="mt-[0.3rem] text-sm text-grey-mid">
          {activity.weekday} kl. {activity.time}
        </p>
      </div>
    </main>
  );
}

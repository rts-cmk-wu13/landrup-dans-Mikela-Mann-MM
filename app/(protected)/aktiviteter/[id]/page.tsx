

import { notFound } from "next/navigation";
import Image from "next/image";
import { getActivity } from "@/lib/api";
import { getSession } from "@/lib/dal";
import EnrollButton from "@/components/activities/EnrollButton";
import BackButton from "@/components/ui/BackButton";
import { enrollAction, leaveAction } from "./actions";
import type { ActivityDetailPageProps } from "@/types";

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const session = await getSession();
  const activity = await getActivity(Number(id)).catch(() => null);
  if (!activity) notFound();

  const isEnrolled = session
    ? (activity.users ?? []).some((u) => u.id === session.userId)
    : false;

  const imageUrl = activity.asset?.url;

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
          <div className="h-full w-full bg-gradient-to-br from-(--brand-dark) to-(--brand-mid)" />
        )}

        <BackButton />

        {/* Knap overlapper bunden af billedet */}
        {session?.role === "default" && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-10">
            <EnrollButton
              activityId={activity.id}
              initialEnrolled={isEnrolled}
              onEnroll={enrollAction}
              onLeave={leaveAction}
            />
          </div>
        )}
      </div>

      {/* ── Text content ── */}
      <div className="px-5 pb-8"
        style={{ paddingTop: session?.role === "default" ? "2.5rem" : "1.25rem" }}
      >
        <h1 className="text-xl font-medium text-white mb-1">
          {activity.name}
        </h1>

        <p className="text-sm text-white mb-4 pb-4">
          {activity.minAge}+ år
        </p>

        <p className="text-sm leading-relaxed text-white pb-4">
          {activity.description}
        </p>

        <p className="mt-3 text-sm text-white text-center pt-3">
          {activity.weekday} kl. {activity.time}
        </p>
      </div>

    </main>
  );
}
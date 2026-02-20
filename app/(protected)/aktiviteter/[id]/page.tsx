

import { notFound } from "next/navigation";
import Image from "next/image";
import { getActivity, getAssetUrl } from "@/lib/api";
import { getSession } from "@/lib/dal";
import EnrollButton from "@/components/activities/EnrollButton";
import BackButton from "@/components/ui/BackButton"
import { enrollAction, leaveAction } from "./actions";
import { ActivityDetailPageProps } from "@/types";

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const session = await getSession();
  const activity = await getActivity(Number(id)).catch(() => null);
  if (!activity) notFound();

  const isEnrolled = session
    ? (activity.users ?? []).some((u) => u.id === session.userId)
    : false;

  const imageUrl = getAssetUrl(activity.asset?.filename);

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

        <BackButton />

        {session?.role === "default" && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-5">
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
      <div className="bg-white px-5 pt-5 pb-8">
        <h1 className="font-sans text-lg font-medium text-black mb-1">
          {activity.name}
        </h1>

        <p className="text-body text-grey-dark mb-4">
          {activity.minAge}+ år
        </p>

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
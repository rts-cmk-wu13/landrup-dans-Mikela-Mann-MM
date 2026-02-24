

import Link from "next/link";
import Image from "next/image";
import type { ActivityProbs } from "@/types";

export default function ActivityCard({ activity }: ActivityProbs) {
    const imageUrl = activity.asset?.url;

    return (
        <Link href={`/aktiviteter/${activity.id}`} className="activity-card">
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={activity.name}
                    fill
                    className="object-cover"
                    sizes="26.875rem"
                />
            ) : (
                <div className="w-full h-full bg-linear-to-br from-(--brand-dark) to-(--brand-mid)" />
            )}

            {/* Bottom panel overlay */}
            <div className="absolute bottom-0 left-0 right-0 mx-2 mb-2 px-4 py-4 rounded-2xl bg-(--brand-dark)/80 backdrop-blur-sm">
                <h3 className="font-semibold text-[1.0625rem] text-white leading-[1.3]">
                    {activity.name}
                </h3>
                <p className="text-sm text-white/60 mt-1">
                    {activity.weekday} kl. {activity.time}
                </p>
            </div>
        </Link>
    );
}
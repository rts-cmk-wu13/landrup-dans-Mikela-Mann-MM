

import Link from "next/link";
import Image from "next/image";
import type { ActivityProbs } from "@/types";
import { getAssetUrl } from "@/lib/api";


export default function ActivityCard({ activity }: ActivityProbs) {
    const imageUrl = getAssetUrl(activity.asset?.filename);

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
            <div className="activity-card-label">
                <h3 className="font-medium text-[1.0625rem] text-(--white) leading-[1.3]">
                    {activity.name}
                </h3>
                <p className="text-sm text-(--grey-mid) mt-0.75]">
                    {activity.weekday} kl. {activity.time}
                </p>
            </div>
        </Link>
    );
}
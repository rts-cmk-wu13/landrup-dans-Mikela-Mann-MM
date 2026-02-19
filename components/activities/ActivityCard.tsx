

import Link from "next/link";
import Image from "next/image";
import type { ActivityProbs} from "@/types";
import { getAssetUrl } from "@/lib/api";


export default function ActivityCard({ activity }: ActivityProbs) {
    const imageUrl = getAssetUrl(activity.asset?.filename);

    return (
        <Link href={`/activities/${activity.id}`} className="activity-card">
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={activity.name}
                    fill
                    className="object-cover"
                    sizes="26.875rem"
                />
            ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--brand-dark), var(--brand-mid))" }} />
            )}
            <div className="activity-card-label">
                <h3 style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "1.0625rem",   /* 17px */
                    color: "#FFFFFF",
                    lineHeight: 1.3,
                }}>
                    {activity.name}
                </h3>
                <p style={{
                    fontSize: "0.875rem",    /* 14px */
                    color: "#999999",
                    marginTop: "0.1875rem",  /* 3px */
                }}>
                    {activity.weekday} kl. {activity.time}
                </p>
            </div>
        </Link>
    );
}


import Image from "next/image";
import Link from "next/link";
import { getActivities } from "@/lib/api";
import type { Activity } from "@/types";

const ORDER = [10, 11, 12, 13];

export default async function ActivityTypes() {
  const activities: Activity[] = await getActivities();

  const byId = Object.fromEntries(activities.map((a) => [a.id, a]));

  const sorted = ORDER.map((id) => byId[id]).filter(Boolean);

  return (
    <section className="content-wrapper pt-3.5rem py-10">
      <h2 className="text-2xl font-bold text-white mb-8 pb-5">Vores holdtyper</h2>
      <div className="space-y-2.5625rem">
        {sorted.map((activity) => (
          <Link key={activity.id} href={`/aktiviteter/${activity.id}`} className="block group">
            <h3 className="text-lg font-semibold text-white mb-2 pb-2">
              {activity.name}
            </h3>
            {activity.asset?.url && (
              <div className="relative h-48 overflow-hidden mb-3">
                <Image
                  src={activity.asset.url}
                  alt={activity.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="430px"
                />
              </div>
            )}
            <p className="text-white/65 text-sm leading-relaxed pt-3 pb-4">
              {activity.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
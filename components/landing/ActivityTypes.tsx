import Image from "next/image";
import { getActivities } from "@/lib/api";
import type { Activity } from "@/types";

export default async function ActivityTypes() {
  const activities: Activity[] = await getActivities();

  return (
    <section className="px-6 py-10 bg-white">
      <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">
        Vores holdtyper
      </h2>
      <div className="space-y-8">
        {activities.map((activity) => (
          <div key={activity.id}>
            <h3 className="font-display text-xl font-bold text-brand-dark mb-3">
              {activity.name}
            </h3>
            {activity.asset?.url && (
              <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                <Image
                  src={activity.asset.url}
                  alt={activity.name}
                  fill
                  className="object-cover"
                  sizes="430px"
                />
              </div>
            )}
            <p className="text-gray-600 text-sm leading-relaxed">
              {activity.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
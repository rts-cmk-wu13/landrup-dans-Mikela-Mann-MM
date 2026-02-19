

"use client";

import { useState, useEffect, useMemo } from "react";
import ActivityCard from "@/components/activities/ActivityCard";
import SearchBar from "@/components/ui/SearchBar";
import type { Activity } from "@/types";
import { getActivities } from "@/lib/api"
import { reportError } from "@/lib/reportError";

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActivities()
            .then(setActivities)
            .catch((err) => reportError(err, { page: "activities" }))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        if(!search.trim()) return activities;
        const q = search.toLowerCase();
        return activities.filter(
            (a) => 
                a.name.toLowerCase().includes(q) ||
                a.weekday.toLowerCase().includes(q) ||
                a.trainer?.firstname?.toLowerCase().includes(q) ||
                a.trainer?.lastname?.toLowerCase().includes(q) 
        );
    }, [activities, search]); 

    return (
        <main className="page-content">
            <div className="sticky top-0 z-40 bg-[var(--brand-dark)] px-4 pt-4 pb-3">
                <SearchBar value={search} onChange={setSearch} />
            </div>

            <div className="px-4 pt-3">
                <h1 className="text-[1.875rem] font-medium text-white mb-4">Aktiviteter</h1>

                {loading && (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[13.75rem] rounded-2xl bg-[var(--brand-mid)] opacity-40" />
                        ))}
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <p className="text-[var(--grey-mid)] text-sm text-center mt-10 leading-relaxed">
                        Der blev ikke fundet nogle aktiviteter.
                        <br />
                        Prøv at søge efter noget andet.
                    </p>
                )}

                {!loading && filtered.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {filtered.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
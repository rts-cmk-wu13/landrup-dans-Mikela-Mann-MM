

"use client";

import { useState, useEffect, useMemo } from "react";
import ActivityCard from "@/components/activities/ActivityCard";
import SearchBar from "@/components/ui/SearchBar";
import { getActivities } from "@/lib/api";
import { reportError } from "@/lib/reportError";
import type { Activity } from "@/types";

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
    if (!search.trim()) return activities;
    const q = search.toLowerCase();
    return activities.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.weekday.toLowerCase().includes(q) ||
        false // instruktørnavn ikke tilgængeligt i list-endpoint
    );
  }, [activities, search]);

  return (
    <main className="page-content">
      {/* Sticky search header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backgroundColor: "#003147",
        padding: "1rem 1rem 0.75rem",
      }}>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div style={{ padding: "0.75rem 1rem 0" }}>
        <h1 style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.875rem",    /* 30px */
          fontWeight: 500,
          color: "#FFFFFF",
          marginBottom: "1rem",
        }}>
          Aktiviteter
        </h1>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: "13.75rem", borderRadius: "1rem", backgroundColor: "#0d5078", opacity: 0.4 }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{
            color: "#999999",
            fontSize: "0.875rem",
            textAlign: "center",
            marginTop: "2.5rem",
            fontFamily: "var(--font-body)",
            lineHeight: 1.6,
          }}>
            Der blev ikke fundet nogle aktiviteter.
            <br />
            Prøv at søge efter noget andet.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
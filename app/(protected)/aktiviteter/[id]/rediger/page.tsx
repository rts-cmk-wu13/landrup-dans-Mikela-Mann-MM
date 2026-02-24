

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { getActivity } from "@/lib/api";
import { reportError } from "@/lib/reportError";
import { updateActivityAction } from "./actions";
import FormError from "@/components/ui/FormError";

const WEEKDAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

export default function EditActivityPage() {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [defaults, setDefaults] = useState({
    name: "", description: "", weekday: "", time: "",
    minAge: "", maxAge: "", maxParticipants: "",
  });

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => {
      if (file) formData.set("file", file);
      return updateActivityAction(Number(id), formData);
    },
    {}
  );

  useEffect(() => {
    getActivity(Number(id))
      .then((a) => {
        setDefaults({
          name: a.name ?? "",
          description: a.description ?? "",
          weekday: a.weekday ?? "",
          time: a.time ?? "",
          minAge: String(a.minAge ?? ""),
          maxAge: String(a.maxAge ?? ""),
          maxParticipants: String(a.maxParticipants ?? ""),
        });
      })
      .catch((err) => reportError(err, { page: "rediger", id }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="page-content bg-(--brand-dark) min-h-screen px-4 pt-8">
        <div className="h-7 w-3/5 bg-(--grey-light) rounded opacity-20 mb-6" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-(--grey-light) rounded-lg opacity-15 mb-3" />
        ))}
      </main>
    );
  }

  return (
    <main className="page-content bg-(--brand-dark) min-h-screen px-4 pt-8 pb-10">
      <h1 className="text-white text-3xl font-medium mb-6">
        Rediger hold
      </h1>

      <form action={formAction} noValidate className="flex flex-col gap-3">

        <div>
          <input className="form-input" name="name" placeholder="Holdnavn" defaultValue={defaults.name} />
        </div>

        <div>
          <textarea
            className="form-input resize-none"
            style={{ minHeight: "7.5rem" }}
            name="description"
            placeholder="Beskrivelse"
            defaultValue={defaults.description}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <select className="form-input" name="weekday" defaultValue={defaults.weekday}>
              <option value="">Ugedag</option>
              {WEEKDAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <input className="form-input" type="time" name="time" defaultValue={defaults.time} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input className="form-input" type="number" min={0} name="minAge" placeholder="Alder (min.)" defaultValue={defaults.minAge} />
          </div>
          <div>
            <input className="form-input" type="number" min={0} name="maxAge" placeholder="Alder (max.)" defaultValue={defaults.maxAge} />
          </div>
        </div>

        <div>
          <input className="form-input" type="number" min={1} name="maxParticipants" placeholder="Deltagere (max.)" defaultValue={defaults.maxParticipants} />
        </div>

        <div>
          <p className="text-white text-sm mb-2">
            Billede (valgfrit — erstatter eksisterende):
          </p>
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 bg-(--grey-light) rounded text-sm text-(--brand-dark) cursor-pointer whitespace-nowrap">
              Gennemse...
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-(--grey-mid) text-sm">
              {file ? file.name : "Ingen fil valgt"}
            </span>
          </div>
        </div>

        <FormError message={state?.error} />

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={() => history.back()}
            className="py-4 rounded-xl font-medium text-(--grey-mid) border border-(--grey-mid) bg-transparent"
          >
            Annuller
          </button>
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? "Gemmer…" : "Gem ændringer"}
          </button>
        </div>

      </form>
    </main>
  );
}
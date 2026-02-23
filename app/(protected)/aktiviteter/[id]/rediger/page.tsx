

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActivity, updateActivity } from "@/lib/api";
import { getClientSession } from "@/lib/session";
import { reportError } from "@/lib/reportError";
import FormError from "@/components/ui/FormError";
import type { CreateActivityPayload } from "@/types";

const WEEKDAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

interface Errors {
  name?: string;
  description?: string;
  weekday?: string;
  time?: string;
  minAge?: string;
  maxAge?: string;
  maxParticipants?: string;
  general?: string;
}

export default function EditActivityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    weekday: "",
    time: "",
    minAge: "",
    maxAge: "",
    maxParticipants: "",
    file: null as File | null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (!session || (session.role !== "instructor" && session.role !== "admin")) {
      router.replace("/profil");
      return;
    }

    getActivity(Number(id))
      .then((activity) => {
        setForm({
          name:            activity.name ?? "",
          description:     activity.description ?? "",
          weekday:         activity.weekday ?? "",
          time:            activity.time ?? "",
          minAge:          String(activity.minAge ?? ""),
          maxAge:          String(activity.maxAge ?? ""),
          maxParticipants: String(activity.maxParticipants ?? ""),
          file:            null,
        });
      })
      .catch((err) => {
        reportError(err, { page: "edit-activity", id });
        setErrors({ general: "Kunne ikke hente aktiviteten. Prøv igen." });
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim())        e.name = "Holdnavn er påkrævet";
    if (!form.description.trim()) e.description = "Beskrivelse er påkrævet";
    if (!form.weekday)            e.weekday = "Vælg en ugedag";
    if (!form.time.trim())        e.time = "Tidspunkt er påkrævet";
    if (!form.minAge)             e.minAge = "Min. alder er påkrævet";
    if (!form.maxAge)             e.maxAge = "Max. alder er påkrævet";
    if (form.minAge && form.maxAge && Number(form.minAge) > Number(form.maxAge))
      e.maxAge = "Max. skal være højere end min.";
    if (!form.maxParticipants)    e.maxParticipants = "Max. deltagere er påkrævet";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);

    try {
      const session = getClientSession();
      if (!session) { router.replace("/login"); return; }

      const payload: Partial<CreateActivityPayload> = {
        name:            form.name,
        description:     form.description,
        weekday:         form.weekday,
        time:            form.time,
        minAge:          Number(form.minAge),
        maxAge:          Number(form.maxAge),
        maxParticipants: Number(form.maxParticipants),
        file:            form.file ?? undefined,
      };

      await updateActivity(Number(id), payload, session.token);
      router.push("/profil");
    } catch (err) {
      reportError(err, { page: "edit-activity", id });
      setErrors({ general: "Noget gik galt. Prøv igen." });
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

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

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">

        <div>
          <input className="form-input" placeholder="Holdnavn" value={form.name} onChange={set("name")} />
          <FormError message={errors.name} />
        </div>

        <div>
          <textarea
            className="form-input resize-none"
            style={{ minHeight: "7.5rem" }}
            placeholder="Beskrivelse"
            value={form.description}
            onChange={set("description")}
          />
          <FormError message={errors.description} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <select className="form-input" value={form.weekday} onChange={set("weekday")}>
              <option value="">Ugedag</option>
              {WEEKDAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <FormError message={errors.weekday} />
          </div>
          <div>
            <input className="form-input" type="time" value={form.time} onChange={set("time")} />
            <FormError message={errors.time} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input className="form-input" type="number" min={0} placeholder="Alder (min.)" value={form.minAge} onChange={set("minAge")} />
            <FormError message={errors.minAge} />
          </div>
          <div>
            <input className="form-input" type="number" min={0} placeholder="Alder (max.)" value={form.maxAge} onChange={set("maxAge")} />
            <FormError message={errors.maxAge} />
          </div>
        </div>

        <div>
          <input className="form-input" type="number" min={1} placeholder="Deltagere (max.)" value={form.maxParticipants} onChange={set("maxParticipants")} />
          <FormError message={errors.maxParticipants} />
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
                onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
              />
            </label>
            <span className="text-(--grey-mid) text-sm">
              {form.file ? form.file.name : "Ingen fil valgt"}
            </span>
          </div>
        </div>

        <FormError message={errors.general} />

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="py-4 rounded-xl font-medium text-(--grey-mid) border border-(--grey-mid) bg-transparent"
          >
            Annuller
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? "Gemmer…" : "Gem ændringer"}
          </button>
        </div>

      </form>
    </main>
  );
}
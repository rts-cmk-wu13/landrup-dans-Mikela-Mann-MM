

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientSession } from "@/lib/session";
import { createActivity } from "@/lib/api";
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

export default function CreateActivityPage() {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (!session || (session.role !== "instructor" && session.role !== "admin")) {
      router.replace("/profil");
    }
  }, [router]);

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
    setLoading(true);

    try {
      const session = getClientSession();
      if (!session) { router.replace("/login"); return; }

      const payload: CreateActivityPayload = {
        name:            form.name,
        description:     form.description,
        weekday:         form.weekday,
        time:            form.time,
        minAge:          Number(form.minAge),
        maxAge:          Number(form.maxAge),
        maxParticipants: Number(form.maxParticipants),
        file:            form.file ?? undefined,
      };

      await createActivity(payload, session.token);
      router.push("/profil");
    } catch (err) {
      reportError(err, { page: "opret-hold" });
      setErrors({ general: "Noget gik galt. Prøv igen." });
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <main className="page-content bg-(--brand-dark) min-h-screen px-4 pt-8 pb-10">
      <h1 className="text-white text-3xl font-medium mb-6">
        Opret hold
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            {/* Instruktør tildeles automatisk via token — dropdown er dekorativ */}
            <select className="form-input opacity-60" disabled>
              <option>Instruktør</option>
            </select>
          </div>
          <div>
            <input className="form-input" type="number" min={1} placeholder="Deltagere (max.)" value={form.maxParticipants} onChange={set("maxParticipants")} />
            <FormError message={errors.maxParticipants} />
          </div>
        </div>

        <div>
          <p className="text-white text-sm mb-2">Billede:</p>
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

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Opretter…" : "Opret hold"}
        </button>

      </form>
    </main>
  );
}
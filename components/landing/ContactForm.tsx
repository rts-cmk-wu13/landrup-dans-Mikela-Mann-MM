

"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api"; 
import { reportError } from "@/lib/reportError";
import FormError from "@/components/ui/FormError";
import { ContactFormErrors } from "@/types";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): ContactFormErrors => {
    const e: ContactFormErrors = {};
    if (!form.name.trim()) e.name = "Navn er påkrævet";
    if (!form.email.trim()) e.email = "E-mail er påkrævet";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Ugyldig e-mail";
    if (!form.message.trim()) e.message = "Besked er påkrævet";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await submitContact(form);
      setSuccess(true);
    } catch (err) {
      reportError(err, { form });
      setErrors({ general: "Noget gik galt. Prøv igen." });
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (success) {
    return (
      <section className="px-6 py-10 bg-white">
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Kontakt os</h2>
        <p className="text-green-600 font-medium text-sm">✓ Tak for din besked! Vi vender tilbage snart.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 bg-white">
      <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">Kontakt os</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div>
          <input className="form-input" placeholder="Navn" value={form.name} onChange={set("name")} />
          <FormError message={errors.name} />
        </div>
        <div>
          <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={set("email")} />
          <FormError message={errors.email} />
        </div>
        <div>
          <textarea
            className="form-input resize-none"
            placeholder="Besked"
            rows={4}
            value={form.message}
            onChange={set("message")}
          />
          <FormError message={errors.message} />
        </div>
        <FormError message={errors.general} />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Sender…" : "Send besked"}
        </button>
      </form>
    </section>
  );
}
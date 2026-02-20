

"use client";

import { useState } from "react";
import { submitNewsletter } from "@/lib/api";
import { reportError } from "@/lib/reportError";
import FormError from "@/components/ui/FormError";  

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return "E-mail er påkrævet";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Indtast en gyldig e-mail";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await submitNewsletter({ email });
      setSuccess(true);
    } catch (err) {
      reportError(err, { email });
      setError("Noget gik galt. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="px-6 py-10 bg-white">
        <h2 className="font-display text-2xl font-bold text-(--brand-dark) mb-2">
          Nyhedsbrev
        </h2>
        <p className="text-green-600 text-sm font-medium">
          ✓ Du er nu tilmeldt vores nyhedsbrev!
        </p>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 bg-white">
      <h2 className="font-display text-2xl font-bold text-(--brand-dark) mb-2">
        Nyhedsbrev
      </h2>
      <p className="text-gray-500 text-sm mb-5">
        Få direkte besked når vi har sæsonstart eller afholder arrangementer.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Din e-mail"
            className="form-input flex-1"
            aria-label="E-mail"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-auto px-5"
          >
            {loading ? "…" : "Tilmeld"}
          </button>
        </div>
        <FormError message={error} />
      </form>
    </section>
  );
}
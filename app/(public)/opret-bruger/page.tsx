


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";
import { reportError } from "@/lib/reportError";
import FormError from "@/components/ui/FormError";

interface Errors {
  firstname?: string;
  lastname?: string;
  username?: string;
  age?: string;
  password?: string;
  passwordConfirm?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    age: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.firstname.trim()) e.firstname = "Fornavn er påkrævet";
    if (!form.lastname.trim()) e.lastname = "Efternavn er påkrævet";
    if (!form.username.trim()) e.username = "Brugernavn er påkrævet";
    else if (form.username.length < 3)
      e.username = "Brugernavn skal være mindst 3 tegn";
    const age = Number(form.age);
    if (!form.age) e.age = "Alder er påkrævet";
    else if (isNaN(age) || age < 1 || age > 120)
      e.age = "Angiv en gyldig alder";
    if (!form.password) e.password = "Adgangskode er påkrævet";
    else if (form.password.length < 6)
      e.password = "Adgangskode skal være mindst 6 tegn";
    if (form.password !== form.passwordConfirm)
      e.passwordConfirm = "Adgangskoderne stemmer ikke overens";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await registerUser({
        firstname: form.firstname,
        lastname: form.lastname,
        username: form.username,
        age: Number(form.age),
        password: form.password,
        role: "default",
      });
      router.push("/login?registered=true");
    } catch (err) {
      reportError(err, { username: form.username });
      setErrors({ general: "Brugernavnet er allerede taget. Prøv et andet." });
    } finally {
      setLoading(false);
    }
  };

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-brand-dark">
      {/* Logo */}
      <div className="mb-8 text-center text-white">
        <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-3 mx-auto">
          <span className="font-display font-black text-2xl">LD</span>
        </div>
        <h1 className="font-display font-bold text-3xl leading-none tracking-wide uppercase">
          LANDRUP
          <br />
          DANS
        </h1>
        <div className="mt-2 border-b-2 border-white w-full" />
      </div>

      <div className="w-full">
        <h2 className="font-display text-2xl font-medium text-white mb-6">
          Opret bruger
        </h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div>
            <input className="form-input" placeholder="Fornavn" value={form.firstname} onChange={set("firstname")} autoComplete="given-name" />
            <FormError message={errors.firstname} />
          </div>
          <div>
            <input className="form-input" placeholder="Efternavn" value={form.lastname} onChange={set("lastname")} autoComplete="family-name" />
            <FormError message={errors.lastname} />
          </div>
          <div>
            <input className="form-input" placeholder="Brugernavn" value={form.username} onChange={set("username")} autoComplete="username" />
            <FormError message={errors.username} />
          </div>
          <div>
            <input className="form-input" type="number" placeholder="Alder" value={form.age} onChange={set("age")} min={1} max={120} />
            <FormError message={errors.age} />
          </div>
          <div>
            <input className="form-input" type="password" placeholder="Adgangskode" value={form.password} onChange={set("password")} autoComplete="new-password" />
            <FormError message={errors.password} />
          </div>
          <div>
            <input className="form-input" type="password" placeholder="Gentag adgangskode" value={form.passwordConfirm} onChange={set("passwordConfirm")} autoComplete="new-password" />
            <FormError message={errors.passwordConfirm} />
          </div>

          <FormError message={errors.general} />

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Opretter…" : "Log ind"}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-6">
          Har du allerede en konto?{" "}
          <Link href="/login" className="text-white underline">
            Log ind
          </Link>
        </p>
      </div>
    </main>
  );
}
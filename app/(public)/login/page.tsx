"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "./actions";
import FormError from "@/components/ui/FormError";

const initialState: LoginState = {
  values: { username: "", password: "" },
  errors: {},
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    initialState
  );

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-8 bg-(--brand-dark)">

      {/* ── Logo ── */}
      <div className="w-full mb-10">
        <div className="w-18 h-18 rounded-full border-2 border-white flex items-center justify-center mx-auto mb-4">
          <span className="font-bold text-[1.4rem] text-white --font-body">LD</span>
        </div>
        <p className="font-bold text-[2.25rem] leading-[1.05] text-white tracking-[0.04em] uppercase text-right --font-body">
          LANDRUP<br />DANS
        </p>
        <div className="border-b-2 border-white mt-2.5" />
      </div>

      {/* ── Form ── */}
      <div className="w-full">
        <h2 className="text-[1.75rem] font-normal text-white mb-5 --font-body">
          Log ind
        </h2>

        <form action={formAction} noValidate className="flex flex-col gap-3">
          <div>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Brugernavn"
              defaultValue={state.values.username}
              autoComplete="username"
            />
            <FormError message={state.errors.username} />
          </div>

          <div>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Adgangskode"
              autoComplete="current-password"
            />
            <FormError message={state.errors.password} />
          </div>

          <FormError message={state.errors.general} />

          <button type="submit" disabled={isPending} className="btn-primary mt-1">
            {isPending ? "Logger ind…" : "Log ind"}
          </button>
        </form>

        <p className="text-center text-(--grey-mid) text-sm mt-6 --font-body">
          Er du endnu ikke bruger?{" "}
          <Link href="/opret-bruger" className="text-white underline">
            Opret dig her.
          </Link>
        </p>

        <label className="flex items-center justify-center gap-2 mt-5 text-(--grey-mid) text-[0.8rem] cursor-pointer --font-body">
          <input type="checkbox" name="rememberMe" />
          Husk mig
        </label>
      </div>
    </main>
  );
}


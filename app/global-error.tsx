

"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="da">
      <body className="bg-(--brand-dark) min-h-screen flex flex-col items-center justify-center px-6 text-white">
        <h2 className="text-2xl font-bold mb-4">
          Noget gik galt
        </h2>
        <p className="text-(--grey-mid) text-sm mb-6 text-center">
          Vi beklager ulejligheden. Fejlen er blevet registreret.
        </p>
        <button onClick={reset} className="btn-primary max-w-50">
          Prøv igen
        </button>
      </body>
    </html>
  );
}
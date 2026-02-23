

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-(--brand-dark) text-white">
      <h1 className="font-display text-6xl font-black text-(--grey-mid) mb-4">
        404
      </h1>
      <p className="font-display text-xl font-bold mb-2">Siden blev ikke fundet</p>
      <p className="text-(--grey-mid) text-sm mb-8 text-center">
        Den side du leder efter eksisterer ikke.
      </p>
      <Link href="/aktiviteter" className="btn-primary max-w-50 text-center">
        Gå til aktiviteter
      </Link>
    </main>
  );
}


import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-dark text-white">
      <h1 className="font-display text-6xl font-black text-brand-muted mb-4">
        404
      </h1>
      <p className="font-display text-xl font-bold mb-2">Siden blev ikke fundet</p>
      <p className="text-brand-muted text-sm mb-8 text-center">
        Den side du leder efter eksisterer ikke.
      </p>
      <Link href="/activities" className="btn-primary max-w-[200px] text-center">
        Gå til aktiviteter
      </Link>
    </main>
  );
}
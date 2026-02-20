


import Image from "next/image";

export default function GlobalLoading() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-(--brand-dark)">

      {/* Logo */}
      <div className="w-18 h-18 rounded-full border-2 border-white flex items-center justify-center mb-6">
        <Image
          src="/logo/LD-logo.png"
          alt="Landrup Dans"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      {/* Spinner */}
      <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />

    </main>
  );
}
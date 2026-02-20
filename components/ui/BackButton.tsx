

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Tilbage"
      className="absolute left-4 top-4 flex items-center justify-center rounded-full bg-black/40 p-2 text-white border-none cursor-pointer"
    >
      <ArrowLeft size={20} />
    </button>
  );
}
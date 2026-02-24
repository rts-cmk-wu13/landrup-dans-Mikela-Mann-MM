

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TestimonialsCarouselProps } from "@/types";

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);

  if (!testimonials.length) return null;

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const t = testimonials[index];

  return (
    <section className="relative px-8 py-16 text-center text-white overflow-hidden">
      {/* Baggrundsbillede med opacity */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/detsigerkunderne.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center gap-8">
        <h2 className="font-display text-2xl font-bold leading-tight">
          Det siger vores<br />kunder om os
        </h2>

        <p className="text-base leading-relaxed">
          {t.content}
        </p>

        <div>
          <p className="font-display font-bold text-lg">{t.name}</p>
          {t.occupation && (
            <p className="text-sm text-white/70 mt-0.5">{t.occupation}</p>
          )}
        </div>

        {testimonials.length > 1 && (
          <div className="flex gap-4">
            <button
              onClick={prev}
              aria-label="Forrige"
              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Næste"
              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
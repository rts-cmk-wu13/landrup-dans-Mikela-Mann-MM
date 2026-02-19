

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
    <section className="px-6 py-10 bg-brand-card">
      <h2 className="font-display text-2xl font-bold text-brand-dark mb-6 text-center">
        Det siger vores kunder om os
      </h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-gray-700 text-sm leading-relaxed italic mb-4">
          &ldquo;{t.quote}&rdquo;
        </p>
        <p className="font-display font-semibold text-brand-dark">
          {t.author}
        </p>
        {t.title && (
          <p className="text-xs text-gray-500">{t.title}</p>
        )}
      </div>
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={prev}
            aria-label="Forrige"
            className="p-2 rounded-full bg-brand text-white hover:bg-brand-light transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Næste"
            className="p-2 rounded-full bg-brand text-white hover:bg-brand-light transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
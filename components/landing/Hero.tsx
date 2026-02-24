

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-205.75 flex flex-col items-center justify-end pb-12 overflow-hidden">
            {/* Baggrundsbillede */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/images/heroimg.jpg"
                    alt="Dansere"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="430px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            </div>

            {/* Logo */}
            <div className="absolute top-6 w-full px-6">
                {/* Ikon centreret */}
                <div className="flex justify-center mb-4 pb-8 pt-8">
                    <Image
                        src="/logo/LD-logo.png"
                        alt="LD logo"
                        width={64}
                        height={64}
                    />
                </div>
                {/* Tekst-logo til højre */}
                <div className="w-full text-right">
                    <Image
                        src="/logo/logo.png"
                        alt="Landrup Dans"
                        width={290}
                        height={62}
                        className="inline-block"
                    />
                </div>
                <div className="border-b-2 border-white mt-2.5 -mx-6" />
            </div>

            {/* CTA + pile */}
            <div className="flex flex-col items-center gap-4">
                <Link href="/login" className="btn-primary text-center" style={{ width: "15rem" }}>
                    Log ind her
                </Link>

                <div className="flex flex-col items-center -space-y-4">
                    <ChevronDown size={42} strokeWidth={1.5} style={{ color: "var(--brand-primary)" }} />
                    <ChevronDown size={42} strokeWidth={1.5} style={{ color: "var(--brand-primary)" }} />
                </div>
            </div>
        </section>
    );
}
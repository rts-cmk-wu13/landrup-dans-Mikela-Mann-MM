

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative min-h-[60vh] flex flex-col items-center justify-end pb-12 overflow-hidden">
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
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center text-white">
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-1 mx-auto">
                    <span className="font-display font-black text-lg">LD</span>
                </div>
                <p className="font-display font-bold text-sm tracking-widest uppercase">
                    Landrup Dans
                </p>
            </div>

            {/* CTA */}
            <Link href="/login" className="btn-primary max-w-[200px] text-center">
                Log ind her
            </Link>
        </section>
    );
}
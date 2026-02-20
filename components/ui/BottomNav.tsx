

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, User } from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Hjem", Icon: Home },
    { href: "/aktiviteter", label: "Aktiviteter", Icon: List },
    { href: "/profil", label: "Profil", Icon: User },
] as const;

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                   <Link
                        key={href}
                        href={href}
                        className={[
                            "flex flex-col items-center gap-[0.2rem]",
                            "text-[0.75rem] no-underline transition-colors duration-150",
                            active
                                ? "font-medium text-(--black)"
                                : "font-normal text-(--grey-dark)",
                        ].join(" ")}
                    >
                        <Icon
                            size={22}
                            strokeWidth={active ? 2.5 : 1.8}
                            color={active ? "var(--black)" : "var(--grey-dark)"}
                        />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
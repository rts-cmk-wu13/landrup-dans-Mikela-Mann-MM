

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, User } from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Hjem", Icon: Home },
    { href: "/activities", label: "Aktiviteter", Icon: List },
    { href: "/profile", label: "Profil", Icon: User },
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
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.2rem",
                            fontSize: "0.75rem",        /* 12px */
                            fontFamily: "var(--font-body)",
                            fontWeight: active ? 500 : 400,
                            textDecoration: "none",
                            /* active → #000000, inactive → #6F6F6F */
                            color: active ? "#000000" : "#6F6F6F",
                            transition: "color 0.15s",
                        }}
                    >
                        <Icon
                            size={22}  
                            strokeWidth={active ? 2.5 : 1.8}
                            color={active ? "#000000" : "#6F6F6F"}
                        />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
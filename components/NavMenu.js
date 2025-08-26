"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

const navItems = [
    {href: "/", label: "Projects", icon: "folder2"},
    {href: "/stats", label: "Stats", icon: "bar-chart"},
    {href: "/settings", label: "Settings", icon: "gear"},
];

export default function NavMenu() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
                const active =
                    item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"}`}
                    >
                        <i className={`bi bi-${item.icon}`}/>
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

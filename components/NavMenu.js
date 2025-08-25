"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavMenu() {
    const pathname = usePathname();

    return (
            <nav className={"w-10/12 flex justify-between gap-1 rounded-full py-[2px] px-[3px] bg-[#f9bcd1]"}>
                <Link href={"/"} className={"line-clamp-1 w-1/3 duration-300 flex justify-center items-center gap-2 py-1 rounded-full text-white" + (pathname === "/" ? " bg-[#ea377e] hover:bg-[#ea377e] " : " hover:bg-[#f79cbe] ")}>
                    <i className="bi bi-folder-fill"></i> Projects
                </Link>
                <Link href={"/stats"} className={"line-clamp-1 w-1/3 duration-300 flex justify-center items-center gap-2 py-1 rounded-full text-white" + (pathname === "/stats" ? " bg-[#ea377e] hover:bg-[#ea377e] " : " hover:bg-[#f79cbe] ")}>
                    <i className="bi bi-binoculars-fill"></i> Statistics
                </Link>
                <Link href={"/settings"} className={"line-clamp-1 w-1/3 duration-300 flex justify-center items-center gap-2 py-1 rounded-full text-white" + (pathname === "/settings" ? " bg-[#ea377e] hover:bg-[#ea377e] " : " hover:bg-[#f79cbe] ")}>
                    <i className="bi bi-gear-fill"></i> Settings (in development)
                </Link>
            </nav>
    );
}
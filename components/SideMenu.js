"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideMenu() {
    const pathname = usePathname();

    return (
        <div className={"flex flex-col justify-start items-start"}>
            <div className={"text-3xl font-bold text-[#ea377e]"}>Silent Loom</div>

            <hr className="w-[250px] border-t-2 border-[#ea377e] mb-10"/>

            <div id={"main"} className={"w-full flex flex-col justify-start items-start gap-2"}>
                <Link href={"/"} className={"w-full px-5 py-2 text-[#323232]" + (pathname === "/" ? " bg-[#ea377e] text-[#ffffff] rounded-xl " : " text-black hover:text-gray-500")}><i className="bi bi-briefcase-fill mr-2"></i> Projects list</Link>
                <Link href={"/settings"} className={"w-full px-5 py-2 text-[#323232]" + (pathname === "/settings" ? " bg-[#ea377e] text-[#ffffff] rounded-xl " : " text-black hover:text-gray-500")}><i className="bi bi-gear-fill mr-2"></i> Settings</Link>
            </div>
        </div>
    )
}
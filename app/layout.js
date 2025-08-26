import {Poppins} from "next/font/google";
import NavMenu from "@/components/NavMenu";
import ResizableSidebar from "@/components/ResizableSideBar";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

const globalNextFont = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata = {
    title: "Silent Loom",
    description: "Web panel for managing your private web projects.",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={`${globalNextFont.className} antialiased bg-zinc-50 text-zinc-900`}>
        <div className="flex min-h-screen">
            <ResizableSidebar>
                <div className="sticky top-6 text-2xl font-bold mb-8">Silent Loom</div>
                <NavMenu/>
            </ResizableSidebar>
            <main className="flex-1 p-10">{children}</main>
        </div>
        </body>
        </html>
    );
}

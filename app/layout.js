import { Poppins } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import SideMenu from "@/components/SideMenu";

const globalNextFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
    title: "Silent Loom",
    description: "Web panel for managing your private web projects."
};

export default function RootLayout({children}) {
    return (
        <html lang="fr">
            <body className={`${globalNextFont.className} antialiased`}>
            <div className={"w-screen min-h-screen flex items-start justify-between bg-white px-10 py-5"}>
                <div className={"w-[400px]"}>
                    <SideMenu />
                </div>
                {children}
            </div>
            </body>
        </html>
    );
}

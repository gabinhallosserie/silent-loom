import { Poppins } from "next/font/google";
import NavMenu from "@/components/NavMenu";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

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
            <body className={`${globalNextFont.className} antialiased m-0`}>
                <div className={"w-[calc(100dvw-100px)] min-h-[calc(100dvh-40px)] rounded-xl my-[20px] mx-auto flex flex-col items-center justify-start py-5 px-10 bg-purple-50"}>
                    <NavMenu />
                    {children}
                </div>
            </body>
        </html>
    );
}

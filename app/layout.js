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
            <body className={`${globalNextFont.className} antialiased my-5`}>
                <div className={"flex flex-col items-center justify-center"}>
                    <NavMenu />
                    {children}
                </div>
            </body>
        </html>
    );
}

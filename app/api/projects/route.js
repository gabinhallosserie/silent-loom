import path from "path";
import { NextResponse } from "next/server";
import { listDirectories, resolveSafe, dirSizeBytes } from "@/lib/fs";
import fs from "fs";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const base = process.env.BASE_PROJECTS_PATH;
        if (!base) throw new Error("BASE_PROJECTS_PATH non défini.");
        const { searchParams } = new URL(req.url);
        const withSizes = searchParams.get("withSizes") === "1";

        const dirs = listDirectories(base);
        const data = dirs.map((name) => {
            const full = resolveSafe(base, name);
            const nodeModules = path.join(full, "node_modules");
            const size =
                withSizes && fs.existsSync(nodeModules)
                    ? dirSizeBytes(nodeModules)
                    : 0;
            return {
                name,
                path: full,
                nodeModulesBytes: size,
            };
        });

        return NextResponse.json({ base, projects: data });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
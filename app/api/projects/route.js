import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import { listDirectories, resolveSafe, dirSizeBytes } from "@/lib/fs";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const base = process.env.BASE_PROJECTS_PATH;
        if (!base) throw new Error("BASE_PROJECTS_PATH non défini dans .env.local");

        const { searchParams } = new URL(req.url);
        const withSizes = searchParams.get("withSizes") === "1";

        const dirs = listDirectories(base);
        const data = dirs.map((name) => {
            const full = resolveSafe(base, name);
            const nodeModules = path.join(full, "node_modules");
            const hasNodeModules = fs.existsSync(nodeModules);
            const size = withSizes && hasNodeModules ? dirSizeBytes(nodeModules) : 0;
            return {
                name,
                path: full,
                hasNodeModules,
                nodeModulesBytes: size,
            };
        });

        return NextResponse.json({ base, projects: data });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

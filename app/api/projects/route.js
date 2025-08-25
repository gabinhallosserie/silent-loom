import path from "path";
import { NextResponse } from "next/server";
import { listDirectories, resolveSafe, dirSizeBytes } from "@/lib/fs";
import fs from "fs";
import { getBasePath } from "@/lib/config";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const base = getBasePath();
        if (!base) throw new Error("BASE_PROJECTS_PATH non défini dans config");

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

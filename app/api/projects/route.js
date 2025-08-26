import path from "path";
import fs from "fs";
import {NextResponse} from "next/server";
import {
    listDirectories,
    resolveSafe,
    dirSizeBytes,
    readDependencies,
} from "@/lib/fs";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const base = process.env.BASE_PROJECTS_PATH;
        if (!base)
            throw new Error("BASE_PROJECTS_PATH non défini dans .env.local");

        const {searchParams} = new URL(req.url);
        const withSizes = searchParams.get("withSizes") === "1";

        const dirs = listDirectories(base);
        const projects = dirs.map((name) => {
            const full = resolveSafe(base, name);
            const nodeModules = path.join(full, "node_modules");
            const hasNodeModules = fs.existsSync(nodeModules);
            const size =
                withSizes && hasNodeModules ? dirSizeBytes(nodeModules) : 0;
            const deps = readDependencies(full);

            return {
                name,
                path: full,
                hasNodeModules,
                nodeModulesBytes: size,
                dependencies: deps.dependencies,
                devDependencies: deps.devDependencies,
            };
        });

        return NextResponse.json({base, projects});
    } catch (e) {
        return NextResponse.json({error: e.message}, {status: 500});
    }
}

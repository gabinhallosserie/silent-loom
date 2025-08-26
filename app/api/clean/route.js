import {NextResponse} from "next/server";
import {resolveSafe, removeNodeModules, dirSizeBytes} from "@/lib/fs";
import {logAction} from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const base = process.env.BASE_PROJECTS_PATH;
        if (!base)
            throw new Error("BASE_PROJECTS_PATH non défini dans .env.local");

        const body = await req.json();
        const {projectName} = body;
        if (!projectName || typeof projectName !== "string") {
            return NextResponse.json({error: "projectName requis."}, {status: 400});
        }

        const projectPath = resolveSafe(base, projectName);

        const beforeBytes = dirSizeBytes(require("path").join(projectPath, "node_modules"));

        const ok = removeNodeModules(projectPath);

        const freedBytes = ok ? beforeBytes : 0;
        const freedMB = freedBytes / (1024 * 1024);

        logAction({
            action: "delete_node_modules",
            project: projectName,
            details: {freedBytes, freedMB: Math.round(freedMB * 100) / 100, ok},
        });

        return NextResponse.json({projectName, removed: ok, freedBytes});
    } catch (e) {
        return NextResponse.json({error: e.message}, {status: 500});
    }
}

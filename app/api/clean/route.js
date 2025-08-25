import { NextResponse } from "next/server";
import { resolveSafe, removeNodeModules } from "@/lib/fs";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const base = process.env.BASE_PROJECTS_PATH;
        if (!base) throw new Error("BASE_PROJECTS_PATH non défini.");

        const body = await req.json();
        const { projectName } = body;
        if (!projectName || typeof projectName !== "string") {
            return NextResponse.json({ error: "projectName requis." }, { status: 400 });
        }

        const projectPath = resolveSafe(base, projectName);
        const ok = removeNodeModules(projectPath);
        return NextResponse.json({ projectName, removed: ok });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
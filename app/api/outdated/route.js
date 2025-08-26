import {NextResponse} from "next/server";
import {resolveSafe} from "@/lib/fs";
import {readOutdated} from "@/lib/npm";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const base = process.env.BASE_PROJECTS_PATH;
        if (!base)
            throw new Error("BASE_PROJECTS_PATH non défini dans .env.local");

        const {searchParams} = new URL(req.url);
        const project = searchParams.get("project");
        if (!project)
            return NextResponse.json({error: "project requis"}, {status: 400});

        const projectPath = resolveSafe(base, project);
        const outdated = readOutdated(projectPath);
        return NextResponse.json({outdated});
    } catch (e) {
        return NextResponse.json({error: e.message}, {status: 500});
    }
}

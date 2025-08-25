import { NextResponse } from "next/server";
import { getBasePath, setBasePath } from "@/lib/config";

export async function GET() {
    try {
        return NextResponse.json({ BASE_PROJECTS_PATH: getBasePath() });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { BASE_PROJECTS_PATH } = await req.json();
        if (!BASE_PROJECTS_PATH) {
            return NextResponse.json({ error: "BASE_PROJECTS_PATH requis" }, { status: 400 });
        }
        const updated = setBasePath(BASE_PROJECTS_PATH);
        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

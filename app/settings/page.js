"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
    const [basePath, setBasePath] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/settings");
            const json = await res.json();
            if (res.ok) {
                setBasePath(json.BASE_PROJECTS_PATH || "");
            }
        }
        load();
    }, []);

    async function save() {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ BASE_PROJECTS_PATH: basePath }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Erreur API");
            setMessage("Saved! Redémarre `next dev` pour prendre effet.");
        } catch (e) {
            setMessage(e.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="w-9/12 mt-10 flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-sm text-zinc-500">Configure Silent Loom preferences</p>
            </header>

            <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-zinc-600">Base path</label>
                    <input
                        type="text"
                        value={basePath}
                        onChange={(e) => setBasePath(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <p className="text-xs text-zinc-400">
                        Value stored in <code>.env.local</code> as <code>BASE_PROJECTS_PATH</code>
                    </p>
                </div>
            </section>

            <div>
                <button
                    onClick={save}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-50"
                >
                    {saving ? "Saving…" : "Save changes"}
                </button>
                {message && <p className="text-sm mt-2 text-zinc-600">{message}</p>}
            </div>
        </div>
    );
}

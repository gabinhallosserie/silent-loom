"use client";

import {useEffect, useMemo, useState} from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [withSizes, setWithSizes] = useState(true);
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("");
    const [busy, setBusy] = useState(null);
    const [error, setError] = useState(null);
    const [base, setBase] = useState("");

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/projects?withSizes=${withSizes ? "1" : "0"}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Erreur API");
            setBase(json.base);
            setProjects(json.projects);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [withSizes]);

    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        return projects
            .filter((p) => p.name.toLowerCase().includes(q))
            .sort((a, b) => b.nodeModulesBytes - a.nodeModulesBytes);
    }, [projects, filter]);

    async function clean(name) {
        setBusy(name);
        setError(null);
        try {
            const res = await fetch("/api/clean", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({projectName: name}),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Échec suppression");
            await load();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(null);
        }
    }

    return (
        <main className="w-full h-screen p-6">
            <div className="w-5xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-zinc-400">Folder source: {base || "…"}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrer par nom…" className="px-3 py-2 rounded-lg border text-[#323232] bg-white border-zinc-800 text-sm outline-none focus:outline-none focus:border-zinc-700"/>
                        <button onClick={load} disabled={loading} className="px-3 py-2 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-sm">
                            {loading ? <i className='bi bi-arrow-clockwise text-white'></i> : <i className='bi bi-arrow-clockwise'></i>}
                        </button>
                    </div>
                </header>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((p) => (
                        <li key={p.path} className="p-4 rounded-xl bg-white border">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-xs text-[#323232] break-all">{p.path}</div>
                                    <div className="mt-1 text-xs text-zinc-400">
                                        {p.nodeModulesBytes > 0 ? (
                                            <span>node_modules :{" "} ≈ {" "} {new Intl.NumberFormat().format(Math.round(p.nodeModulesBytes / (1024 * 1024)))}{" "} MB</span>
                                        ) : (
                                            <span>node_modules :{" "} ≈ {" "} {new Intl.NumberFormat().format(Math.round(p.nodeModulesBytes / (1024 * 1024)))}{" "} MB</span>
                                        )}
                                    </div>
                                </div>
                                <button disabled={busy === p.name} onClick={() => clean(p.name)} className="px-3 py-2 rounded-lg bg-[#ea377e] hover:bg-[#c22d67] text-white disabled:opacity-50 text-sm">
                                    {busy === p.name ? "Nettoyage…" : <i className="bi bi-trash"></i>}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {!loading && filtered.length === 0 && (
                    <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
                        Aucun projet trouvé.
                    </div>
                )}
            </div>
        </main>
    );
}

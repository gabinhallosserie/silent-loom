"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [withSizes, setWithSizes] = useState(true);
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("");
    const [filterDirWithoutNodeModules, setFilterDirWithoutNodeModules] =
        useState(false);
    const [busy, setBusy] = useState(null);
    const [error, setError] = useState(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/projects?withSizes=${withSizes ? "1" : "0"}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Erreur API");
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
            .filter((p) => (filterDirWithoutNodeModules ? p.nodeModulesBytes > 0 : true))
            .sort((a, b) => b.nodeModulesBytes - a.nodeModulesBytes);
    }, [projects, filter, filterDirWithoutNodeModules]);

    async function clean(name) {
        setBusy(name);
        try {
            const res = await fetch("/api/clean", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectName: name }),
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

    const formatProjectName = (name) =>
        name
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => (word.toLowerCase() === "api" ? "API" : word.charAt(0).toUpperCase() + word.slice(1)))
            .join(" ");

    return (
        <div className="w-9/12 mt-10 flex flex-col gap-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
                    <p className="text-sm text-zinc-500">Browse your projects and manage dependencies</p>
                </div>
                <span className="text-sm text-zinc-400">
          {loading ? "Loading…" : `${filtered.length} project${filtered.length > 1 ? "s" : ""}`}
        </span>
            </header>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">{error}</div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by name…"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
                />
                <button
                    onClick={() => setFilterDirWithoutNodeModules((v) => !v)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                        filterDirWithoutNodeModules
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-700 border-zinc-300"
                    }`}
                    title={filterDirWithoutNodeModules ? "Filter active" : "Show all"}
                >
                    <i className={`bi ${filterDirWithoutNodeModules ? "bi-funnel-fill" : "bi-funnel"}`} />
                </button>
                <button
                    onClick={load}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50"
                >
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((p) => (
                    <div
                        key={p.name}
                        className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <i className="bi bi-folder2"></i>
                                {formatProjectName(p.name)}
                            </h2>
                            <p className="text-xs text-gray-500 mb-3 break-all">{p.path}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {p.nodeModulesBytes > 0 && withSizes && (
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                    {(p.nodeModulesBytes / (1024 * 1024)).toFixed(2)} MB
                  </span>
                                )}
                                {p.nodeModulesBytes > 0 && (
                                    <button
                                        onClick={() => clean(p.name)}
                                        disabled={busy !== null}
                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded disabled:opacity-50"
                                    >
                                        {busy === p.name ? "Deleting…" : <i className="bi bi-trash"></i>}
                                    </button>
                                )}
                            </div>
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                                <i className="bi bi-diagram-3"></i>
                            </button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && !loading && (
                    <div className="col-span-full text-center text-zinc-500 py-16">
                        No projects found.
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useEffect, useMemo, useState } from "react";

export default function StatsPage() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    // --- helpers ---
    const formatBytes = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
    };
    const toMB = (b) => Math.round(b / 1024 / 1024);
    const pct = (part, total) => (total === 0 ? 0 : Math.round((part / total) * 100));

    async function load() {
        setLoading(true);
        setError(null);
        try {
            // Stats a besoin des tailles -> withSizes=1
            const res = await fetch(`/api/projects?withSizes=1`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Erreur API");
            setProjects(json.projects || []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    // --- derived data ---
    const computed = useMemo(() => {
        const total = projects.length;
        const withNM = projects.filter((p) => p.nodeModulesBytes > 0);
        const countWithNM = withNM.length;
        const totalBytes = withNM.reduce((acc, p) => acc + p.nodeModulesBytes, 0);

        // Tranches (en MB)
        const buckets = [
            { key: "0–100MB", min: 1, max: 100 },
            { key: "100–300MB", min: 100, max: 300 },
            { key: "300–600MB", min: 300, max: 600 },
            { key: "600MB–1GB", min: 600, max: 1024 },
            { key: "≥ 1GB", min: 1024, max: Infinity },
        ].map((b) => ({
            ...b,
            items: withNM.filter((p) => {
                const mb = toMB(p.nodeModulesBytes);
                return mb >= b.min && mb < b.max;
            }),
        }));

        const top = [...withNM]
            .sort((a, b) => b.nodeModulesBytes - a.nodeModulesBytes)
            .slice(0, 8);

        const avg = countWithNM ? totalBytes / countWithNM : 0;

        // médiane
        const sorted = [...withNM].sort((a, b) => a.nodeModulesBytes - b.nodeModulesBytes);
        const median =
            countWithNM === 0
                ? 0
                : countWithNM % 2
                    ? sorted[(countWithNM - 1) / 2].nodeModulesBytes
                    : (sorted[countWithNM / 2 - 1].nodeModulesBytes + sorted[countWithNM / 2].nodeModulesBytes) / 2;

        return {
            total,
            countWithNM,
            totalBytes,
            avgBytes: avg,
            medianBytes: median,
            buckets,
            top,
        };
    }, [projects]);

    return (
        <div className="w-9/12 mt-10 flex flex-col gap-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
                    <p className="text-sm text-zinc-500">
                        Overview of <span className="font-medium text-zinc-700">{projects.length}</span> projects
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={load}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                        title="Refresh"
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
            </header>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">{error}</div>
            )}

            {loading ? (
                <div className="p-6 rounded-xl border border-gray-200 bg-white">Loading…</div>
            ) : (
                <>
                    {/* KPIs */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPI
                            title="Projects with node_modules"
                            value={`${computed.countWithNM} / ${computed.total}`}
                            sub={`${pct(computed.countWithNM, computed.total)}%`}
                        />
                        <KPI title="Total size" value={formatBytes(computed.totalBytes)} sub="sum of node_modules" />
                        <KPI title="Average size" value={formatBytes(computed.avgBytes)} sub="per project" />
                        <KPI title="Median size" value={formatBytes(computed.medianBytes)} sub="per project" />
                    </section>

                    {/* Distribution (buckets) */}
                    <section className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-3 font-medium">Distribution by size (node_modules)</div>
                        <ul className="space-y-3">
                            {computed.buckets.map((b) => {
                                const count = b.items.length;
                                const percentage = pct(count, computed.countWithNM);
                                return (
                                    <li key={b.key}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-zinc-600">{b.key}</span>
                                            <span className="text-zinc-500">{count} • {percentage}%</span>
                                        </div>
                                        {/* simple CSS bar chart */}
                                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${percentage}%`,
                                                    background:
                                                        "linear-gradient(90deg, #ea377e 0%, #f06097 100%)",
                                                }}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                            {computed.countWithNM === 0 && (
                                <div className="text-sm text-zinc-500">No node_modules found.</div>
                            )}
                        </ul>
                    </section>

                    {/* Top heaviest projects */}
                    <section className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-3 font-medium">Heaviest node_modules</div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="text-left text-zinc-500">
                                    <th className="py-2 pr-4">Project</th>
                                    <th className="py-2 pr-4">Path</th>
                                    <th className="py-2 pr-4 w-48">Size</th>
                                </tr>
                                </thead>
                                <tbody>
                                {computed.top.map((p) => (
                                    <tr key={p.path} className="border-t border-gray-100">
                                        <td className="py-2 pr-4">
                                            <i className="bi bi-folder2-open text-zinc-500 mr-2" />
                                            {formatName(p.name)}
                                        </td>
                                        <td className="py-2 pr-4 text-zinc-500 break-all">{p.path}</td>
                                        <td className="py-2 pr-4">
                                            <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {formatBytes(p.nodeModulesBytes)}
                          </span>
                                                {/* inline bar relative to max in top */}
                                                <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                                                    <div
                                                        className="h-full rounded"
                                                        style={{
                                                            width: `${pct(
                                                                p.nodeModulesBytes,
                                                                computed.top[0]?.nodeModulesBytes || 1
                                                            )}%`,
                                                            background:
                                                                "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {computed.top.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-zinc-500">
                                            Nothing to show yet.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

function KPI({ title, value, sub }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-zinc-500">{title}</div>
            <div className="text-xl font-semibold">{value}</div>
            {sub && <div className="text-xs text-zinc-400">{sub}</div>}
        </div>
    );
}

function formatName(name) {
    return name
        .replace(/-/g, " ")
        .split(" ")
        .map((w) => (w.toLowerCase() === "api" ? "API" : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(" ");
}

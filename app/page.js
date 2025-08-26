"use client";

import {useEffect, useMemo, useState} from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [withSizes, setWithSizes] = useState(true);
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("");
    const [onlyWithNodeModules, setOnlyWithNodeModules] = useState(false);
    const [busy, setBusy] = useState(null);
    const [error, setError] = useState(null);

    const [toast, setToast] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [depsModal, setDepsModal] = useState(null);

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
            .filter((p) => (onlyWithNodeModules ? p.nodeModulesBytes > 0 : true))
            .sort((a, b) => b.nodeModulesBytes - a.nodeModulesBytes);
    }, [projects, filter, onlyWithNodeModules]);

    async function clean(name) {
        setBusy(name);
        try {
            const res = await fetch("/api/clean", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({projectName: name}),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Échec suppression");
            setToast({message: `node_modules supprimé pour ${name}`, type: "info"});
            await load();
        } catch (e) {
            setToast({message: e.message, type: "error"});
        } finally {
            setBusy(null);
            setConfirmDelete(null);
        }
    }

    const formatProjectName = (name) =>
        name.replace(/-/g, " ")
            .split(" ")
            .map((w) => (w.toLowerCase() === "api" ? "API" : w.charAt(0).toUpperCase() + w.slice(1)))
            .join(" ");

    return (
        <div className="space-y-6">
            <PageHeader title="Projects" subtitle="Browse your projects and manage dependencies"/>

            {error && (
                <div className="p-3 rounded-lg bg-gray-100 border border-gray-300 text-black">{error}</div>
            )}

            {/* Toolbar (B&W) */}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by name…"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
                />
                <button
                    onClick={() => setOnlyWithNodeModules((v) => !v)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                        onlyWithNodeModules ? "bg-black text-white border-black" : "bg-white text-black border-gray-300"
                    }`}
                    title={onlyWithNodeModules ? "Filter active" : "Show all"}
                >
                    <i className={`bi ${onlyWithNodeModules ? "bi-funnel-fill" : "bi-funnel"}`}/>
                </button>
                <button
                    onClick={load}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50"
                    title="Refresh"
                >
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((p) => (
                    <Card key={p.name}>
                        <div className="flex flex-col justify-between h-full">
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
                                            onClick={() => setConfirmDelete(p.name)}
                                            disabled={busy !== null}
                                            className="px-3 py-1 bg-black text-white text-sm rounded disabled:opacity-50"
                                            title="Delete node_modules"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setDepsModal(p)}
                                    className="px-3 py-1 bg-black text-white text-sm rounded"
                                    title="View dependencies"
                                >
                                    <i className="bi bi-diagram-3"></i>
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Confirm delete modal (B&W) */}
            <Modal
                open={!!confirmDelete}
                title="Confirm deletion"
                onClose={() => setConfirmDelete(null)}
            >
                <p className="text-sm text-gray-600 mb-4">
                    Delete <code>{confirmDelete}</code> node_modules?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1 rounded border border-gray-300 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => clean(confirmDelete)}
                        className="px-3 py-1 rounded bg-black text-white text-sm"
                    >
                        Confirm
                    </button>
                </div>
            </Modal>

            {/* Dependencies modal (B&W) */}
            <Modal
                open={!!depsModal}
                title={`Dependencies for ${depsModal?.name}`}
                onClose={() => setDepsModal(null)}
            >
                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                        <h4 className="font-semibold mb-1">Dependencies</h4>
                        <ul className="space-y-1">
                            {Object.entries(depsModal?.dependencies || {}).map(([dep, ver]) => (
                                <li key={dep}>
                                    {dep} <span className="text-gray-500">{ver}</span>
                                </li>
                            ))}
                            {Object.keys(depsModal?.dependencies || {}).length === 0 && (
                                <li className="text-gray-400">None</li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">DevDependencies</h4>
                        <ul className="space-y-1">
                            {Object.entries(depsModal?.devDependencies || {}).map(([dep, ver]) => (
                                <li key={dep}>
                                    {dep} <span className="text-gray-500">{ver}</span>
                                </li>
                            ))}
                            {Object.keys(depsModal?.devDependencies || {}).length === 0 && (
                                <li className="text-gray-400">None</li>
                            )}
                        </ul>
                    </div>
                </div>
            </Modal>

            {/* Toast (B&W) */}
            {toast && (
                <Toast
                    message={toast.message}
                    type="info"
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

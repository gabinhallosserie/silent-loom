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
    const [filterDirWithoutNodeModules, setFilterDirWithoutNodeModules] = useState(false);

    function formatProjectName(name) {
        return name
            .replace(/-/g, " ")
            .split(" ")
            .map(word => {
                if (word.toLowerCase() === "api") return "API";
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }

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

    const toggleFilterDirWithoutNodeModules = () => {
        setFilterDirWithoutNodeModules(!filterDirWithoutNodeModules);
        load();
    }

    useEffect(() => {
        load();
    }, [withSizes]);

    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (filterDirWithoutNodeModules) {
            return projects
                .filter((p) => p.name.toLowerCase().includes(q))
                .filter((p) => p.nodeModulesBytes > 0)
                .sort((a, b) => b.nodeModulesBytes - a.nodeModulesBytes);
        } else {
            return projects
                .filter((p) => p.name.toLowerCase().includes(q))
                .sort((a, b) => b.nodeModulesBytes - a.nodeModulesBytes);
        }
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

    console.log(projects);

    return (
        <div className="w-9/12 mt-10 flex flex-col justify-center items-start overflow-scroll">
            <div className="w-full flex justify-between items-center">
                <div className={"flex justify-start items-center gap-4"}>
                    <input type={"text"} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by name…" className={"px-2 py-1 border border-gray-300 rounded-xl outline-none"}/>
                    <button onClick={toggleFilterDirWithoutNodeModules} className="px-2 py-1 rounded-lg bg-gray-100">
                        {filterDirWithoutNodeModules ? <i title={"The files are filtered"} className="bi bi-funnel-fill"></i> : <i title={"All folders are displayed"} className="bi bi-funnel"></i>}
                    </button>
                </div>
                <span className="w-[100px] text-right text-sm text-zinc-400">{loading ? "Loading..." : `${filtered.length} projet${filtered.length > 1 ? "s" : ""}`}</span>
            </div>

            <div className={"grid w-full grid-cols-1 md:grid-cols-2 gap-4 mt-4"}>
                {projects.map((p) => {
                    const isFiltered = !p.name.toLowerCase().includes(filter.trim().toLowerCase());
                    if (filterDirWithoutNodeModules && p.nodeModulesBytes === 0) return null;
                    return (
                        <div key={p.name} className={`flex flex-col justify-between p-4 border border-gray-300 rounded-lg bg-white ${isFiltered ? "hidden" : ""}`}>
                            <div className={"flex flex-col justify-start items-start"}>
                                <h2 className="text-lg font-semibold -mb-1"><i className={"bi bi-folder"}></i> {formatProjectName(p.name)}</h2>
                                <p className="text-xs text-gray-600 mb-5">{p.path}</p>
                            </div>
                            <div className={"flex justify-between items-center"}>
                                <div className={"flex justify-start items-center gap-2"}>
                                    {withSizes && (
                                        <p>
                                            {p.nodeModulesBytes > 0 ? (
                                                <span className="w-full text-sm bg-gray-100 p-2 rounded font-mono tracking-tighter">{(p.nodeModulesBytes / (1024 * 1024)).toFixed(2)}MB</span>
                                            ) : (
                                                <></>
                                            )}
                                        </p>
                                    )}
                                    {p.nodeModulesBytes !== 0 && (
                                        <button title={"Delete node_modules"} onClick={() => clean(p.name)} disabled={busy !== null} className="px-3 py-1 bg-[#f79cbe] hover:bg-[#ea377e] text-white rounded disabled:opacity-50">
                                            {busy === p.name ? "Deleting..." : <i className="bi bi-trash"></i>}
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <button title={"View dependencies"} className="px-3 py-1 bg-[#2563eb] text-white rounded">
                                        <i className="bi bi-diagram-3"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
                }
            </div>
        </div>
    );
}
"use client";

import {useEffect, useState} from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";

export default function StatsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch("/api/projects?withSizes=1");
            const json = await res.json();
            if (res.ok) setProjects(json.projects || []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const totalProjects = projects.length;
    const withNM = projects.filter((p) => (p.nodeModulesBytes || 0) > 0);
    const withNMCount = withNM.length;
    const totalMB = withNM.reduce((acc, p) => acc + p.nodeModulesBytes, 0) / (1024 * 1024);
    const avgMB = withNMCount ? totalMB / withNMCount : 0;

    const top5 = [...withNM]
        .sort((a, b) => b.nodeModulesBytes - a.nodeModulesBytes)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <PageHeader title="Stats" subtitle="Overview of your projects"/>

            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <p className="text-sm text-gray-500">Total projects</p>
                    <p className="text-2xl font-semibold">{totalProjects}</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500">With node_modules</p>
                    <p className="text-2xl font-semibold">{withNMCount}</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500">Total size (node_modules)</p>
                    <p className="text-2xl font-semibold">{totalMB.toFixed(2)} MB</p>
                    <p className="text-xs text-gray-500 mt-1">Avg per project: {avgMB.toFixed(2)} MB</p>
                </Card>
            </div>

            {/* Top 5 heaviest projects */}
            <Card>
                <h3 className="text-lg font-semibold mb-3">Top 5 heaviest node_modules</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left text-zinc-500 border-b">
                            <th className="py-2 pr-4">Project</th>
                            <th className="py-2 pr-4">Path</th>
                            <th className="py-2 pr-4 w-48">Size (MB)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {top5.map((p) => {
                            const mb = (p.nodeModulesBytes / (1024 * 1024)).toFixed(2);
                            return (
                                <tr key={p.path} className="border-b last:border-0">
                                    <td className="py-2 pr-4">{p.name}</td>
                                    <td className="py-2 pr-4 text-zinc-500 break-all">{p.path}</td>
                                    <td className="py-2 pr-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {mb}
                      </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {top5.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-6 text-center text-zinc-500">No data yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

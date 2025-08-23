import * as fs from "fs";
import * as path from "path";

export function resolveSafe(base, target = "") {
    const resolved = path.resolve(base, target);
    const normalizedBase = path.resolve(base) + path.sep;
    if (!resolved.startsWith(normalizedBase)) {
        throw new Error("Path traversal bloqué.");
    }
    return resolved;
}

export function listDirectories(base) {
    const entries = fs.readdirSync(base, { withFileTypes: true });
    return entries
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b));
}

export function dirSizeBytes(dir) {
    let total = 0;
    const stack = [dir];
    while (stack.length) {
        const current = stack.pop();
        if (!fs.existsSync(current)) continue;
        const stat = fs.statSync(current);
        if (stat.isDirectory()) {
            for (const e of fs.readdirSync(current)) {
                stack.push(path.join(current, e));
            }
        } else {
            total += stat.size;
        }
    }
    return total;
}

export function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function removeNodeModules(projectPath) {
    const nm = path.join(projectPath, "node_modules");
    if (fs.existsSync(nm)) {
        fs.rmSync(nm, { recursive: true, force: true });
        return true;
    }
    return false;
}
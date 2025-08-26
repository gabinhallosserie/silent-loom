import fs from "fs";
import path from "path";

export function listDirectories(base) {
    return fs.readdirSync(base).filter((file) =>
        fs.statSync(path.join(base, file)).isDirectory()
    );
}

export function resolveSafe(base, name) {
    const resolved = path.resolve(base, name);
    if (!resolved.startsWith(path.resolve(base))) {
        throw new Error("Unsafe path resolution");
    }
    return resolved;
}

export function dirSizeBytes(dirPath) {
    let total = 0;
    if (!fs.existsSync(dirPath)) return 0;
    const entries = fs.readdirSync(dirPath, {withFileTypes: true});
    for (const entry of entries) {
        const full = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            total += dirSizeBytes(full);
        } else {
            total += fs.statSync(full).size;
        }
    }
    return total;
}

export function removeNodeModules(projectPath) {
    const nmPath = path.join(projectPath, "node_modules");
    if (fs.existsSync(nmPath)) {
        fs.rmSync(nmPath, {recursive: true, force: true});
        return true;
    }
    return false;
}

export function readDependencies(projectPath) {
    const pkg = path.join(projectPath, "package.json");
    if (!fs.existsSync(pkg)) return {};
    try {
        const json = JSON.parse(fs.readFileSync(pkg, "utf8"));
        return {
            dependencies: json.dependencies || {},
            devDependencies: json.devDependencies || {},
        };
    } catch {
        return {};
    }
}
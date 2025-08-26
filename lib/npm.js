import {execSync} from "child_process";

export function readOutdated(projectPath) {
    try {
        const output = execSync("npm outdated --json", {
            cwd: projectPath,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
        });
        if (!output.trim()) return {};
        return JSON.parse(output);
    } catch (e) {
        const stdout = e && e.stdout ? e.stdout.toString() : "";
        if (stdout.trim()) {
            try {
                return JSON.parse(stdout);
            } catch {
                return {};
            }
        }
        return {};
    }
}

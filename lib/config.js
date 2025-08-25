import fs from "fs";
import path from "path";

const configFile = path.resolve(process.cwd(), "silentloom.config.json");

export function getBasePath() {
    if (!fs.existsSync(configFile)) return "";
    try {
        const json = JSON.parse(fs.readFileSync(configFile, "utf8"));
        return json.BASE_PROJECTS_PATH || "";
    } catch {
        return "";
    }
}

export function setBasePath(newPath) {
    const config = { BASE_PROJECTS_PATH: newPath };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2), "utf8");
    return config;
}

import fs from "fs";
import path from "path";

export type RepoConfig = {
  visible: boolean;
  category: "pro" | "perso" | "scolaire" | null;
  coverImage: string | null;
};

export type ReposConfigMap = Record<string, RepoConfig>;

const CONFIG_PATH = path.join(process.cwd(), "data", "repos-config.json");

export function getReposConfig(): ReposConfigMap {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading repos-config.json:", error);
  }
  return {};
}

export function saveReposConfig(config: ReposConfigMap) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing repos-config.json:", error);
    throw error;
  }
}

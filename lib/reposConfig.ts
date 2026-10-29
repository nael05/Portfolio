import fs from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import { get, put } from "@vercel/blob";
import { z } from "zod";

export type RepoConfig = {
  visible: boolean;
  category: "pro" | "perso" | "scolaire" | null;
  coverImage: string | null;
};

export type ReposConfigMap = Record<string, RepoConfig>;

export const REPOS_CONFIG_TAG = "repos-config";

const repoConfigSchema = z.object({
  visible: z.boolean(),
  category: z.enum(["pro", "perso", "scolaire"]).nullable(),
  coverImage: z
    .string()
    .max(2048)
    .refine((url) => /^https:\/\//i.test(url), "coverImage must be an https URL")
    .nullable(),
});

export const reposConfigSchema = z
  .record(z.string().min(1).max(200), repoConfigSchema)
  .refine((map) => Object.keys(map).length <= 500, "Too many repositories");

// Seed file shipped with the deployment. Read-only on Vercel, editable in local dev.
const CONFIG_PATH = path.join(process.cwd(), "data", "repos-config.json");
// Where the admin saves its changes in production (Vercel's filesystem is read-only).
const BLOB_PATHNAME = "portfolio/repos-config.json";

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Aucun stockage persistant configuré : crée un Vercel Blob store lié au projet (variable BLOB_READ_WRITE_TOKEN)."
    );
    this.name = "StorageNotConfiguredError";
  }
}

const hasBlobStore = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const blobAccess = () => (process.env.BLOB_ACCESS === "public" ? "public" : "private");

function readSeedConfig(): ReposConfigMap {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const parsed = reposConfigSchema.safeParse(
        JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"))
      );
      if (parsed.success) return parsed.data;
      console.error("Invalid repos-config.json:", parsed.error.message);
    }
  } catch (error) {
    console.error("Error reading repos-config.json:", error);
  }
  return {};
}

async function readConfig(): Promise<ReposConfigMap> {
  if (hasBlobStore()) {
    try {
      const result = await get(BLOB_PATHNAME, { access: blobAccess(), useCache: false });
      if (result && result.statusCode === 200) {
        const parsed = reposConfigSchema.safeParse(
          JSON.parse(await new Response(result.stream).text())
        );
        if (parsed.success) return parsed.data;
        console.error("Invalid repos config in Blob:", parsed.error.message);
      }
    } catch (error) {
      console.error("Error reading repos config from Blob:", error);
    }
  }
  return readSeedConfig();
}

// Cached so the (static) home page never hits the store per request;
// invalidated by revalidateTag(REPOS_CONFIG_TAG) whenever the admin saves.
export const getReposConfig = unstable_cache(readConfig, ["repos-config"], {
  tags: [REPOS_CONFIG_TAG],
  revalidate: 3600,
});

export async function saveReposConfig(config: ReposConfigMap): Promise<void> {
  const body = JSON.stringify(config, null, 2);

  if (hasBlobStore()) {
    await put(BLOB_PATHNAME, body, {
      access: blobAccess(),
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  // Without a store, only local development can persist (by editing the seed file).
  if (process.env.VERCEL) throw new StorageNotConfiguredError();
  fs.writeFileSync(CONFIG_PATH, body, "utf-8");
}

import fs from "fs";
import path from "path";
import { getReposConfig } from "./reposConfig";

export type GitHubRepo = {
  owner: string;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages: Record<string, number>;
  topics: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
  screenshots: string[];
  slug: string;
  readmeUrl: string | null;
  category?: "pro" | "perso" | "scolaire" | null;
  visible?: boolean;
};

type GitHubApiRepo = {
  name: string;
  full_name?: string;
  owner?: { login: string };
  private?: boolean;
  fork: boolean;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  updated_at: string;
  created_at: string;
  default_branch: string;
};

const GITHUB_USERNAME = "nael05";
const SCREENSHOT_FOLDER_PATTERNS = [
  "screeshort",
  "screenshot",
  "screenshots",
  "screeshorts",
];

function getHeaders(): Headers {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  if (process.env.GITHUB_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
  }
  return headers;
}

async function findScreenshots(
  repoFullName: string,
  defaultBranch: string
): Promise<string[]> {
  const headers = getHeaders();
  const screenshots: string[] = [];

  for (const folder of SCREENSHOT_FOLDER_PATTERNS) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repoFullName}/contents/${folder}`,
        { headers, next: { revalidate: 3600 } }
      );
      if (!res.ok) continue;

      const contents = await res.json();
      if (!Array.isArray(contents)) continue;

      const imageFiles = contents
        .filter((f: { name: string; type: string }) => {
          const ext = f.name.split(".").pop()?.toLowerCase();
          return (
            f.type === "file" &&
            (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp")
          );
        })
        .sort((a: { name: string }, b: { name: string }) => {
          const numA = parseInt(a.name.match(/\d+/)?.[0] || "999");
          const numB = parseInt(b.name.match(/\d+/)?.[0] || "999");
          return numA - numB;
        })
        .map(
          (f: { name: string }) =>
            `https://raw.githubusercontent.com/${repoFullName}/${defaultBranch}/${folder}/${f.name}`
        );

      if (imageFiles.length > 0) {
        screenshots.push(...imageFiles);
        break;
      }
    } catch {
      continue;
    }
  }

  return screenshots;
}

async function getRepoLanguages(
  repoFullName: string
): Promise<Record<string, number>> {
  const headers = getHeaders();
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/languages`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function getReadmeUrl(repoFullName: string): Promise<string | null> {
  const headers = getHeaders();
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/readme`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.download_url || null;
  } catch {
    return null;
  }
}

// includeHidden: the admin needs every repo; the public site only the visible ones
// (skipping hidden repos also saves ~6 GitHub API calls each).
export async function fetchGitHubRepos(
  { includeHidden = false }: { includeHidden?: boolean } = {}
): Promise<GitHubRepo[]> {
  const headers = getHeaders();
  const hasToken = Boolean(process.env.GITHUB_TOKEN);
  const configMap = await getReposConfig();

  try {
    const repos: GitHubApiRepo[] = [];

    for (let page = 1; ; page += 1) {
      const endpoint = new URL(
        hasToken
          ? "https://api.github.com/user/repos"
          : `https://api.github.com/users/${GITHUB_USERNAME}/repos`
      );
      endpoint.searchParams.set("sort", "updated");
      endpoint.searchParams.set("per_page", "100");
      endpoint.searchParams.set("page", String(page));
      if (hasToken) {
        endpoint.searchParams.set(
          "affiliation",
          "owner,collaborator,organization_member"
        );
      } else {
        endpoint.searchParams.set("type", "owner");
      }

      // Cached for an hour (like the per-repo calls below): a no-store fetch here
      // made the home page fully dynamic and hit the GitHub API on every visit.
      const res = await fetch(endpoint, { headers, next: { revalidate: 3600 } });
      if (!res.ok) {
        const text = await res.text();
        console.error("GitHub API error:", res.status, res.url, text);
        const cachePath = path.join(process.cwd(), "data", "github-cache.json");
        if (fs.existsSync(cachePath)) {
          repos.length = 0;
          repos.push(...JSON.parse(fs.readFileSync(cachePath, "utf8")));
          console.log("Loaded repos from local cache due to API error.");
        } else {
          return [];
        }
        break;
      }

      const pageRepos: GitHubApiRepo[] = await res.json();
      repos.push(...pageRepos);
      if (pageRepos.length < 100) break;
    }

    const filtered = repos.filter((repo) => {
      const owner = repo.owner?.login || GITHUB_USERNAME;
      const isPublic = repo.private === false;
      const isOwnRepo = owner.toLowerCase() === GITHUB_USERNAME.toLowerCase();
      return (
        isPublic &&
        repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() &&
        (!isOwnRepo || !repo.fork) &&
        (includeHidden || configMap[repo.name]?.visible !== false)
      );
    });

    const enriched: GitHubRepo[] = [];

    // Process in batches of 5 to avoid GitHub secondary rate limits.
    const BATCH_SIZE = 5;
    for (let i = 0; i < filtered.length; i += BATCH_SIZE) {
      const batch = filtered.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (repo) => {
          const owner = repo.owner?.login || GITHUB_USERNAME;
          const repoFullName = repo.full_name || `${owner}/${repo.name}`;
          const conf = configMap[repo.name] || {};
          let screenshots: string[] = [];
          let languages: Record<string, number> = {};
          let readmeUrl: string | null = null;
          try {
            const results = await Promise.all([
              findScreenshots(repoFullName, repo.default_branch).catch(() => []),
              getRepoLanguages(repoFullName).catch(() => ({})),
              getReadmeUrl(repoFullName).catch(() => null),
            ]);
            screenshots = results[0];
            languages = results[1];
            readmeUrl = results[2];
          } catch {
            // Optional repository metadata should not prevent listing the repository.
          }

          if (conf.coverImage) {
            screenshots = [
              conf.coverImage,
              ...screenshots.filter((s) => s !== conf.coverImage),
            ];
          }

          return {
            owner,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            languages,
            topics: repo.topics || [],
            updated_at: repo.updated_at,
            created_at: repo.created_at,
            fork: repo.fork,
            screenshots,
            slug: `${owner}-${repo.name}`
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
            readmeUrl,
            category: conf.category || "perso",
            visible: conf.visible !== false,
          };
        })
      );
      enriched.push(...batchResults);
    }

    return enriched;
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
}

export function getPlaceholderProjects(): GitHubRepo[] {
  return Array.from({ length: 3 }, (_, i) => ({
    owner: GITHUB_USERNAME,
    name: `Projet à venir ${i + 1}`,
    description: "Un nouveau projet est en préparation…",
    html_url: "#",
    homepage: null,
    language: null,
    languages: {},
    topics: [],
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    fork: false,
    screenshots: [],
    slug: `projet-a-venir-${i + 1}`,
    readmeUrl: null,
  }));
}

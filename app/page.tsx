import { fetchGitHubRepos, getPlaceholderProjects } from "@/lib/github";
import { HomeClient } from "./HomeClient";

export const revalidate = 3600; // ISR: revalidate every hour

export default async function Home() {
  let repos = await fetchGitHubRepos();

  if (repos.length === 0) {
    repos = getPlaceholderProjects();
  }

  return <HomeClient repos={repos} />;
}

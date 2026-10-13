import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { fetchGitHubRepos } from "@/lib/github";
import { AdminClient } from "./AdminClient";
import { LoginClient } from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_session")?.value;
  
  let isAuthenticated = false;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) {
    return <LoginClient />;
  }

  const repos = await fetchGitHubRepos();
  return <AdminClient initialRepos={repos} />;
}

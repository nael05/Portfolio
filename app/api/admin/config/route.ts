import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import {
  REPOS_CONFIG_TAG,
  StorageNotConfiguredError,
  reposConfigSchema,
  saveReposConfig,
} from "@/lib/reposConfig";

export async function POST(req: Request) {
  const token = cookies().get("admin_session")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Session expirée, reconnecte-toi." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = reposConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Configuration invalide." }, { status: 400 });
  }

  try {
    await saveReposConfig(parsed.data);
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Failed to save repos config:", error);
    return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 });
  }

  // Make the change visible on the public site right away.
  revalidateTag(REPOS_CONFIG_TAG);
  revalidatePath("/");
  return NextResponse.json({ success: true });
}

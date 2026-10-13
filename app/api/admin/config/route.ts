import { NextResponse } from "next/server";
import { getReposConfig, saveReposConfig } from "@/lib/reposConfig";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const config = await req.json();
    saveReposConfig(config);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

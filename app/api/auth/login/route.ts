import { NextResponse } from "next/server";
import { getAdminPassword, passwordMatches, signToken } from "@/lib/auth";

// Best-effort brute-force protection (in-memory, per serverless instance).
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function getIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isBlocked(ip: string): boolean {
  const now = Date.now();
  if (attempts.size > 1000) {
    attempts.forEach((entry, key) => {
      if (now > entry.resetAt) attempts.delete(key);
    });
  }
  const entry = attempts.get(ip);
  return Boolean(entry && now <= entry.resetAt && entry.count >= MAX_ATTEMPTS);
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export async function POST(req: Request) {
  if (!getAdminPassword()) {
    console.error("ADMIN_PASSWORD is not set: admin login is disabled.");
    return NextResponse.json({ error: "Administration non configurée." }, { status: 503 });
  }

  const ip = getIP(req);
  if (isBlocked(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans quelques minutes." },
      { status: 429 }
    );
  }

  try {
    const { password } = await req.json();

    if (typeof password === "string" && passwordMatches(password)) {
      attempts.delete(ip);
      const token = await signToken({ admin: true });
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
      return response;
    }

    recordFailure(ip);
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

import { createHash, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";

const isProd = process.env.NODE_ENV === "production";

// In production there is no fallback: a missing ADMIN_PASSWORD must lock the admin, not open it.
export const getAdminPassword = (): string | null =>
  process.env.ADMIN_PASSWORD || (isProd ? null : "admin123");

const getSecretKey = () => {
  const secret = process.env.ADMIN_SESSION_SECRET || getAdminPassword();
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");
  return new TextEncoder().encode(secret);
};

export function passwordMatches(input: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, getSecretKey());
    return verified.payload.admin === true ? verified.payload : null;
  } catch {
    return null;
  }
}

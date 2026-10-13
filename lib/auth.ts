import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.ADMIN_PASSWORD || "default_dev_password_123";
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, getSecretKey());
    return verified.payload;
  } catch (err) {
    return null;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Simple in-memory rate limiting (best effort: per serverless instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(150).default("Contact"),
  message: z.string().trim().min(1).max(5000),
});

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (rateLimit.size > 1000) {
    rateLimit.forEach((entry, key) => {
      if (now > entry.resetAt) rateLimit.delete(key);
    });
  }
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour
    return true;
  }

  if (entry.count >= 5) return false;

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429 }
      );
    }

    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Champs requis manquants ou invalides." },
        { status: 400 }
      );
    }
    const { name, email, message } = parsed.data;
    // Keep header-ish fields on a single line.
    const subject = parsed.data.subject.replace(/[\r\n]+/g, " ");

    // If Resend API key is configured, send email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      // resend.emails.send() does not throw: failures come back in `error`.
      const { error } = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: process.env.CONTACT_TO_EMAIL || "nael.mrl@icloud.com",
        reply_to: email,
        subject: `[Portfolio] ${subject} - ${name}`,
        text: `
Nouveau message depuis le portfolio

Nom: ${name}
Email: ${email}
Sujet: ${subject}

Message:
${message}
        `.trim(),
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json({ error: "Envoi impossible." }, { status: 502 });
      }
    } else {
      // Log to console if no Resend key
      console.log("Contact form submission:", { name, email, subject, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

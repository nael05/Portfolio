import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
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

    const body = await req.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // If Resend API key is configured, send email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: "nael.mrl@icloud.com",
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

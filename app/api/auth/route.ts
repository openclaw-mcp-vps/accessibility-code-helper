import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, createAccessToken, verifyAccessToken } from "@/lib/auth-cookie";
import { getSubscriptionByEmail } from "@/lib/subscription-store";

export const runtime = "nodejs";

interface AuthRequest {
  email?: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AuthRequest;
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter the same email address used during Stripe checkout." },
      { status: 400 }
    );
  }

  const subscription = await getSubscriptionByEmail(email);

  if (!subscription || subscription.state !== "active") {
    return NextResponse.json(
      {
        error:
          "No active subscription found for this email yet. If you just paid, wait 10-30 seconds and try again so the webhook can finish processing."
      },
      { status: 403 }
    );
  }

  const token = createAccessToken({
    email,
    plan: subscription.plan,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30
  });

  const response = NextResponse.json({
    ok: true,
    email,
    plan: subscription.plan
  });

  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${ACCESS_COOKIE_NAME}=`))
    ?.slice(ACCESS_COOKIE_NAME.length + 1);

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    email: payload.email,
    plan: payload.plan,
    expiresAt: payload.exp
  });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}

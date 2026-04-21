import { NextResponse } from "next/server";
import {
  normalizeBillingWebhookEvent,
  verifyLemonSignature,
  verifyStripeStyleSignature
} from "@/lib/lemonsqueezy";
import { upsertSubscription } from "@/lib/subscription-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const rawBody = await request.text();
  const stripeSignature = request.headers.get("stripe-signature");
  const lemonSignature = request.headers.get("x-signature");

  const verified = stripeSignature
    ? verifyStripeStyleSignature(rawBody, stripeSignature, secret)
    : lemonSignature
      ? verifyLemonSignature(rawBody, lemonSignature, secret)
      : false;

  if (!verified) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as unknown;
  const event = normalizeBillingWebhookEvent(payload);

  if (!event || !event.email || event.type === "unknown") {
    return NextResponse.json({ received: true, ignored: true });
  }

  await upsertSubscription({
    email: event.email,
    state: event.type === "subscription_active" ? "active" : "inactive",
    plan: event.plan,
    source: event.provider,
    updatedAt: new Date().toISOString(),
    lastEventId: event.id
  });

  return NextResponse.json({
    received: true,
    provider: event.provider,
    state: event.type,
    email: event.email
  });
}

import { createHmac, timingSafeEqual } from "node:crypto";

export interface NormalizedBillingEvent {
  id: string;
  provider: "stripe" | "lemonsqueezy";
  type: "subscription_active" | "subscription_inactive" | "unknown";
  email: string | null;
  plan: "starter" | "pro";
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function verifyStripeStyleSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const entries = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = entries.find((entry) => entry.startsWith("t="))?.slice(2);
  const signature = entries.find((entry) => entry.startsWith("v1="))?.slice(3);

  if (!timestamp || !signature) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");

  return safeCompare(expected, signature);
}

export function verifyLemonSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  return safeCompare(expected, signatureHeader);
}

export function normalizeBillingWebhookEvent(payload: unknown): NormalizedBillingEvent | null {
  const event = payload as Record<string, unknown>;

  if (!event || typeof event !== "object") {
    return null;
  }

  if (typeof event.type === "string") {
    const stripePayload = event.data as { object?: Record<string, unknown> };
    const object = stripePayload?.object ?? {};
    const stripeType = event.type;

    const stripeEmail =
      (object.customer_details as { email?: string } | undefined)?.email ??
      (object.customer_email as string | undefined) ??
      null;

    if (stripeType === "checkout.session.completed" || stripeType === "invoice.payment_succeeded") {
      return {
        id: String(event.id ?? `stripe-${Date.now()}`),
        provider: "stripe",
        type: "subscription_active",
        email: stripeEmail,
        plan: "pro"
      };
    }

    if (stripeType === "customer.subscription.deleted" || stripeType === "invoice.payment_failed") {
      return {
        id: String(event.id ?? `stripe-${Date.now()}`),
        provider: "stripe",
        type: "subscription_inactive",
        email: stripeEmail,
        plan: "pro"
      };
    }

    return {
      id: String(event.id ?? `stripe-${Date.now()}`),
      provider: "stripe",
      type: "unknown",
      email: stripeEmail,
      plan: "pro"
    };
  }

  const meta = event.meta as Record<string, unknown> | undefined;
  const data = event.data as Record<string, unknown> | undefined;
  const attributes = (data?.attributes ?? {}) as Record<string, unknown>;
  const eventName = String(meta?.event_name ?? "");

  if (!eventName) {
    return null;
  }

  const email = (attributes.user_email as string | undefined) ?? (attributes.customer_email as string | undefined) ?? null;

  if (eventName.includes("subscription_created") || eventName.includes("subscription_updated")) {
    return {
      id: String(eventName + "-" + (attributes.order_id ?? Date.now())),
      provider: "lemonsqueezy",
      type: "subscription_active",
      email,
      plan: "pro"
    };
  }

  if (eventName.includes("subscription_cancelled") || eventName.includes("subscription_expired")) {
    return {
      id: String(eventName + "-" + (attributes.order_id ?? Date.now())),
      provider: "lemonsqueezy",
      type: "subscription_inactive",
      email,
      plan: "pro"
    };
  }

  return {
    id: String(eventName + "-" + Date.now()),
    provider: "lemonsqueezy",
    type: "unknown",
    email,
    plan: "pro"
  };
}

export async function setupLemonSqueezyClient(apiKey: string): Promise<void> {
  const sdk = await import("@lemonsqueezy/lemonsqueezy.js");

  if ("lemonSqueezySetup" in sdk && typeof sdk.lemonSqueezySetup === "function") {
    sdk.lemonSqueezySetup({ apiKey });
  }
}

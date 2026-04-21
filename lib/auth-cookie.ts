import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE_NAME = "ach_access";

export interface AccessTokenPayload {
  email: string;
  plan: "starter" | "pro";
  exp: number;
}

function getSigningSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || "local-dev-signing-secret-change-me";
}

function base64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(unsignedToken: string): string {
  return createHmac("sha256", getSigningSecret()).update(unsignedToken).digest("base64url");
}

export function createAccessToken(payload: AccessTokenPayload): string {
  const serialized = JSON.stringify(payload);
  const encoded = base64Url(serialized);
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expected = sign(encoded);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AccessTokenPayload;

    if (!payload.email || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

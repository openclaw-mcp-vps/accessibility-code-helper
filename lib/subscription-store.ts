import { promises as fs } from "node:fs";
import path from "node:path";

export type SubscriptionPlan = "starter" | "pro";
export type SubscriptionState = "active" | "inactive";

export interface StoredSubscription {
  email: string;
  state: SubscriptionState;
  plan: SubscriptionPlan;
  source: "stripe" | "lemonsqueezy" | "manual";
  updatedAt: string;
  lastEventId: string;
}

interface SubscriptionFile {
  subscriptions: Record<string, StoredSubscription>;
}

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "subscriptions.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureStore(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    const initial: SubscriptionFile = { subscriptions: {} };
    await fs.writeFile(filePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<SubscriptionFile> {
  await ensureStore();
  const raw = await fs.readFile(filePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as SubscriptionFile;
    if (!parsed.subscriptions) {
      return { subscriptions: {} };
    }

    return parsed;
  } catch {
    return { subscriptions: {} };
  }
}

async function writeStore(data: SubscriptionFile): Promise<void> {
  await ensureStore();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getSubscriptionByEmail(email: string): Promise<StoredSubscription | null> {
  const normalized = normalizeEmail(email);
  const store = await readStore();
  return store.subscriptions[normalized] ?? null;
}

export async function upsertSubscription(record: StoredSubscription): Promise<StoredSubscription> {
  const normalized = normalizeEmail(record.email);
  const store = await readStore();

  const next: StoredSubscription = {
    ...record,
    email: normalized,
    updatedAt: new Date().toISOString()
  };

  store.subscriptions[normalized] = next;
  await writeStore(store);

  return next;
}

export async function setManualActiveSubscription(email: string): Promise<StoredSubscription> {
  return upsertSubscription({
    email,
    state: "active",
    plan: "pro",
    source: "manual",
    updatedAt: new Date().toISOString(),
    lastEventId: `manual-${Date.now()}`
  });
}

import Link from "next/link";
import { cookies } from "next/headers";
import { AccessibilityWorkbench } from "@/components/AccessibilityWorkbench";
import { ExtensionDownload } from "@/components/ExtensionDownload";
import { LogoutButton } from "@/components/LogoutButton";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { UnlockForm } from "@/components/UnlockForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/auth-cookie";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const session = token ? verifyAccessToken(token) : null;

  if (!session) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 pb-16 pt-10 md:px-8 md:pt-14">
        <div className="space-y-3">
          <Badge>Subscriber Dashboard</Badge>
          <h1 className="text-3xl font-semibold md:text-4xl">Unlock your debugging workspace</h1>
          <p className="max-w-2xl text-[#9fb1cc]">
            After Stripe checkout, use the same billing email below. We validate your active subscription and issue a secure cookie for dashboard access.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#58c4dd] px-4 text-sm font-medium text-[#081018] hover:bg-[#6bd1e8]"
            >
              Buy Pro Access
            </a>
            <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md border border-[#31435e] px-4 text-sm text-[#dbe8fa] hover:bg-[#19263b]">
              Back to landing page
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Activate Access</CardTitle>
              <CardDescription>
                Webhook processing is usually immediate. If you just paid, wait a few seconds before unlocking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UnlockForm />
            </CardContent>
          </Card>

          <SubscriptionStatus active={false} />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 pb-16 pt-10 md:px-8 md:pt-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge>Dashboard</Badge>
          <h1 className="text-3xl font-semibold md:text-4xl">Audio-first debugging workspace</h1>
          <p className="max-w-3xl text-[#9fb1cc]">
            Use the translator to convert visual diagnostics into speech narration, tone cues, and tactile patterns that support screen-reader-first development workflows.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <SubscriptionStatus active email={session.email} plan={session.plan} />
        <Card>
          <CardHeader>
            <CardTitle>Realtime API Endpoint</CardTitle>
            <CardDescription>
              POST payloads to `/api/accessibility/audio-cues` from your extension or IDE plugin to generate structured audio output.
            </CardDescription>
          </CardHeader>
          <CardContent className="font-mono text-xs text-[#9fb1cc]">
            <p>curl -X POST /api/accessibility/audio-cues -H "Content-Type: application/json" -d '&#123;"diagnostics":[...]&#125;'</p>
          </CardContent>
        </Card>
      </div>

      <AccessibilityWorkbench />
      <ExtensionDownload />
    </main>
  );
}

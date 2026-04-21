import Link from "next/link";
import { ArrowRight, Headphones, Keyboard, Mic2, ShieldCheck, Timer } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtensionDownload } from "@/components/ExtensionDownload";

const faqItems = [
  {
    id: "faq-1",
    title: "How does checkout unlock the dashboard?",
    content:
      "Stripe sends a webhook to your billing endpoint. We map the checkout email to an active subscription and issue a signed access cookie when that same email is validated in the dashboard."
  },
  {
    id: "faq-2",
    title: "Can teams manage multiple developers?",
    content:
      "Yes. Accessibility teams can provision seats per email and route extension updates through internal software catalogs while keeping each engineer's debugging profile private."
  },
  {
    id: "faq-3",
    title: "Does it work with screen readers already in use?",
    content:
      "The generated narration is plain speech output and SSML-ready text, so it complements VoiceOver, NVDA, and JAWS instead of replacing them."
  },
  {
    id: "faq-4",
    title: "What data leaves the developer workstation?",
    content:
      "Only diagnostics payloads that you explicitly send to the API. Source code snapshots stay local unless your organization forwards them through your own telemetry pipeline."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-20 px-5 pb-20 pt-10 md:px-8 md:pt-14">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <Badge>Accessibility Tools</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-[#edf4ff] md:text-6xl md:leading-[1.05]">
            Code accessibility tools for visually impaired developers
          </h1>
          <p className="max-w-2xl text-lg text-[#9fb1cc]">
            Accessibility Code Helper converts visual debugging output into spoken, keyboard-friendly, and tactile-ready feedback so blind and low-vision engineers can debug at full speed.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#58c4dd] px-6 text-sm font-medium text-[#081018] hover:bg-[#6bd1e8]"
            >
              Start Pro Plan ($15/mo)
            </a>
            <Link href="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-md border border-[#31435e] px-5 text-sm text-[#dbe8fa] hover:bg-[#19263b]">
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-sm text-[#8fa2bf]">
            Built for blind engineers, accessibility teams, and coding bootcamps teaching visually impaired students.
          </p>
        </div>

        <Card className="relative overflow-hidden border-[#2e4960] bg-gradient-to-b from-[#12253a] to-[#0e1727]">
          <CardHeader>
            <CardTitle>Why Teams Buy</CardTitle>
            <CardDescription>
              Visually impaired developers spend up to 3x longer debugging because mainstream tools are built for sighted workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#b5c8e1]">
            <div className="flex items-start gap-3">
              <Timer className="mt-0.5 h-4 w-4 text-[#f8ca7c]" />
              <p>Reduce debugging turnaround by narrating stack context and severity instantly.</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-[#9be15d]" />
              <p>Improve retention by giving accessibility-ready workflows to distributed engineering teams.</p>
            </div>
            <div className="flex items-start gap-3">
              <Keyboard className="mt-0.5 h-4 w-4 text-[#58c4dd]" />
              <p>Ship keyboard-first debugging habits that work in browser tools, editors, and CI views.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="problem" className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Problem</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#9fb1cc]">
            Visual-only debugging panels force blind engineers to hunt through noisy output while sighted teammates scan charts and stack traces instantly.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Solution</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#9fb1cc]">
            Audio cue synthesis summarizes severity, location, and probable root cause in plain language, paired with keyboard shortcuts and tactile patterns.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Impact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#9fb1cc]">
            Organizations unlock underrepresented engineering talent and reduce accessibility debt in developer tooling as remote work scales.
          </CardContent>
        </Card>
      </section>

      <section id="solution" className="space-y-6">
        <div className="space-y-2">
          <Badge>Core Features</Badge>
          <h2 className="text-3xl font-semibold">Designed for real debugging sessions</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mic2 className="h-4 w-4 text-[#58c4dd]" />
                Spoken Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#9fb1cc]">
              Converts linter and runtime signals into concise narration with severity-aware ordering.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Headphones className="h-4 w-4 text-[#9be15d]" />
                Earcon Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#9fb1cc]">
              Distinct tone signatures let developers identify errors, warnings, and info events without leaving the keyboard.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Keyboard className="h-4 w-4 text-[#f8ca7c]" />
                Keyboard Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#9fb1cc]">
              Plugin commands and extension shortcuts let users narrate active code context in one keystroke.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <Card className="border-[#315870] bg-gradient-to-b from-[#11253a] to-[#0d1117]">
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>For blind and low-vision software engineers shipping production code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-semibold">
              $15<span className="text-lg font-normal text-[#9fb1cc]"> / month</span>
            </p>
            <ul className="space-y-2 text-sm text-[#adc1dd]">
              <li>Audio cue API with SSML output</li>
              <li>Browser extension + VS Code plugin source</li>
              <li>Subscription-gated dashboard</li>
              <li>Email-based checkout activation</li>
            </ul>
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#58c4dd] px-6 text-sm font-medium text-[#081018] hover:bg-[#6bd1e8]"
            >
              Buy with Stripe Hosted Checkout
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Who Pays</CardTitle>
            <CardDescription>Primary buyers in accessibility-focused engineering organizations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#9fb1cc]">
            <p>Blind and low-vision developers at tech companies who need faster, independent debugging loops.</p>
            <p>Accessibility platform teams at mid-to-large companies building inclusive developer environments.</p>
            <p>Coding bootcamps and workforce programs serving visually impaired software students.</p>
          </CardContent>
        </Card>
      </section>

      <ExtensionDownload />

      <section id="faq" className="space-y-4">
        <div className="space-y-2">
          <Badge>FAQ</Badge>
          <h2 className="text-3xl font-semibold">Implementation and rollout questions</h2>
        </div>
        <Accordion items={faqItems} />
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#223246] pt-6 text-sm text-[#8ea4bf]">
        <p>Accessibility Code Helper</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-[#dce8fa]">
            Dashboard
          </Link>
          <a href="#pricing" className="hover:text-[#dce8fa]">
            Pricing
          </a>
        </div>
      </footer>
    </main>
  );
}

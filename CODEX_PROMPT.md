# Build Task: accessibility-code-helper

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: accessibility-code-helper
HEADLINE: Code accessibility tools for visually impaired developers
WHAT: None
WHY: None
WHO PAYS: None
NICHE: accessibility-tools
PRICE: $$15/mo

ARCHITECTURE SPEC:
A Next.js web application that provides real-time code accessibility analysis, screen reader optimization suggestions, and voice-controlled coding assistance. The tool integrates with popular code editors through browser extensions and APIs to help visually impaired developers write more accessible code.

PLANNED FILES:
- app/page.tsx
- app/dashboard/page.tsx
- app/api/analyze/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/CodeAnalyzer.tsx
- components/VoiceCommands.tsx
- components/AccessibilityReport.tsx
- lib/accessibility-rules.ts
- lib/lemonsqueezy.ts
- lib/auth.ts

DEPENDENCIES: next, tailwindcss, @lemonsqueezy/lemonsqueezy.js, next-auth, prisma, @prisma/client, react-speech-kit, monaco-editor, @typescript-eslint/parser, axe-core, stripe

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/accessibility-code-helper
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d94e4-1016-7db0-a925-817c871d3e47
--------
user
# Build Task: accessibility-code-helper

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: accessibility-code-helper
HEADLINE: Code
Please fix the above errors and regenerate.
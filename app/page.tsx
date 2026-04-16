export default function Page() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#";

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-block mb-4 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[#58a6ff] text-sm font-medium">
          Accessibility-First Dev Tools
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
          Code Accessibility Tools for{" "}
          <span className="text-[#58a6ff]">Visually Impaired Developers</span>
        </h1>
        <p className="text-lg text-[#8b949e] mb-8 max-w-xl mx-auto">
          Real-time accessibility analysis, screen reader optimization, and voice-controlled coding assistance — built for developers who rely on assistive technology.
        </p>
        <a
          href={checkoutUrl}
          className="inline-block bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-base"
          aria-label="Get started with AccessCode for $15 per month"
        >
          Get Started — $15/mo
        </a>
        <p className="mt-4 text-sm text-[#8b949e]">Cancel anytime. No lock-in.</p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
            <div className="text-2xl mb-3" aria-hidden="true">&#128269;</div>
            <h2 className="text-white font-semibold mb-2">Live Code Analysis</h2>
            <p className="text-sm text-[#8b949e]">Instant WCAG and ARIA feedback as you type, surfaced directly in your editor.</p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
            <div className="text-2xl mb-3" aria-hidden="true">&#127908;</div>
            <h2 className="text-white font-semibold mb-2">Voice Coding</h2>
            <p className="text-sm text-[#8b949e]">Dictate code, navigate files, and trigger commands entirely hands-free.</p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
            <div className="text-2xl mb-3" aria-hidden="true">&#128266;</div>
            <h2 className="text-white font-semibold mb-2">Screen Reader Mode</h2>
            <p className="text-sm text-[#8b949e]">Optimized output and semantic hints tuned for NVDA, JAWS, and VoiceOver.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-md mx-auto px-6 pb-20" aria-labelledby="pricing-heading">
        <h2 id="pricing-heading" className="text-2xl font-bold text-white text-center mb-8">Simple Pricing</h2>
        <div className="bg-[#161b22] border border-[#58a6ff] rounded-2xl p-8 text-center">
          <p className="text-[#58a6ff] font-semibold text-sm uppercase tracking-widest mb-2">Pro</p>
          <p className="text-5xl font-bold text-white mb-1">$15</p>
          <p className="text-[#8b949e] mb-6">per month</p>
          <ul className="text-left space-y-3 mb-8" aria-label="Plan features">
            {[
              "Real-time WCAG / ARIA analysis",
              "Voice-controlled coding assistant",
              "Screen reader optimization hints",
              "Browser extension + API access",
              "Priority support"
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <span className="text-[#58a6ff] font-bold" aria-hidden="true">&#10003;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href={checkoutUrl}
            className="block w-full bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-semibold py-3 rounded-lg transition-colors duration-200"
            aria-label="Subscribe to AccessCode Pro for $15 per month"
          >
            Subscribe Now
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Which editors are supported?</h3>
            <p className="text-sm text-[#8b949e]">AccessCode works with VS Code, JetBrains IDEs, and any browser-based editor via our extension and REST API.</p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Does it work with my screen reader?</h3>
            <p className="text-sm text-[#8b949e]">Yes. The tool is tested with NVDA, JAWS, and VoiceOver and follows ARIA best practices throughout.</p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-[#8b949e]">Absolutely. Cancel from your billing dashboard at any time — no questions asked, no penalties.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#30363d] py-8 text-center text-sm text-[#8b949e]">
        <p>&copy; {new Date().getFullYear()} AccessCode. Built for inclusive development.</p>
      </footer>
    </main>
  );
}

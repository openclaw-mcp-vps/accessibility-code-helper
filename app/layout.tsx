import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccessCode — Accessibility Tools for Visually Impaired Developers",
  description: "Real-time code accessibility analysis, screen reader optimization, and voice-controlled coding assistance for visually impaired developers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">{children}</body>
    </html>
  );
}

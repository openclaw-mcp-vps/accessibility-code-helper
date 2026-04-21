import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://accessibility-code-helper.com"),
  title: "Accessibility Code Helper | Audio-First Debugging for Blind and Low-Vision Developers",
  description:
    "Accessibility Code Helper turns visual debugging signals into spoken descriptions, keyboard-driven workflows, and tactile-ready cues so blind and low-vision developers can ship faster.",
  keywords: [
    "accessible developer tools",
    "blind software engineer tools",
    "audio debugging",
    "screen reader coding",
    "IDE accessibility"
  ],
  openGraph: {
    title: "Accessibility Code Helper",
    description:
      "A browser extension + IDE plugin that narrates errors, structure, and runtime behavior in real time.",
    url: "https://accessibility-code-helper.com",
    type: "website",
    siteName: "Accessibility Code Helper"
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Code Helper",
    description:
      "Code accessibility tools for visually impaired developers with audio cues and keyboard-first workflows."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} bg-[#0d1117] text-[#edf4ff]`}>
        {children}
      </body>
    </html>
  );
}

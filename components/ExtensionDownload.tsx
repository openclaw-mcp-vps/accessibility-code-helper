import { Download, Keyboard, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ExtensionDownload() {
  return (
    <section id="downloads" className="space-y-6">
      <div className="space-y-2">
        <Badge>Downloads</Badge>
        <h2 className="text-2xl font-semibold text-[#edf4ff] md:text-3xl">Browser extension + IDE plugin</h2>
        <p className="max-w-3xl text-[#9fb1cc]">
          Install the Chrome and VS Code integrations to narrate diagnostics, trigger keyboard-first workflows, and map code structure into tactile-friendly rhythm patterns.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-[#58c4dd]" />
              Chrome Extension
            </CardTitle>
            <CardDescription>Injects spoken cues for browser-based coding tools, CI dashboards, and web IDEs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#9fb1cc]">
            <p>
              Includes global shortcut `Alt+Shift+N` for instant narration and background speech for runtime console errors.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/downloads/chrome/manifest.json"
                download
                className="rounded-md border border-[#2b3f5c] px-3 py-2 text-[#dce8fa] hover:bg-[#1a2940]"
              >
                Download Manifest
              </a>
              <a
                href="/downloads/chrome/content-script.js"
                download
                className="rounded-md border border-[#2b3f5c] px-3 py-2 text-[#dce8fa] hover:bg-[#1a2940]"
              >
                Download Content Script
              </a>
              <a
                href="/downloads/chrome/background.js"
                download
                className="rounded-md border border-[#2b3f5c] px-3 py-2 text-[#dce8fa] hover:bg-[#1a2940]"
              >
                Download Background Worker
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-[#9be15d]" />
              VS Code Plugin
            </CardTitle>
            <CardDescription>
              Maps the active editor context into plain-language debug narration and lightweight keyboard prompts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#9fb1cc]">
            <p>
              Ships commands for line narration, symbol depth hints, and diagnostics playback through your preferred screen reader.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/downloads/vscode/extension.ts"
                download
                className="rounded-md border border-[#2b3f5c] px-3 py-2 text-[#dce8fa] hover:bg-[#1a2940]"
              >
                Download Extension Source
              </a>
              <a
                href="/downloads/vscode/README.md"
                download
                className="rounded-md border border-[#2b3f5c] px-3 py-2 text-[#dce8fa] hover:bg-[#1a2940]"
              >
                Install Guide
              </a>
            </div>
            <div className="rounded-lg border border-[#27455d] bg-[#102133] p-3">
              <p className="flex items-center gap-2 text-[#b6d5e8]">
                <Volume2 className="h-4 w-4 text-[#58c4dd]" />
                Tip: bind `Accessibility: Narrate Active Line` to a single key chord for faster debugging.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

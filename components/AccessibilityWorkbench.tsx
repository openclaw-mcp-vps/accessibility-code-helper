"use client";

import { useMemo, useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccessibilityAudioResponse } from "@/lib/accessibility-engine";

const samplePayload = {
  environment: "VS Code",
  currentSymbol: "buildRouteHandler",
  indentLevel: 3,
  diagnostics: [
    {
      message: "Unhandled promise rejection in createSession",
      severity: "error",
      file: "lib/session.ts",
      line: 42,
      column: 9,
      ruleId: "runtime/unhandled-promise"
    },
    {
      message: "Variable accountId is declared but never used",
      severity: "warning",
      file: "app/api/auth/route.ts",
      line: 17,
      column: 7,
      ruleId: "typescript/no-unused-vars"
    }
  ],
  stackFrames: [
    {
      functionName: "createSession",
      file: "lib/session.ts",
      line: 42,
      column: 9
    },
    {
      functionName: "POST",
      file: "app/api/auth/route.ts",
      line: 39,
      column: 15
    }
  ],
  runtimeHint: "Failure reproduces when user refreshes dashboard after payment"
};

export function AccessibilityWorkbench() {
  const [input, setInput] = useState(JSON.stringify(samplePayload, null, 2));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AccessibilityAudioResponse | null>(null);

  const parsedCount = useMemo(() => {
    try {
      const value = JSON.parse(input) as { diagnostics?: unknown[] };
      return value.diagnostics?.length ?? 0;
    } catch {
      return 0;
    }
  }, [input]);

  const handleGenerate = async () => {
    setError("");
    setLoading(true);

    let payload: unknown;
    try {
      payload = JSON.parse(input);
    } catch {
      setError("Provide valid JSON from your debugger, linter, or runtime instrumentation.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/accessibility/audio-cues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "The audio-cue API request failed.");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as AccessibilityAudioResponse;
      setResult(data);
      setLoading(false);
    } catch {
      setError("Network error while generating cues.");
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Visual-to-Audio Debug Translator</CardTitle>
          <CardDescription>
            Paste runtime diagnostics JSON and generate spoken debugging output, tone sequence, and tactile pattern in one step.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="h-96 w-full rounded-lg border border-[#2b3f5c] bg-[#0d1624] p-4 font-mono text-xs text-[#c9d8ee] outline-none focus:border-[#58c4dd]"
            aria-label="Debug payload JSON"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating audio cues..." : "Generate narration"}
            </Button>
            <p className="text-xs text-[#94a8c4]">Diagnostics detected in editor: {parsedCount}</p>
          </div>
          {error ? <p className="text-sm text-[#f5a6b6]">{error}</p> : null}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {result ? (
          <AudioPlayer
            summary={result.summary}
            plainSpeech={result.plainSpeech}
            ssml={result.ssml}
            tonePlan={result.tonePlan}
            tactilePattern={result.tactilePattern}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Playback Output</CardTitle>
              <CardDescription>
                Generate cues to preview synchronized speech narration and severity-based earcons.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[#9fb1cc]">
              The generated output includes an SSML script, plain-language summary, and vibration pattern for haptic-ready devices.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import {
  cuesToPlainSpeech,
  cuesToSsml,
  cuesToTonePlan,
  indentToTactilePattern,
  type AudioCue,
  type CueSeverity,
  type ToneStep
} from "@/lib/audio-synthesis";

export interface DiagnosticSignal {
  message: string;
  severity: CueSeverity;
  file?: string;
  line?: number;
  column?: number;
  ruleId?: string;
}

export interface StackFrameSignal {
  functionName: string;
  file?: string;
  line?: number;
  column?: number;
}

export interface VisualDebugPayload {
  environment?: string;
  diagnostics?: DiagnosticSignal[];
  stackFrames?: StackFrameSignal[];
  currentSymbol?: string;
  indentLevel?: number;
  runtimeHint?: string;
}

export interface AccessibilityAudioResponse {
  summary: string;
  cues: AudioCue[];
  plainSpeech: string;
  ssml: string;
  tonePlan: ToneStep[];
  tactilePattern: number[];
}

function prioritizeDiagnostics(diagnostics: DiagnosticSignal[]): DiagnosticSignal[] {
  const severityRank: Record<CueSeverity, number> = {
    error: 3,
    warning: 2,
    info: 1
  };

  return diagnostics
    .filter((item) => item.message?.trim().length > 0)
    .sort((left, right) => severityRank[right.severity] - severityRank[left.severity]);
}

function summarizeContext(payload: VisualDebugPayload, diagnostics: DiagnosticSignal[]): string {
  const location = payload.currentSymbol ? `for ${payload.currentSymbol}` : "for the current cursor location";
  const environment = payload.environment ? `${payload.environment} session` : "developer session";

  const counts = diagnostics.reduce(
    (acc, item) => {
      acc[item.severity] += 1;
      return acc;
    },
    { error: 0, warning: 0, info: 0 }
  );

  if (!diagnostics.length) {
    return `No diagnostics detected in this ${environment} ${location}`;
  }

  return `${counts.error} errors, ${counts.warning} warnings, and ${counts.info} informational signals detected in this ${environment} ${location}`;
}

export function buildAccessibilityAudioResponse(payload: VisualDebugPayload): AccessibilityAudioResponse {
  const diagnostics = prioritizeDiagnostics(payload.diagnostics ?? []);
  const cues: AudioCue[] = diagnostics.slice(0, 10).map((signal) => ({
    severity: signal.severity,
    label: signal.ruleId ?? signal.severity,
    message: signal.message,
    file: signal.file,
    line: signal.line,
    column: signal.column
  }));

  const summary = summarizeContext(payload, diagnostics);
  const plainSpeech = cuesToPlainSpeech(summary, cues);
  const ssml = cuesToSsml(summary, cues);
  const tonePlan = cuesToTonePlan(cues);
  const tactilePattern = indentToTactilePattern(payload.indentLevel ?? 0);

  return {
    summary,
    cues,
    plainSpeech,
    ssml,
    tonePlan,
    tactilePattern
  };
}

export interface RealtimeBroadcast {
  type: "audio-cue";
  payload: AccessibilityAudioResponse;
}

export interface AccessibilitySocketHub {
  close: () => Promise<void>;
  broadcast: (payload: VisualDebugPayload) => void;
}

export async function createAccessibilitySocketHub(port = 8787): Promise<AccessibilitySocketHub> {
  const { WebSocketServer } = await import("ws");
  const server = new WebSocketServer({ port });

  const clients = new Set<unknown>();

  server.on("connection", (socket) => {
    clients.add(socket);

    socket.on("close", () => {
      clients.delete(socket);
    });
  });

  return {
    async close() {
      for (const socket of clients) {
        // The ws socket type is loaded at runtime. Keep this untyped for portable builds.
        (socket as { close: () => void }).close();
      }

      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    },
    broadcast(payload) {
      const normalized = buildAccessibilityAudioResponse(payload);
      const message: RealtimeBroadcast = {
        type: "audio-cue",
        payload: normalized
      };

      for (const socket of clients) {
        (socket as { send: (payload: string) => void }).send(JSON.stringify(message));
      }
    }
  };
}

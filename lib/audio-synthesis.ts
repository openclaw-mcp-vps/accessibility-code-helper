export type CueSeverity = "info" | "warning" | "error";

export interface AudioCue {
  severity: CueSeverity;
  label: string;
  message: string;
  file?: string;
  line?: number;
  column?: number;
}

export interface ToneStep {
  frequency: number;
  durationMs: number;
  gapMs: number;
  velocity: number;
}

const severityLexicon: Record<CueSeverity, { intro: string; frequency: number }> = {
  info: {
    intro: "Informational cue",
    frequency: 440
  },
  warning: {
    intro: "Warning cue",
    frequency: 540
  },
  error: {
    intro: "Critical error cue",
    frequency: 720
  }
};

export function cuesToPlainSpeech(summary: string, cues: AudioCue[]): string {
  if (!cues.length) {
    return `${summary}. No blocking issues are active.`;
  }

  const segments = cues.slice(0, 6).map((cue, index) => {
    const location = cue.file ? ` in ${cue.file}${cue.line ? ` line ${cue.line}` : ""}` : "";
    return `${index + 1}. ${severityLexicon[cue.severity].intro}${location}. ${cue.message}`;
  });

  return `${summary}. ${segments.join(" ")}`;
}

export function cuesToSsml(summary: string, cues: AudioCue[]): string {
  if (!cues.length) {
    return `<speak><p>${summary}. No blocking issues are active.</p></speak>`;
  }

  const body = cues
    .slice(0, 8)
    .map((cue) => {
      const severity = severityLexicon[cue.severity].intro;
      const location = cue.file ? ` in ${cue.file}${cue.line ? ` at line ${cue.line}` : ""}` : "";
      return `<p><emphasis level=\"moderate\">${severity}${location}.</emphasis> ${cue.message}</p>`;
    })
    .join("");

  return `<speak><p>${summary}.</p>${body}</speak>`;
}

export function cuesToTonePlan(cues: AudioCue[]): ToneStep[] {
  return cues.slice(0, 10).map((cue) => {
    const base = severityLexicon[cue.severity];

    return {
      frequency: base.frequency,
      durationMs: cue.severity === "error" ? 230 : 170,
      gapMs: 75,
      velocity: cue.severity === "error" ? 0.95 : cue.severity === "warning" ? 0.75 : 0.62
    };
  });
}

export function indentToTactilePattern(indentLevel: number): number[] {
  const safeIndent = Math.max(0, Math.min(indentLevel, 12));

  if (safeIndent === 0) {
    return [35, 25, 35];
  }

  const pulses = new Array(safeIndent).fill(45);
  return pulses.flatMap((pulse, index) => {
    const shouldAddGap = index < pulses.length - 1;
    return shouldAddGap ? [pulse, 30] : [pulse];
  });
}

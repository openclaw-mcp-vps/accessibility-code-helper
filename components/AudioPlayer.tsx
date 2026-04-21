"use client";

import { useMemo, useState } from "react";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import type { ToneStep } from "@/lib/audio-synthesis";

interface AudioPlayerProps {
  summary: string;
  plainSpeech: string;
  ssml: string;
  tonePlan: ToneStep[];
  tactilePattern: number[];
}

export function AudioPlayer({ summary, plainSpeech, ssml, tonePlan, tactilePattern }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const transcript = useMemo(() => plainSpeech.replace(/\s+/g, " ").trim(), [plainSpeech]);

  const playNarration = async () => {
    if (isPlaying) {
      return;
    }

    setIsPlaying(true);

    try {
      await Tone.start();
      const synth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.12, sustain: 0.2, release: 0.18 }
      }).toDestination();

      let startAt = Tone.now();
      for (const step of tonePlan) {
        synth.triggerAttackRelease(step.frequency, step.durationMs / 1000, startAt, step.velocity);
        startAt += (step.durationMs + step.gapMs) / 1000;
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(transcript);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          synth.dispose();
          setIsPlaying(false);
        };

        utterance.onerror = () => {
          synth.dispose();
          setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        synth.dispose();
        setIsPlaying(false);
      }

      if (typeof navigator !== "undefined" && "vibrate" in navigator && tactilePattern.length > 0) {
        navigator.vibrate(tactilePattern);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#2b3f5c] bg-[#111b2b] p-4">
      <p className="text-sm font-medium text-[#d6e6fb]">{summary}</p>
      <p className="text-sm text-[#9fb1cc]">{transcript}</p>
      <Button type="button" onClick={playNarration} disabled={isPlaying}>
        {isPlaying ? "Playing narration..." : "Play audio cue"}
      </Button>
      <details className="rounded-md border border-[#253a56] bg-[#0f1828] p-3">
        <summary className="cursor-pointer text-sm text-[#b3c8e4]">Show generated SSML</summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-[#93aac6]">{ssml}</pre>
      </details>
    </div>
  );
}

import { NextResponse } from "next/server";
import { buildAccessibilityAudioResponse, type VisualDebugPayload } from "@/lib/accessibility-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as VisualDebugPayload | null;

  if (!payload) {
    return NextResponse.json({ error: "Provide a JSON body with debugging diagnostics." }, { status: 400 });
  }

  const response = buildAccessibilityAudioResponse(payload);
  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export function GET() {
  return NextResponse.json({
    message: "Send a POST request containing diagnostics, stackFrames, currentSymbol, and indentLevel."
  });
}

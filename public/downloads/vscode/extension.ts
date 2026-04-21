import * as vscode from "vscode";

interface AudioCueResponse {
  summary: string;
  plainSpeech: string;
}

function getActiveLineText(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  const line = editor.document.lineAt(editor.selection.active.line);
  return line.text.trim();
}

async function narrateDiagnostics(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage("No active editor found.");
    return;
  }

  const uri = editor.document.uri;
  const diagnostics = vscode.languages.getDiagnostics(uri);

  if (!diagnostics.length) {
    vscode.window.showInformationMessage("No diagnostics found for this file.");
    return;
  }

  const top = diagnostics[0];
  const message = `Top issue: ${top.message}. Line ${top.range.start.line + 1}.`;
  vscode.window.showInformationMessage(message);
}

async function sendCurrentContextToApi(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage("No active editor for accessibility narration.");
    return;
  }

  const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
  const apiUrl = vscode.workspace
    .getConfiguration("accessibilityCodeHelper")
    .get<string>("apiUrl", "http://localhost:3000/api/accessibility/audio-cues");

  const payload = {
    environment: "VS Code",
    currentSymbol: editor.document.fileName,
    indentLevel: editor.selection.active.character,
    diagnostics: diagnostics.slice(0, 8).map((diagnostic) => ({
      message: diagnostic.message,
      severity:
        diagnostic.severity === vscode.DiagnosticSeverity.Error
          ? "error"
          : diagnostic.severity === vscode.DiagnosticSeverity.Warning
            ? "warning"
            : "info",
      file: editor.document.fileName,
      line: diagnostic.range.start.line + 1,
      column: diagnostic.range.start.character + 1
    }))
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      vscode.window.showErrorMessage(`Accessibility API error: ${response.status}`);
      return;
    }

    const body = (await response.json()) as AudioCueResponse;
    vscode.window.showInformationMessage(body.summary || body.plainSpeech);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    vscode.window.showErrorMessage(`Unable to reach accessibility API: ${message}`);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const narrateLine = vscode.commands.registerCommand("accessibilityCodeHelper.narrateActiveLine", () => {
    const line = getActiveLineText();

    if (!line) {
      vscode.window.showInformationMessage("No active line available.");
      return;
    }

    vscode.window.showInformationMessage(`Active line: ${line}`);
  });

  const narrateIssues = vscode.commands.registerCommand("accessibilityCodeHelper.narrateDiagnostics", narrateDiagnostics);
  const sendToApi = vscode.commands.registerCommand(
    "accessibilityCodeHelper.sendCurrentContextToApi",
    sendCurrentContextToApi
  );

  context.subscriptions.push(narrateLine, narrateIssues, sendToApi);
}

export function deactivate(): void {
  // No teardown required.
}

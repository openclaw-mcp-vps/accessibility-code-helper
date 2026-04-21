# Accessibility Code Helper VS Code Plugin

1. Create a VS Code extension project with `yo code`.
2. Replace the generated `src/extension.ts` with this repository's `extension.ts`.
3. Add settings schema key `accessibilityCodeHelper.apiUrl` to your extension manifest.
4. Package with `vsce package` and install using `code --install-extension <file>.vsix`.

## Commands

- `accessibilityCodeHelper.narrateActiveLine`
- `accessibilityCodeHelper.narrateDiagnostics`
- `accessibilityCodeHelper.sendCurrentContextToApi`

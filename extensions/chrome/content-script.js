(() => {
  const sendCue = (payload) => {
    try {
      chrome.runtime.sendMessage({ type: "DEBUG_CUE", payload });
    } catch {
      // Ignore message failures on unsupported pages.
    }
  };

  const originalError = console.error.bind(console);

  console.error = (...args) => {
    originalError(...args);

    const message = args
      .map((entry) => {
        if (typeof entry === "string") {
          return entry;
        }

        try {
          return JSON.stringify(entry);
        } catch {
          return String(entry);
        }
      })
      .join(" ");

    sendCue({
      source: "console.error",
      severity: "error",
      message,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  };

  window.addEventListener("error", (event) => {
    sendCue({
      source: "window.error",
      severity: "error",
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason =
      typeof event.reason === "string"
        ? event.reason
        : event.reason && typeof event.reason.message === "string"
          ? event.reason.message
          : "Unhandled rejection";

    sendCue({
      source: "unhandledrejection",
      severity: "warning",
      message: reason,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.shiftKey && event.code === "KeyN") {
      const focused = document.activeElement;
      const focusedText =
        focused && (focused.getAttribute("aria-label") || focused.textContent || focused.id || focused.tagName)
          ? (focused.getAttribute("aria-label") || focused.textContent || focused.id || focused.tagName)
          : "No focused context detected";

      sendCue({
        source: "shortcut",
        severity: "info",
        message: `Focused context: ${String(focusedText).trim().slice(0, 180)}`,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    }
  });
})();

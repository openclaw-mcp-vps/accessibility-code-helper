const queue = [];

function speak(text) {
  chrome.tts.speak(text, {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    enqueue: false
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== "DEBUG_CUE") {
    return;
  }

  const payload = message.payload || {};
  const severity = String(payload.severity || "info");
  const prefix = severity === "error" ? "Critical error" : severity === "warning" ? "Warning" : "Code update";
  const narration = `${prefix}. ${String(payload.message || "No detail available")}`;

  queue.push({ narration, createdAt: Date.now() });

  if (queue.length > 1) {
    return;
  }

  const flush = () => {
    const current = queue.shift();
    if (!current) {
      return;
    }

    speak(current.narration);

    setTimeout(() => {
      flush();
    }, 1200);
  };

  flush();
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "narrate-focused-context") {
    speak("Narrating focused coding context now.");
  }
});

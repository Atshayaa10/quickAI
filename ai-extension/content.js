let bubble = null;

document.addEventListener("mouseup", (e) => {
  setTimeout(() => {
    const selected = window.getSelection().toString().trim();
    if (selected.length > 10) {
      showBubble(e.pageX, e.pageY, selected);
    } else {
      hideBubble();
    }
  }, 50);
});

document.addEventListener("mousedown", (e) => {
  if (bubble && !bubble.contains(e.target)) hideBubble();
});

function showBubble(x, y, text) {
  hideBubble();
  bubble = document.createElement("div");
  bubble.id = "quickai-bubble";
  bubble.innerHTML = `
    <div class="qai-btn" data-action="explain">💡 Explain</div>
    <div class="qai-btn" data-action="rewrite">✍️ Rewrite</div>
    <div class="qai-btn" data-action="summarize">📝 Summarize</div>
    <div class="qai-btn" data-action="reply">💬 Reply</div>
  `;
  bubble.style.left = Math.min(x, window.innerWidth - 240) + "px";
  bubble.style.top = (y + window.scrollY - 55) + "px";
  document.body.appendChild(bubble);
  bubble.querySelectorAll(".qai-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sendToSidebar(btn.dataset.action, text);
      hideBubble();
    });
  });
}

function hideBubble() {
  if (bubble) { bubble.remove(); bubble = null; }
}

function sendToSidebar(action, text) {
  const prompts = {
    explain:   "Explain this in simple, clear words:\n\n",
    rewrite:   "Rewrite this professionally and clearly:\n\n",
    summarize: "Summarize this in 2-3 sentences:\n\n",
    reply:     "Write a professional reply to this message:\n\n"
  };
  chrome.runtime.sendMessage({
    type: "OPEN_SIDEBAR_WITH_TEXT",
    action, text,
    prompt: prompts[action] + text
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "CONTEXT_MENU_ACTION") {
    chrome.runtime.sendMessage({
      type: "OPEN_SIDEBAR_WITH_TEXT",
      action: "custom", text: msg.text,
      prompt: msg.action + ":\n\n" + msg.text
    });
  }
});

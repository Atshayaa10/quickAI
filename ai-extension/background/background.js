chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "quickai-explain", title: "QuickAI: Explain this", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "quickai-rewrite", title: "QuickAI: Rewrite professionally", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "quickai-summarize", title: "QuickAI: Summarize", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "quickai-reply", title: "QuickAI: Write a reply", contexts: ["selection"] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const actions = {
    "quickai-explain": "Explain this in simple words",
    "quickai-rewrite": "Rewrite this professionally",
    "quickai-summarize": "Summarize this briefly",
    "quickai-reply": "Write a professional reply to this"
  };
  const prompt = actions[info.menuItemId];
  if (prompt && info.selectionText) {
    chrome.sidePanel.open({ tabId: tab.id });
    setTimeout(() => chrome.runtime.sendMessage({ type:"CONTEXT_MENU_ACTION", text:info.selectionText, action:prompt }), 600);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GROQ_API_CALL") { handleGroqCall(msg.payload).then(sendResponse); return true; }
});

async function handleGroqCall({ apiKey, messages, model }) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
      body: JSON.stringify({ model: model||"llama-3.1-8b-instant", messages, max_tokens:1024, temperature:0.7 })
    });
    const data = await res.json();
    if (data.error) return { error: data.error.message };
    return { result: data.choices[0].message.content };
  } catch(e) { return { error: e.message }; }
}

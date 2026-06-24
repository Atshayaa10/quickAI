<h1 align="center">QuickAI — AI Assistant Chrome Extension</h1>

<p align="center">
  <strong>Explain, Rewrite, Summarize & Chat — powered by Groq (100% Free)</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/AI-Groq%20API-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Models-Llama%203%20%7C%20Mixtral%20%7C%20Gemma-green?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-purple?style=flat-square" />
</p>

---

## What is QuickAI?

**QuickAI** is a powerful Chrome Extension that brings AI assistance to **every webpage** you visit — completely free. Highlight any text and an AI bubble instantly appears. Use the sidebar for a full chat experience. No subscriptions, no limits — just paste your free Groq API key and go.

### Features

| Feature | Description |
|---|---|
| **Text Bubble** | Highlight any text and a floating AI action bubble appears instantly |
| **AI Sidebar** | A full chat panel accessible from any tab |
| **Right-Click Menu** | Context menu options on selected text |
| **Privacy First** | Your API key is stored locally in Chrome — never sent to any server |
| **100% Free** | Uses Groq's free-tier API — no credit card needed |

### How It Works

1. **Highlight** any text on any webpage
2. A **floating bubble** appears with: `Explain`, `Rewrite`, `Summarize`, `Reply`
3. Click an action and the **AI Sidebar** opens with the result
4. Continue **chatting** with the AI in the sidebar
5. Or use **right-click** for context menu shortcuts

---

## Setup — Install in Chrome (Developer Mode)

### Step 1: Get a FREE Groq API Key

1. Go to **[console.groq.com](https://console.groq.com)**
2. Sign up for a free account
3. Navigate to **API Keys** and click **"Create API Key"**
4. Copy your key (starts with `gsk_...`)

> Groq is completely free — no credit card required.

---

### Step 2: Download the Extension

**Option A — Clone with Git:**
```bash
git clone https://github.com/Atshayaa10/quickAI.git
cd quickAI
```

**Option B — Download ZIP:**
1. Click the green **"Code"** button at the top of this page
2. Select **"Download ZIP"**
3. Extract the ZIP to a folder on your computer

---

### Step 3: Load into Chrome

1. Open Chrome and navigate to: **`chrome://extensions`**
2. In the top-right corner, enable **"Developer mode"** (toggle it ON)
3. Click **"Load unpacked"** button (top-left)
4. Browse to the extracted folder and select the **`ai-extension`** folder
5. **QuickAI** will appear in your extensions list

> Tip: Pin QuickAI to your toolbar by clicking the puzzle icon in Chrome and pinning **QuickAI**.

---

### Step 4: Add Your API Key

1. Click the **QuickAI** icon in your Chrome toolbar
2. Paste your Groq API key in the **"Groq API Key"** field
3. Click **"Save & Verify Key"**
4. You'll see a green confirmation message — you're ready!

---

## Project Structure

```
quickAI/
└── ai-extension/
    ├── manifest.json          # Extension config (Manifest V3)
    ├── content.js             # Injects AI bubble on all webpages
    ├── content.css            # Styles for the floating bubble
    ├── background/
    │   └── background.js      # Service worker: Groq API calls, context menus
    ├── popup/
    │   ├── popup.html         # Extension popup UI (API key + model selector)
    │   └── popup.js           # Popup logic (save key, open sidebar)
    ├── sidebar/
    │   ├── sidebar.html       # Full AI chat sidebar UI
    │   └── sidebar.js         # Sidebar logic (chat, quick actions)
    └── icons/
        ├── icon16.png
        ├── icon48.png
        └── icon128.png
```

---

## How the Extension Works (Technical)

```
User highlights text
        |
        v
  content.js detects selection
        |
        v
  Floating bubble appears (Explain | Rewrite | Summarize | Reply)
        |
        v
  User clicks action -> message sent to background.js
        |
        v
  background.js calls Groq API (fetch to api.groq.com)
        |
        v
  AI sidebar opens -> response displayed in chat
```

**Permissions used:**

| Permission | Why |
|---|---|
| `activeTab` | Read content from the current page |
| `storage` | Save API key and model preference locally |
| `contextMenus` | Add right-click menu options |
| `sidePanel` | Display the AI chat sidebar |
| `https://api.groq.com/*` | Make API calls to Groq |

---

## Privacy & Security

- Your API key is stored **only in Chrome's local storage** on your device
- API calls go **directly from your browser to Groq** — no proxy, no middleman
- No data is collected, tracked, or stored externally
- The extension only reads selected text — it does **not** access your full browsing history

---

## Usage Tips

- **Highlight 10+ characters** of text to trigger the AI bubble
- Press **Enter** to send in the sidebar, **Shift+Enter** for a new line
- Use **Quick Action buttons** in the sidebar for page-level prompts
- Use **right-click** for context menu shortcuts

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Extension not loading | Make sure you selected the `ai-extension` folder (not the parent folder) |
| Invalid API Key error | Double-check you copied the full key from console.groq.com |
| Bubble not appearing | Reload the webpage after installing the extension |
| Sidebar not opening | Try clicking the toolbar icon to open it manually |

---

## Roadmap

- [ ] Custom prompt templates
- [ ] Chat history persistence
- [ ] Page summarization (full page, not just selected text)
- [ ] Export conversations
- [ ] Multiple language support
- [ ] Dark mode toggle in sidebar

---

## License

MIT License — free to use, modify, and distribute.

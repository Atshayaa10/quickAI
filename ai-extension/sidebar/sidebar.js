(function() {
  'use strict';

  let apiKey = '';
  let history = [];

  const chatEl   = document.getElementById('chat');
  const inputEl  = document.getElementById('chatInput');
  const sendBtn  = document.getElementById('sendBtn');

  // Load saved settings
  chrome.storage.local.get(['groqApiKey'], function(data) {
    if (!data.groqApiKey) {
      showNoKey();
      return;
    }
    apiKey = data.groqApiKey;
    addMessage('ai', 'Hi! I\'m QuickAI. Highlight text on any page and I\'ll explain, rewrite, or summarize it. Or just ask me anything!');
  });

  // Quick action buttons
  document.querySelectorAll('.qa-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var prompt = btn.dataset.prompt;
      addMessage('user', btn.textContent.trim());
      sendToGroq(prompt);
    });
  });

  // Send button click
  sendBtn.addEventListener('click', handleSend);

  // Enter to send
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    setTimeout(function() {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
    }, 0);
  });

  // Listen for messages from content script / background
  chrome.runtime.onMessage.addListener(function(msg) {
    if (msg.type === 'OPEN_SIDEBAR_WITH_TEXT' || msg.type === 'CONTEXT_MENU_ACTION') {
      var prompt = msg.prompt || (msg.action + ':\n\n' + msg.text);
      var displayText = prompt.length > 100
        ? prompt.substring(0, 100) + '...'
        : prompt;
      addMessage('user', displayText);
      sendToGroq(prompt);
    }
  });

  function handleSend() {
    var text = inputEl.value.trim();
    if (!text) return;
    if (!apiKey) { showNoKey(); return; }
    inputEl.value = '';
    inputEl.style.height = 'auto';
    addMessage('user', text);
    sendToGroq(text);
  }

  function sendToGroq(userText) {
    if (!apiKey) { showNoKey(); return; }

    history.push({ role: 'user', content: userText });

    var thinkingEl = addMessage('thinking', 'Thinking...');
    sendBtn.disabled = true;

    var messages = [
      { role: 'system', content: 'You are QuickAI, a helpful browser assistant. Be concise, clear, and friendly.' }
    ].concat(history.slice(-10));

    chrome.runtime.sendMessage(
      { type: 'GROQ_API_CALL', payload: { apiKey: apiKey, model: 'llama-3.1-8b-instant', messages: messages } },
      function(res) {
        if (thinkingEl && thinkingEl.parentNode) thinkingEl.remove();
        sendBtn.disabled = false;

        if (!res) {
          addMessage('error', 'No response from background. Try reloading.');
          history.pop();
          return;
        }
        if (res.error) {
          addMessage('error', 'Error: ' + res.error);
          history.pop();
          return;
        }
        history.push({ role: 'assistant', content: res.result });
        addAIMessage(res.result);
      }
    );
  }

  function addMessage(type, text) {
    var el = document.createElement('div');
    el.className = 'msg ' + type;
    el.textContent = text;
    chatEl.appendChild(el);
    chatEl.scrollTop = chatEl.scrollHeight;
    return el;
  }

  function addAIMessage(text) {
    var el = document.createElement('div');
    el.className = 'msg ai';

    var formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#e8e8e8;padding:1px 5px;border-radius:3px;font-size:11px">$1</code>')
      .replace(/\n/g, '<br>');

    el.innerHTML = formatted;

    var copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy response';
    copyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(text).then(function() {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(function() { copyBtn.textContent = 'Copy response'; }, 1500);
      });
    });
    el.appendChild(copyBtn);

    chatEl.appendChild(el);
    chatEl.scrollTop = chatEl.scrollHeight;
    return el;
  }

  function showNoKey() {
    chatEl.innerHTML = '';
    var div = document.createElement('div');
    div.className = 'no-key';
    div.innerHTML = '<h3>Setup Required</h3><p>Paste your free Groq API key to get started.<br>Get it free at <strong>console.groq.com</strong></p>';

    var btn = document.createElement('button');
    btn.className = 'setup-link';
    btn.textContent = 'Open Settings';
    btn.addEventListener('click', function() {
      chrome.action.openPopup();
    });
    div.appendChild(btn);
    chatEl.appendChild(div);
  }

})();

(function() {
  'use strict';

  var apiKeyEl = document.getElementById('apiKey');
  var statusEl = document.getElementById('status');
  var saveBtn  = document.getElementById('saveBtn');

  // Load saved key
  chrome.storage.local.get(['groqApiKey'], function(data) {
    if (data.groqApiKey) apiKeyEl.value = data.groqApiKey;
  });

  // Save and verify key
  saveBtn.addEventListener('click', function() {
    var key = apiKeyEl.value.trim();

    if (!key.startsWith('gsk_')) {
      showStatus('Key must start with gsk_', 'err');
      return;
    }

    saveBtn.textContent = 'Verifying...';
    saveBtn.disabled = true;

    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        showStatus('Error: ' + data.error.message, 'err');
      } else {
        chrome.storage.local.set({ groqApiKey: key });
        showStatus('Key verified! QuickAI is ready.', 'ok');
      }
    })
    .catch(function(e) {
      showStatus('Connection error: ' + e.message, 'err');
    })
    .finally(function() {
      saveBtn.textContent = 'Save & Verify Key';
      saveBtn.disabled = false;
    });
  });

  // Open sidebar
  document.getElementById('openSidebar').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
      }
      window.close();
    });
  });

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'status ' + type;
  }

})();

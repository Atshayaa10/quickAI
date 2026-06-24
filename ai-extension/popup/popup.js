(function() {
  'use strict';

  var apiKeyEl = document.getElementById('apiKey');
  var modelEl  = document.getElementById('model');
  var statusEl = document.getElementById('status');
  var saveBtn  = document.getElementById('saveBtn');

  // Load saved values
  chrome.storage.local.get(['groqApiKey', 'groqModel'], function(data) {
    if (data.groqApiKey) apiKeyEl.value = data.groqApiKey;
    if (data.groqModel)  modelEl.value  = data.groqModel;
  });

  // Save and verify key
  saveBtn.addEventListener('click', function() {
    var key   = apiKeyEl.value.trim();
    var model = modelEl.value;

    if (!key.startsWith('gsk_')) {
      showStatus('Key must start with gsk_', 'err');
      return;
    }

    saveBtn.textContent = 'Verifying...';
    saveBtn.disabled = true;

    // Test with current active model
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
        chrome.storage.local.set({ groqApiKey: key, groqModel: model });
        showStatus('✓ Key verified! QuickAI is ready.', 'ok');
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

  // Model change — save immediately
  modelEl.addEventListener('change', function() {
    chrome.storage.local.set({ groqModel: modelEl.value });
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

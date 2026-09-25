// 1. Corrected protocol to wss:// for WebSockets
const WS_URL = "wss://core-remote-relay.onrender.com"; 
const SECRET_TOKEN = "DHANANJAY_CYBER_KEY_99";
const MASTER_PIN = "4862"; // Master PIN required to execute commands

// Initialize WebSocket Connection
const ws = new WebSocket(WS_URL);

// DOM Elements
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const logBox = document.getElementById('log-box');
const pinInput = document.getElementById('pin-input'); // Pin for Windows unlock
const userPinInput = document.getElementById('userPin'); // Pin for Web Deck access

function log(msg) {
  logBox.innerText = `> ${msg}\n` + logBox.innerText;
}

// Security Wrapper Function
function sendCommand(action, extraData = {}) {
  // Check if Web Deck PIN matches
  if (userPinInput && userPinInput.value !== MASTER_PIN) {
    alert("⛔ ACCESS DENIED: Invalid Security PIN");
    log("ERROR: INVALID SECURITY PIN.");
    return;
  }

  if (ws.readyState !== WebSocket.OPEN) {
    alert("⚠️ Connection not open yet. Please wait...");
    return;
  }

  // Send authenticated command payload
  ws.send(JSON.stringify({
    action: action,
    token: SECRET_TOKEN,
    ...extraData
  }));
}

// WebSocket Event Listeners
ws.onopen = () => {
  if (statusDot) statusDot.classList.add('online');
  if (statusText) statusText.innerText = 'LINK ACTIVE';
  log('CONNECTED TO RELAY BRIDGE.');
};

ws.onclose = () => {
  if (statusDot) statusDot.classList.remove('online');
  if (statusText) statusText.innerText = 'DISCONNECTED';
  log('CONNECTION LOST TO SERVER.');
};

ws.onerror = (err) => {
  log('WEBSOCKET ERROR OCCURRED.');
  console.error('WebSocket Error:', err);
};

// UI Command Handlers (Routed through sendCommand security check)
document.getElementById('lock-btn')?.addEventListener('click', () => {
  log('SENDING LOCK COMMAND...');
  sendCommand('LOCK');
});

document.getElementById('unlock-btn')?.addEventListener('click', () => {
  const pin = pinInput ? pinInput.value : '';
  log(`SENDING UNLOCK COMMAND...`);
  sendCommand('UNLOCK', { pin: pin });
});

// Quick Launch Application Buttons
document.querySelectorAll('.btn-app').forEach(button => {
  button.addEventListener('click', () => {
    const appKey = button.getAttribute('data-app');
    log(`LAUNCHING ${appKey.toUpperCase()}...`);
    sendCommand('LAUNCH_APP', { app: appKey });
  });
});
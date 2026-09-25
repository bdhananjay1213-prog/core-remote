const ws = new WebSocket(`ws://${window.location.hostname}:8080`);
const SECRET_TOKEN = "DHANANJAY_CYBER_KEY_99";

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const logBox = document.getElementById('log-box');
const pinInput = document.getElementById('pin-input');

function log(msg) {
  logBox.innerText = `> ${msg}\n` + logBox.innerText;
}

ws.onopen = () => {
  statusDot.classList.add('online');
  statusText.innerText = 'LINK ACTIVE';
  log('CONNECTED TO RELAY BRIDGE.');
};

ws.onclose = () => {
  statusDot.classList.remove('online');
  statusText.innerText = 'DISCONNECTED';
  log('CONNECTION LOST TO SERVER.');
};

document.getElementById('lock-btn').addEventListener('click', () => {
  log('SENDING LOCK COMMAND...');
  ws.send(JSON.stringify({
    action: 'LOCK',
    token: SECRET_TOKEN
  }));
});

document.getElementById('unlock-btn').addEventListener('click', () => {
  const pin = pinInput.value;
  log(`SENDING UNLOCK COMMAND (PIN: ****)...`);
  ws.send(JSON.stringify({
    action: 'UNLOCK',
    token: SECRET_TOKEN,
    pin: pin
  }));
});
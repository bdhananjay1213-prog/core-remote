const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();

// Serve static assets from mobile-ui if accessed directly
app.use(express.static(path.join(__dirname, '../mobile-ui')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Track active connections
let laptopSocket = null;

wss.on('connection', (ws) => {
  console.log('⚡ New WebSocket connection established.');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // Handle registration from Python laptop listener
      if (data.type === 'register' && data.role === 'laptop') {
        laptopSocket = ws;
        console.log('💻 Laptop Agent connected and registered.');
        ws.send(JSON.stringify({ status: 'INFO', msg: 'Laptop registered successfully' }));
        return;
      }

      // Forward action commands to registered laptop agent
      if (data.action) {
        console.log(`📩 Command received: ${data.action}`);
        if (laptopSocket && laptopSocket.readyState === WebSocket.OPEN) {
          laptopSocket.send(JSON.stringify(data));
          console.log(`➡️ Command ${data.action} forwarded to laptop.`);
        } else {
          console.log('⚠️ Laptop Agent is offline. Command dropped.');
        }
      }
    } catch (err) {
      console.error('❌ Error processing message:', err.message);
    }
  });

  ws.on('close', () => {
    if (ws === laptopSocket) {
      console.log('❌ Laptop Agent disconnected.');
      laptopSocket = null;
    }
  });
});

// Dynamic Port Assignment for Render / Cloud Platforms
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Relay Server running on port ${PORT}`);
});
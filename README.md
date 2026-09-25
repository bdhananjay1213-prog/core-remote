# ⚡ CORE REMOTE — Futuristic Cloud Control Deck

A lightweight, real-time, bi-directional remote control application built to manage active Windows desktop sessions globally via cellular networks (4G/5G). 

Featuring a cyberpunk-themed mobile interface, an online Node.js relay bridge, and a local Python agent executing native OS-level commands.

---

## 🏗️ Architecture

  [ Mobile Deck (Netlify UI) ]
               │
               │ (HTTPS / WSS)
               ▼
   [ Cloud Relay Bridge (Render) ]
   (Node.js WebSocket Server)
               ▲
               │ (WSS)
               │  
   [ Laptop Agent (Python / Windows) ]

   ---

🔥 Features
🔐 Master Security PIN: Client-side authentication layer protecting against unauthorized endpoint calls.

🔒 Instant Workstation Lock: Low-level OS call via ctypes.windll.user32.LockWorkStation().

🚀 Quick App Launcher: Asynchronous execution (subprocess.Popen) for daily tools like VS Code, Chrome, Spotify, and Task Manager.

🌍 Global Reach: Secure WebSocket protocol (wss://) enabling control over cellular data anywhere in the world.

---

🛠️ Project Structure
Plaintext
laptop-remote/
├── agent/
│   └── listener.py       # Python desktop execution agent
├── server/
│   ├── package.json      # Node.js dependencies
│   └── index.js          # Cloud WebSocket relay bridge
└── mobile-ui/
    ├── index.html        # Cyberpunk control deck layout
    ├── style.css         # Styling & responsive design
    └── app.js            # Client WebSocket logic & security check

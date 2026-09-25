# ⚡ CORE REMOTE — Futuristic Cloud Control Deck

A lightweight, real-time, bi-directional remote control application built to manage active Windows desktop sessions globally via cellular networks (4G/5G). 

Featuring a cyberpunk-themed mobile interface, an online Node.js relay bridge, and a local Python agent executing native OS-level commands.

---

## 🏗️ Architecture

```text
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

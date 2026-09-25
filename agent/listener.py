import asyncio
import os
import time
import json
import ctypes
import subprocess
import websockets

SERVER_URI = "ws://localhost:8080"
SECRET_TOKEN = "DHANANJAY_CYBER_KEY_99"

def lock_windows():
    print("🔒 [COMMAND RECEIVED] Locking Windows Workstation...")
    ctypes.windll.user32.LockWorkStation()

def unlock_windows(pin="4862"):
    print(f"🔓 [COMMAND RECEIVED] Unlocking Windows Workstation with PIN: {pin}...")
    
    # PowerShell script to wake lock screen and send PIN digits
    ps_command = f'''
    $wsh = New-Object -ComObject WScript.Shell;
    $wsh.SendKeys(' ');
    Start-Sleep -Milliseconds 800;
    $wsh.SendKeys('{pin}');
    Start-Sleep -Milliseconds 200;
    $wsh.SendKeys('{{ENTER}}');
    '''
    
    # Execute the PowerShell automation script
    subprocess.run(["powershell", "-Command", ps_command], capture_output=True)

async def listen():
    print(f"⚡ Laptop Agent Active. Connecting to Relay Server at {SERVER_URI}...")
    while True:
        try:
            async with websockets.connect(SERVER_URI) as websocket:
                print("🟢 Connected to WebSocket Relay! Waiting for commands...\n")
                
                await websocket.send(json.dumps({"type": "register", "role": "laptop"}))

                async for message in websocket:
                    data = json.loads(message)
                    print(f"📩 Action Payload: {data}")
                    
                    if data.get("token") != SECRET_TOKEN:
                        print("⚠️ Unauthorized token attempt ignored.")
                        continue

                    action = data.get("action")
                    if action == "LOCK":
                        lock_windows()
                    elif action == "UNLOCK":
                        pin = data.get("pin", "4862")
                        unlock_windows(pin=pin)

        except (websockets.exceptions.ConnectionClosedError, ConnectionRefusedError):
            print("❌ Connection lost or server offline. Retrying in 3 seconds...")
            await asyncio.sleep(3)
        except Exception as e:
            print(f"⚠️ Error: {e}")
            await asyncio.sleep(3)

if __name__ == "__main__":
    asyncio.run(listen())
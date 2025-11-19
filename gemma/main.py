from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import subprocess
import asyncio

app = FastAPI(title="Gemma3 API")

MODEL = "gemma3:4b"

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def root():
    return {
        "message": "Gemma 3 API is running! Happy development",
        "health": "OK",
        "model": MODEL
    }

@app.post("/infer")
def infer(req: PromptRequest):
    try:
        # Run ollama gemma3:1b with the prompt
        result = subprocess.run(
            ["ollama", "run", MODEL, req.prompt],
            capture_output=True, text=True, check=True
        )
        return {
            "response": result.stdout.strip()
        }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=e.stderr)
    




# ---------------------------------------------------------------------
#   WEBSOCKET STREAMING ENDPOINT
# ---------------------------------------------------------------------

@app.websocket("/ws/infer")
async def websocket_infer(ws: WebSocket):
    await ws.accept()

    try:
        data = await ws.receive_text()
        prompt = data.strip()

        process = subprocess.Popen(
            ["ollama", "run", MODEL, prompt],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        while True:
            line = process.stdout.readline()
            if line:
                await ws.send_text(line.rstrip())
            else:
                break
        
        process.wait()
        await ws.send_text("[END]")
    
    except WebSocketDisconnect:
        print("WebSocket disconnected.")
    except Exception as e:
        await ws.send_text(f"Error: {str(e)}")
    finally:
        await ws.close()


@app.get("/health")
def health():
    return {"status": "OK"}

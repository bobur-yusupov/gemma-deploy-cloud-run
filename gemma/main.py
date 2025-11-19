from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
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
    

@app.post("/infer-stream")
def infer_stream(request: PromptRequest):
    def generate():
        process = subprocess.Popen(
            ["ollama", "run", MODEL, req.prompt],
            stdout=subprocess.PIPE,
            text=True
        )
        for line in process.stdout:
            yield line
    return StreamingResponse(generate(), media_type="text/plain")


@app.get("/health")
def health():
    return {"status": "OK"}

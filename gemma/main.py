from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess

app = FastAPI(title="Gemma3 API")

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def root():
    return {
        "message": "Gemma 3 API is running! Happy development",
        "health": "OK",
        "model": "gemma3:4b"
    }

@app.post("/infer")
def infer(req: PromptRequest):
    try:
        # Run ollama gemma3:1b with the prompt
        result = subprocess.run(
            ["ollama", "run", "gemma3:1b", req.prompt],
            capture_output=True, text=True, check=True
        )
        return {"response": result.stdout.strip()}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=e.stderr)

@app.get("/health")
def health():
    return {"status": "OK"}

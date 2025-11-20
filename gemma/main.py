from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import ollama

app = FastAPI(title="Gemma3 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL = "gemma3:1b"

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
    # Inference endpoint
    result = ollama.generate(
        model=MODEL,
        prompt=req.prompt
    )
    return {"response": result["response"]}
    

@app.post("/infer-stream")
def infer_stream(req: PromptRequest):
    def generate():
        stream = ollama.generate(
            model=MODEL,
            prompt=req.prompt,
            stream=True
        )

        for chunk in stream:
            text = chunk["response"]
            if text:
                yield text

    return StreamingResponse(generate(), media_type="text/plain; charset=utf-8")


@app.get("/health")
def health():
    return {"status": "OK"}

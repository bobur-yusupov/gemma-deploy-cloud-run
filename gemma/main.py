from fastapi import FastAPI
import subprocess

app = FastAPI()

MODEL = "gemma:1b"

@app.get("/infer")
def infer(prompt: str):
    result = subprocess.run(
        ["ollama", "run", MODEL, prompt],
        capture_output=True,
        text=True
    )

    return {
        "response": result.stdout.strip()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import json

app = FastAPI(title="Code Explanation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str = "python"

GEMMA_URL = "https://gemma-service-530483421367.europe-west4.run.app/infer-stream"

@app.post("/explain")
async def explain_code(request: CodeRequest):
    prompt = f"""Explain the following {request.language} code in simple terms:

```{request.language}
{request.code}
```

Provide a clear explanation covering:
1. What the code does
2. Key components and their purpose
3. How it works step by step"""

    def generate():
        with requests.post(GEMMA_URL, json={"prompt": prompt}, stream=True) as r:
            for chunk in r.iter_lines(decode_unicode=True):
                if chunk:
                    yield f"data: {chunk}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/health")
async def health():
    return {"status": "healthy"}

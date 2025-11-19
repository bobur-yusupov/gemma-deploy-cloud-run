from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx

app = FastAPI(title="Code Explanation API")

# CORS middleware
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
    # Escape triple backticks to avoid breaking the prompt
    safe_code = request.code.replace("```", "`\u200b``")
    
    prompt = f"""Explain the following {request.language} code in simple terms:

```{request.language}
{safe_code}
Provide a clear explanation covering:

What the code does

Key components and their purpose

How it works step by step"""

    async def generate():
        try:
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream("POST", GEMMA_URL, json={"prompt": prompt}) as r:
                    r.raise_for_status() # Raise exception if status is 4xx/5xx
                    async for chunk in r.aiter_text(chunk_size=512):
                        print(chunk)
                        yield chunk.encode("utf-8")
        
        except httpx.RequestError as e:
            yield f"Error connecting to Gemma service: {str(e)}".encode("utf-8")
        except httpx.HTTPStatusError as e:
            yield f"Gemma service returned an error: {str(e)}".encode("utf-8")

    return StreamingResponse(generate(), media_type="text/plain")

@app.get("/health")
async def health():
    return {"status": "healthy"}
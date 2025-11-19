#!/bin/bash
set -e

# Start Ollama server in background
ollama serve &

# Wait a few seconds for server
sleep 5

# Pull model at runtime (once per container)
ollama pull gemma3:1b || true

# Start FastAPI
uvicorn main:app --host 0.0.0.0 --port 8080

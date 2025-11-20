#!/bin/bash
set -e

# Start Ollama server
echo "Starting Ollama..."
ollama serve &
sleep 5

# Pull model if missing (Cloud Run caches image layers, so this is safe)
echo "Pulling model..."
ollama pull gemma3:1b || true

# Start FastAPI + uvicorn
echo "Starting FastAPI..."
exec uvicorn main:app --host 0.0.0.0 --port 8080

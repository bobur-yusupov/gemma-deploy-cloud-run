# Base image with Ollama preinstalled
FROM ollama/ollama:latest

# Set working directory first
WORKDIR /app

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Copy requirements and create venv
COPY requirements.txt .
RUN python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

# Update PATH to use venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy FastAPI app
COPY main.py app.py

# Expose Cloud Run port
EXPOSE 8080

# Override entrypoint and start services
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["ollama serve & (sleep 10 && ollama pull gemma3:1b) & uvicorn app:app --host 0.0.0.0 --port 8080"]

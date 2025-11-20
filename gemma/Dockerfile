# Base image with Ollama preinstalled
FROM ollama/ollama:latest

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set working directory first
WORKDIR /app

# Copy requirements and create venv
COPY requirements.txt .
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip install -r requirements.txt

# Update PATH to use venv

# Copy FastAPI app
COPY main.py /app/main.py

# Expose Cloud Run port
EXPOSE 8080

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Cloud Run starts this
ENTRYPOINT ["/app/start.sh"]

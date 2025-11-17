FROM ollama/ollama:latest

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Python deps
COPY requirements.txt /app/requirements.txt
RUN python3 -m venv /app/.venv
RUN /app/.venv/bin/pip install -r /app/requirements.txt --break-system-packages

ENV PATH="/app/.venv/bin:$PATH"

# Copy app
COPY main.py /app/main.py
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

WORKDIR /app
EXPOSE 8080

# Disable Ollama base image entrypoint
ENTRYPOINT []

# Start Ollama server and FastAPI at runtime
CMD ["/bin/bash", "/app/start.sh"]

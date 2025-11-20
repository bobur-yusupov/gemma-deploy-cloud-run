FROM python:3.14-alpine

LABEL maintainer="github/bobur-yusupov"

RUN apt-get update

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY mainn.py /app/

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

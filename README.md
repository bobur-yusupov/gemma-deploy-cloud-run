# Explain This Code App

An AI-powered code explanation application built with FastAPI and React.

## Features

- 🤖 AI-powered code explanations using Gemma model
- 🔄 Real-time streaming responses
- 💻 Support for multiple programming languages
- 🎨 Modern, responsive UI

## Project Structure

```
.
├── api/              # FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── app/              # React frontend
│   ├── src/
│   └── package.json
└── gemma/            # Gemma model service
```

## Setup Instructions

### Backend (FastAPI)

1. Navigate to the api directory:
```bash
cd api
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the API server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend (React)

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. Make sure both backend and frontend are running
2. Open the app in your browser
3. Select your programming language
4. Paste your code in the left panel
5. Click "Explain Code" to get an AI-generated explanation
6. Watch the explanation stream in real-time on the right panel

## API Endpoints

- `POST /explain` - Explain code (streaming response)
- `GET /health` - Health check

## Technologies Used

- **Backend**: FastAPI, Python
- **Frontend**: React, TypeScript
- **AI Model**: Gemma (deployed on Cloud Run)

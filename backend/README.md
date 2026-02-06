# Career Twin Backend

AI-powered career intelligence system that creates a digital twin of job candidates.

## Features

- Resume parsing with AI
- Role-specific interview simulation
- Real-time answer evaluation
- Comprehensive feedback generation
- Progress tracking

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```
OPENAI_API_KEY=your_key_here
```

3. Run the server:
```bash
uvicorn app.main:app --reload
```

4. API will be available at: http://localhost:8000

## API Endpoints

- POST `/api/profile/create` - Upload resume and create profile
- GET `/api/profile/{candidate_id}` - Get candidate profile
- POST `/api/interview/start` - Start interview session
- POST `/api/interview/answer` - Submit answer
- POST `/api/interview/complete` - Complete interview and get feedback
- GET `/api/feedback/{session_id}` - Get feedback report
- GET `/api/progress/{candidate_id}` - Get progress metrics
- GET `/api/roles` - Get available job roles

## Tech Stack

- FastAPI
- OpenAI GPT-4
- ChromaDB (Vector Database)
- Pydantic
- Python 3.9+

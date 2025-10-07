# Expense Tracker API

FastAPI-based expense tracking system with audio processing capabilities.

## Setup

1. Create virtual environment:
```bash
python3.11 -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize database:
```bash
python init_db.py
```

4. Start server:
```bash
python -m uvicorn main:app --reload --port 8001
```

## API Documentation

Access Swagger UI at: http://localhost:8001/docs

## Environment Variables

Create a `.env` file with:
```ini
GROQ_API_KEY=your_api_key_here
```

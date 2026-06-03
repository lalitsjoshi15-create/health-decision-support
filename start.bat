@echo off
echo Starting Backend API...
start cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn main:app --reload --port 8000"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting! You can close this window.

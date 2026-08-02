@echo off

start cmd /k "cd /d backend && ..\.venv\Scripts\activate && uvicorn app.main:app --port 8001"

start cmd /k "cd /d frontend && npm run dev"
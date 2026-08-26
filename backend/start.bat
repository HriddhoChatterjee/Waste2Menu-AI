@echo off
REM Waste2Menu-AI — Start Backend Server
echo Starting Waste2Menu-AI FastAPI backend on http://127.0.0.1:8000 ...
cd /d %~dp0
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload --log-level info

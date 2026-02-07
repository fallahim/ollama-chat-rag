@echo off
cd /d "%~dp0backend"
if not exist "venv\Scripts\python.exe" (
    echo اول محیط مجازی بساز:
    echo   cd backend
    echo   python -m venv venv
    echo   venv\Scripts\pip.exe install -r requirements.txt
    pause
    exit /b 1
)
echo در حال اجرای سرور روی http://127.0.0.1:8000 ...
echo در مرورگر باز کن: http://localhost:8000
venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
pause

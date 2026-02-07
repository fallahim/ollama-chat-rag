# اجرای سرور چت‌بات - حتماً از همین اسکریپت اجرا کن
$Backend = Join-Path $PSScriptRoot "backend"
$VenvPython = Join-Path $Backend "venv\Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Host "اول محیط مجازی بساز:" -ForegroundColor Red
    Write-Host "  cd $Backend" -ForegroundColor Yellow
    Write-Host "  python -m venv venv" -ForegroundColor Yellow
    Write-Host "  .\venv\Scripts\pip.exe install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

Set-Location $Backend
Write-Host "در حال اجرای سرور روی http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "در مرورگر باز کن: http://localhost:8000" -ForegroundColor Cyan
& $VenvPython -m uvicorn main:app --host 0.0.0.0 --port 8000

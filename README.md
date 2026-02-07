# چت‌بات هوشمند با مدل اوپن‌سورس

چت‌بات محلی با استفاده از **Ollama** و یکی از مدل‌های زبانی اوپن‌سورس (مثل Llama، Mistral، Phi و ...) به همراه رابط کاربری وب.

## پیش‌نیازها

1. **Python 3.10+**
2. **Ollama** — برای اجرای مدل‌های اوپن‌سورس روی سیستم خودت

### نصب Ollama

- ویندوز / مک / لینوکس: از [ollama.com](https://ollama.com) دانلود و نصب کن.
- بعد از نصب، یک مدل با **فارسی خوب** بگیر (در ترمینال):

```bash
ollama run qwen2.5
```

**مدل‌های پیشنهادی برای فارسی:**
- **qwen2.5** (پیش‌فرض) — چندزبانه عالی، فارسی روان. سبک: `ollama pull qwen2.5:7b`
- **Gemma 3 Persian** — مخصوص فارسی: `ollama run mshojaei77/gemma3persian`
- **Dorna** — قوی برای فارسی: `ollama run partai/dorna-llama3`

## راه‌اندازی

### 1. محیط مجازی و وابستگی‌ها (پیشنهادی)

```bash
cd d:\ChatBot
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
```

### 2. اجرای سرور

**ساده‌ترین راه:** دابل‌کلیک روی `run-server.bat` (یا در CMD از روت پروژه اجرا کن):

```cmd
cd /d D:\ChatBot
run-server.bat
```

یا دستی از داخل پوشه **backend** (حتماً مسیر باید backend باشد):

```cmd
cd D:\ChatBot\backend
venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. باز کردن در مرورگر

به آدرس زیر برو:

**http://localhost:8000**

رابط کاربری چت با پشتیبانی فارسی (راست به چپ) باز می‌شود. مدل پیش‌فرض **qwen2.5** است (فارسی خوب). از کشوی «مدل» می‌توانی مدل دیگری انتخاب کنی.

## تنظیمات (اختیاری)

در پوشه `backend` فایل `.env` بساز:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5
```

- اگر Ollama را روی پورت یا ماشین دیگری اجرا می‌کنی، `OLLAMA_BASE_URL` را تغییر بده.
- با `OLLAMA_MODEL` مدل پیش‌فرض را عوض کن.

## ساختار پروژه

```
ChatBot/
├── backend/
│   ├── main.py          # FastAPI + Ollama API
│   ├── config.py        # تنظیمات
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

## API

- `GET /api/health` — وضعیت اتصال به Ollama و لیست مدل‌ها
- `GET /api/models` — لیست مدل‌های نصب‌شده
- `POST /api/chat` — ارسال مکالمه و دریافت پاسخ (با پشتیبانی استریم)

اگر Ollama اجرا نباشد یا مدلی نصب نکرده باشی، در رابط کاربری پیام خطا نمایش داده می‌شود.

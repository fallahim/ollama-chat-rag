<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-Read-64748b?style=for-the-badge&logo=readme&logoColor=white" alt="English"/></a>
  &nbsp;
  <a href="./README.fa.md"><img src="https://img.shields.io/badge/فارسی-فعال-2563eb?style=for-the-badge&logo=readme&logoColor=white" alt="فارسی"/></a>
</p>

# ollama-chat-rag

برنامه چت **خودمیزبان** با **[Ollama](https://ollama.com)** و مدل‌های اوپن‌سورس. گفتگو روی سیستم شما اجرا می‌شود و به API پولی نیاز ندارد. رابط وب **فارسی (RTL)** است؛ نام مخزن به لایه **RAG** (پرسش از روی اسناد) که در نقشه توسعه است اشاره دارد.

---

## قابلیت‌ها

| قابلیت | توضیح |
|--------|--------|
| **مدل محلی** | چت با Ollama |
| **استریم** | پاسخ لحظه‌ای (SSE) |
| **چند مدل** | انتخاب مدل از سایدبار |
| **REST API** | سلامت، لیست مدل‌ها، چت |
| **رابط استاتیک** | از `./frontend` توسط همان سرور FastAPI |

---

## پیش‌نیازها

1. **Python 3.10+**
2. **[Ollama](https://ollama.com)** در حال اجرا

```bash
ollama pull qwen2.5:7b
ollama run qwen2.5
```

**مدل‌های مناسب فارسی:**

- `ollama run mshojaei77/gemma3persian`
- `ollama run partai/dorna-llama3`

---

## راه‌اندازی

از ریشه پروژه (`ollama-chat-rag/`):

### ۱. محیط مجازی و وابستگی‌ها

```bash
cd backend
python -m venv venv
```

**ویندوز:**

```cmd
venv\Scripts\pip install -r requirements.txt
```

**لینوکس / macOS:**

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### ۲. اجرای سرور

**ویندوز** — از ریشه پروژه:

```cmd
.\run-server.bat
```

یا:

```powershell
.\run-server.ps1
```

**دستی** — از `./backend/`:

```bash
# ویندوز
venv\Scripts\python -m uvicorn main:app --host 0.0.0.0 --port 8000

# لینوکس / macOS
venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### ۳. باز کردن رابط

**http://localhost:8000**

---

## تنظیمات

اختیاری: `./backend/.env`

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5
```

---

## ساختار پروژه

```
ollama-chat-rag/
├── backend/
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── run-server.bat
├── run-server.ps1
├── README.md
├── README.fa.md
└── LICENSE
```

---

## API

| متد | مسیر | توضیح |
|-----|------|--------|
| `GET` | `/api/health` | وضعیت Ollama و مدل‌های نصب‌شده |
| `GET` | `/api/models` | لیست مدل‌ها |
| `POST` | `/api/chat` | چت (`stream`: true برای SSE) |

**نمونه** (`POST /api/chat`):

```json
{
  "messages": [{ "role": "user", "content": "سلام" }],
  "model": "qwen2.5",
  "stream": true
}
```

---

## مجوز

[مجوز MIT](./LICENSE)

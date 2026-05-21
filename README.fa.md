<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-Read-64748b?style=for-the-badge&logo=readme&logoColor=white" alt="English"/></a>
  &nbsp;
  <a href="./README.fa.md"><img src="https://img.shields.io/badge/فارسی-فعال-2563eb?style=for-the-badge&logo=readme&logoColor=white" alt="فارسی"/></a>
</p>

# چت‌بات — دستیار محلی با مدل اوپن‌سورس

یک برنامه چت **خودمیزبان** مبتنی بر **[Ollama](https://ollama.com)** و مدل‌های زبانی اوپن‌سورس. گفتگو روی سیستم شما اجرا می‌شود و به API پولی نیاز ندارد. رابط وب **فارسی (RTL)** و انگلیسی دارد، با **RAG** روی اسناد و **جستجوی وب** (DuckDuckGo).

---

## قابلیت‌ها

| قابلیت | توضیح |
|--------|--------|
| **مدل محلی** | چت با Ollama |
| **استریم** | پاسخ لحظه‌ای (SSE) |
| **RAG** | PDF/DOCX؛ بازیابی هیبرید + re-rank |
| **جستجوی وب** | DuckDuckGo بدون API Key |
| **چند مدل** | انتخاب از UI |
| **نمایش فکر** | روشن/خاموش استدلال مدل |
| **پیشرفت آپلود** | آپلود چندفایلی با SSE |
| **REST API** | سلامت، مدل‌ها، چت، اسناد |

---

## پیش‌نیازها

1. **Python 3.10+**
2. **[Ollama](https://ollama.com)**

```bash
ollama pull qwen2.5:7b
ollama run qwen2.5
ollama pull nomic-embed-text
```

---

## راه‌اندازی

```bash
cd backend
python -m venv venv
venv\Scripts\pip install -r requirements.txt
```

اجرا: `run-server.bat` یا:

```cmd
cd backend
venv\Scripts\python -m uvicorn main:app --host 0.0.0.0 --port 8765
```

مرورگر: **http://localhost:8765**

---

## RAG

1. `ollama pull nomic-embed-text`
2. **+ آپلود** → PDF یا DOCX
3. **جستجو در اسناد (RAG)** را روشن کنید

---

## تنظیمات

فایل `backend/.env`:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5
OLLAMA_EMBED_MODEL=nomic-embed-text
```

---

## API

| متد | مسیر | توضیح |
|-----|------|--------|
| `GET` | `/api/health` | وضعیت Ollama |
| `POST` | `/api/chat` | چت |
| `POST` | `/api/documents/upload` | آپلود |
| `DELETE` | `/api/documents/{id}` | حذف سند |

---

## مجوز

[مجوز MIT](./LICENSE)

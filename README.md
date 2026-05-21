<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-Active-2563eb?style=for-the-badge&logo=readme&logoColor=white" alt="English"/></a>
  &nbsp;
  <a href="./README.fa.md"><img src="https://img.shields.io/badge/فارسی-Read-64748b?style=for-the-badge&logo=readme&logoColor=white" alt="فارسی"/></a>
</p>

# ChatBot — Local Open-Source LLM Assistant

A self-hosted chat application powered by **[Ollama](https://ollama.com)** and open-source language models. Chat runs entirely on your machine—no paid LLM API required. The web UI supports **Persian (RTL)** and English, with optional **RAG** over your documents and **web search** via DuckDuckGo.

---

## Features

| Feature | Description |
|--------|-------------|
| **Local LLM** | Chat via Ollama (Llama, Qwen, Mistral, Phi, etc.) |
| **Streaming** | Server-Sent Events (SSE) for real-time responses |
| **RAG** | Upload PDF/DOCX; hybrid retrieval (vector + keyword) with re-ranking |
| **Web search** | DuckDuckGo integration (no API key) |
| **Multi-model** | Switch models from the UI; embedding models excluded from chat list |
| **Thinking toggle** | Show or hide model reasoning when supported |
| **Upload progress** | Multi-file upload with SSE progress (extract → chunk → embed) |
| **REST API** | Health, models, chat, documents |

---

## Prerequisites

1. **Python 3.10+**
2. **[Ollama](https://ollama.com)** — runs models locally

### Install Ollama and a chat model

```bash
ollama pull qwen2.5:7b
ollama run qwen2.5
```

**Other models (Persian-friendly):**

- `ollama run mshojaei77/gemma3persian`
- `ollama run partai/dorna-llama3`

**For RAG (embeddings):**

```bash
ollama pull nomic-embed-text
```

---

## Quick start

### 1. Virtual environment and dependencies

```bash
cd backend
python -m venv venv
```

**Windows:**

```cmd
venv\Scripts\pip install -r requirements.txt
```

**Linux / macOS:**

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run the server

**Windows:** double-click `run-server.bat` from the project root, or:

```cmd
cd D:\ChatBot
run-server.bat
```

**Manual (from `backend/`):**

```bash
venv\Scripts\python -m uvicorn main:app --host 0.0.0.0 --port 8765
```

### 3. Open the UI

**http://localhost:8765**

---

## RAG (document Q&A)

1. `ollama pull nomic-embed-text`
2. Sidebar → **+ Upload** → PDF or DOCX files
3. Enable **Search in documents (RAG)** and ask questions

---

## Configuration

Create `backend/.env` (optional):

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5
OLLAMA_EMBED_MODEL=nomic-embed-text
RAG_CHUNK_SIZE=500
RAG_CHUNK_OVERLAP=80
RAG_TOP_K=10
RAG_HYBRID_ALPHA=0.7
RAG_CANDIDATES_MULTIPLIER=3
```

---

## Project structure

```
ChatBot/
├── backend/
│   ├── main.py
│   ├── rag.py
│   ├── web_search.py
│   ├── config.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── README.md
└── README.fa.md
```

---

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Ollama status and models |
| `GET` | `/api/models` | Chat models |
| `POST` | `/api/chat` | Chat (supports `use_rag`, `use_web_search`, `stream`) |
| `GET` | `/api/documents` | Uploaded documents |
| `POST` | `/api/documents/upload` | Multi-file upload (SSE) |
| `DELETE` | `/api/documents/{id}` | Delete document |

---

## License

[MIT License](./LICENSE)

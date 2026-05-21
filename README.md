<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-Active-2563eb?style=for-the-badge&logo=readme&logoColor=white" alt="English"/></a>
  &nbsp;
  <a href="./README.fa.md"><img src="https://img.shields.io/badge/فارسی-Read-64748b?style=for-the-badge&logo=readme&logoColor=white" alt="فارسی"/></a>
</p>

# ollama-chat-rag

A self-hosted chat UI powered by **[Ollama](https://ollama.com)** and open-source language models. Conversations run on your machine—no paid LLM API. The web UI is **Persian (RTL)** with English-friendly content; the repo name reflects the planned **RAG** layer for document Q&A.

---

## Features

| Feature | Description |
|--------|-------------|
| **Local LLM** | Chat via Ollama (Llama, Qwen, Mistral, Phi, etc.) |
| **Streaming** | Server-Sent Events (SSE) for real-time responses |
| **Multi-model** | Switch models from the sidebar |
| **REST API** | Health check, model list, chat |
| **Static UI** | Served from `./frontend` by the same FastAPI process |

---

## Prerequisites

1. **Python 3.10+**
2. **[Ollama](https://ollama.com)** running locally

### Install Ollama and a chat model

```bash
ollama pull qwen2.5:7b
ollama run qwen2.5
```

**Other models (Persian-friendly):**

- `ollama run mshojaei77/gemma3persian`
- `ollama run partai/dorna-llama3`

---

## Quick start

From the project root (`ollama-chat-rag/`):

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

**Windows** — from the project root:

```cmd
.\run-server.bat
```

or:

```powershell
.\run-server.ps1
```

**Manual** — from `./backend/`:

```bash
# Windows
venv\Scripts\python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Linux / macOS
venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Open the UI

**http://localhost:8000**

---

## Configuration

Optional: create `./backend/.env`

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5
```

---

## Project structure

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

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Ollama status and installed models |
| `GET` | `/api/models` | List of models |
| `POST` | `/api/chat` | Chat (`stream`: true for SSE) |

**Example** (`POST /api/chat`):

```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "model": "qwen2.5",
  "stream": true
}
```

---

## License

[MIT License](./LICENSE)

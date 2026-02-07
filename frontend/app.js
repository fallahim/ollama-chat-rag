const API_BASE = window.location.origin;

const chatEl = document.getElementById("chat");
const welcomeEl = document.getElementById("welcome");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");
const btnSend = document.getElementById("btn-send");
const modelSelect = document.getElementById("model-select");
const statusEl = document.getElementById("status");
const btnNew = document.getElementById("btn-new");

let messages = [];
let isStreaming = false;

// Auto-resize textarea
inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 200) + "px";
});

// Load models and health
async function checkHealth() {
  try {
    const r = await fetch(`${API_BASE}/api/health`);
    const data = await r.json();
    if (data.ok) {
      statusEl.className = "status ok";
      statusEl.querySelector(".status-text").textContent = "متصل";
      if (data.models && data.models.length) {
        modelSelect.innerHTML = data.models
          .map((m) => `<option value="${m}" ${m === data.default ? "selected" : ""}>${m}</option>`)
          .join("");
      }
      return true;
    } else {
      statusEl.className = "status err";
      statusEl.querySelector(".status-text").textContent = data.error || "خطا";
      return false;
    }
  } catch (e) {
    statusEl.className = "status err";
    statusEl.querySelector(".status-text").textContent = "بدون اتصال به سرور";
    return false;
  }
}

async function loadModels() {
  try {
    const r = await fetch(`${API_BASE}/api/models`);
    const data = await r.json();
    if (data.models && data.models.length) {
      const current = modelSelect.value;
      modelSelect.innerHTML = data.models
        .map((m) => `<option value="${m.name}">${m.name}</option>`)
        .join("");
      if (current) modelSelect.value = current;
    }
  } catch (_) {}
}

function addMessage(role, content, isPlaceholder = false) {
  chatEl.classList.add("has-messages");
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  const avatar = role === "user" ? "تو" : "◆";
  div.innerHTML = `
    <span class="avatar">${avatar}</span>
    <div class="content ${isPlaceholder ? "loading" : ""}">${escapeHtml(content)}</div>
  `;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div.querySelector(".content");
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text || isStreaming) return;

  const model = modelSelect.value || undefined;
  messages.push({ role: "user", content: text });
  addMessage("user", text);
  inputEl.value = "";
  inputEl.style.height = "auto";

  const contentEl = addMessage("assistant", "", true);
  isStreaming = true;
  btnSend.disabled = true;

  const apiMessages = messages.map((m) => ({ role: m.role, content: m.content }));
  let fullContent = "";

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        model,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || res.statusText);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        const raw = line.slice(6);
        if (raw === "[DONE]") continue;
        try {
          const data = JSON.parse(raw);
          if (data.error) {
            fullContent = data.error;
            break;
          }
          const part = data.message?.content ?? data.response ?? "";
          if (part) {
            fullContent += part;
            contentEl.classList.remove("loading");
            contentEl.textContent = fullContent;
            chatEl.scrollTop = chatEl.scrollHeight;
          }
          if (data.done) break;
        } catch (_) {}
      }
    }

    if (fullContent) {
      contentEl.classList.remove("loading");
      contentEl.textContent = fullContent;
      messages.push({ role: "assistant", content: fullContent });
    }
  } catch (err) {
    contentEl.classList.remove("loading");
    contentEl.textContent = "خطا: " + err.message;
  }

  isStreaming = false;
  btnSend.disabled = false;
  chatEl.scrollTop = chatEl.scrollHeight;
});

btnNew.addEventListener("click", () => {
  messages = [];
  const msgs = chatEl.querySelectorAll(".msg");
  msgs.forEach((m) => m.remove());
  chatEl.classList.remove("has-messages");
  welcomeEl.style.display = "";
});

// Enter to send, Shift+Enter new line
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

checkHealth().then((ok) => {
  if (ok) loadModels();
});
setInterval(checkHealth, 15000);

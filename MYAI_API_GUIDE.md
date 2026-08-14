# Calling the MyAI API from Code

Your `/myai` chat is backed by a plain OpenAI-compatible HTTP API. This doc
shows how to call it directly from your own code — curl, JavaScript/TypeScript,
Python, and via the official `openai` SDKs — instead of through a browser or
IDE extension.

## Base URL & Auth

```
Base URL:  https://riaz-ai.vercel.app/api/v1
Auth:      Authorization: Bearer <your-access-code>
```

`<your-access-code>` is whatever value you set as `MYAI_ACCESS_CODE` in
Vercel's environment variables. If that env var isn't set at all, the API is
open and any bearer token value works — fine for local dev, not recommended
once deployed publicly.

## Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/chat/completions` | `POST` | Send messages, get a completion (streamed or not) |
| `/models` | `GET` | List available model IDs |

## Available models

```
nvidia/nemotron-3-nano-30b-a3b            — fast & light
stepfun-ai/step-3.7-flash                 — fast coding
nvidia/nemotron-3-super-120b-a12b         — heavy coding & reasoning
nvidia/nemotron-3.5-lightning-30b-a3b     — reasoning
z-ai/glm-5.2                              — reasoning
minimaxai/minimax-m2.7                    — agentic coding
minimaxai/minimax-m3                      — multimodal coding
nvidia/llama-3.3-nemotron-super-49b-v1.5  — general
nvidia/nemotron-mini-4b-instruct          — fast & light
openai/gpt-oss-120b                       — general
openai/gpt-oss-20b                        — fast & light
meta/llama-3.1-70b-instruct               — general
mistralai/mistral-nemotron                — general
```

---

## curl

**Non-streaming:**
```bash
curl https://riaz-ai.vercel.app/api/v1/chat/completions \
  -H "Authorization: Bearer <your-access-code>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nvidia/nemotron-3-super-120b-a12b",
    "messages": [{"role": "user", "content": "Write a haiku about Rust"}],
    "stream": false
  }'
```

**Streaming (Server-Sent Events):**
```bash
curl https://riaz-ai.vercel.app/api/v1/chat/completions \
  -H "Authorization: Bearer <your-access-code>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nvidia/nemotron-3-nano-30b-a3b",
    "messages": [{"role": "user", "content": "Say hi in 3 words"}],
    "stream": true
  }'
```

**List models:**
```bash
curl https://riaz-ai.vercel.app/api/v1/models \
  -H "Authorization: Bearer <your-access-code>"
```

---

## JavaScript / TypeScript

### Plain `fetch` — non-streaming
```ts
const res = await fetch("https://riaz-ai.vercel.app/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <your-access-code>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [{ role: "user", content: "Explain closures in JS" }],
    stream: false,
  }),
});
const data = await res.json();
console.log(data.choices[0].message.content);
```

### Plain `fetch` — streaming
```ts
const res = await fetch("https://riaz-ai.vercel.app/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <your-access-code>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "nvidia/nemotron-3-nano-30b-a3b",
    messages: [{ role: "user", content: "Count to 5" }],
    stream: true,
  }),
});

const reader = res.body!.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });

  const events = buffer.split("\n\n");
  buffer = events.pop() || "";

  for (const event of events) {
    const line = event.trim();
    if (!line.startsWith("data:")) continue;
    const payload = line.slice(5).trim();
    if (payload === "[DONE]") continue;
    const json = JSON.parse(payload);
    const delta = json.choices?.[0]?.delta?.content;
    if (delta) process.stdout.write(delta);
  }
}
```

### Using the `openai` npm SDK
```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://riaz-ai.vercel.app/api/v1",
  apiKey: "<your-access-code>",
});

// Non-streaming
const completion = await client.chat.completions.create({
  model: "nvidia/nemotron-3-super-120b-a12b",
  messages: [{ role: "user", content: "Explain closures in JS" }],
});
console.log(completion.choices[0].message.content);

// Streaming
const stream = await client.chat.completions.create({
  model: "nvidia/nemotron-3-nano-30b-a3b",
  messages: [{ role: "user", content: "Count to 5" }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

---

## Python

### `requests` — non-streaming
```python
import requests

res = requests.post(
    "https://riaz-ai.vercel.app/api/v1/chat/completions",
    headers={"Authorization": "Bearer <your-access-code>"},
    json={
        "model": "nvidia/nemotron-3-super-120b-a12b",
        "messages": [{"role": "user", "content": "Explain closures in Python"}],
        "stream": False,
    },
)
print(res.json()["choices"][0]["message"]["content"])
```

### `requests` — streaming
```python
import requests, json

res = requests.post(
    "https://riaz-ai.vercel.app/api/v1/chat/completions",
    headers={"Authorization": "Bearer <your-access-code>"},
    json={
        "model": "nvidia/nemotron-3-nano-30b-a3b",
        "messages": [{"role": "user", "content": "Count to 5"}],
        "stream": True,
    },
    stream=True,
)

for line in res.iter_lines():
    if not line or not line.startswith(b"data: "):
        continue
    payload = line[len(b"data: "):].decode()
    if payload == "[DONE]":
        break
    delta = json.loads(payload)["choices"][0]["delta"].get("content")
    if delta:
        print(delta, end="", flush=True)
```

### Using the `openai` Python SDK
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://riaz-ai.vercel.app/api/v1",
    api_key="<your-access-code>",
)

# Non-streaming
completion = client.chat.completions.create(
    model="nvidia/nemotron-3-super-120b-a12b",
    messages=[{"role": "user", "content": "Explain closures in Python"}],
)
print(completion.choices[0].message.content)

# Streaming
stream = client.chat.completions.create(
    model="nvidia/nemotron-3-nano-30b-a3b",
    messages=[{"role": "user", "content": "Count to 5"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

---

## Error responses

Errors come back as standard HTTP status codes with an OpenAI-style body:

```json
{ "error": { "message": "Invalid API key.", "type": "invalid_request_error" } }
```

| Status | Meaning |
|---|---|
| `401` | Missing/wrong `Authorization` bearer token |
| `400` | Malformed request body, or `messages` missing |
| `500` | Server is missing `NVIDIA_API_KEY` (deployment misconfiguration) |
| `502` | NVIDIA's upstream API returned an error |

## Reasoning models

Some models (e.g. `nvidia/nemotron-3.5-lightning-30b-a3b`) stream a
`reasoning_content` field on the delta, separate from `content` — this is
NVIDIA's convention for showing the model's internal reasoning before its
final answer. If you don't care about it, just read `delta.content` as
usual and ignore `reasoning_content`.

## Where this lives in the codebase

- Route: `src/app/api/v1/chat/completions/route.ts`
- Route: `src/app/api/v1/models/route.ts`
- Both forward to NVIDIA's real API (`integrate.api.nvidia.com`) using the
  server-side `NVIDIA_API_KEY` env var — your access code never touches
  NVIDIA directly, and your NVIDIA key never reaches the caller.

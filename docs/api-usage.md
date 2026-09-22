# Using the API (`/api/v1`)

This project exposes an OpenAI-compatible Chat Completions API backed by NVIDIA's hosted models. Because it matches the OpenAI wire format, any tool that supports a custom "OpenAI base URL" (Cline, Continue, Cursor, LM Studio, the `openai` SDK, etc.) can talk to it directly.

## Endpoints

| Method | Path                    | Purpose                          |
|--------|-------------------------|-----------------------------------|
| GET    | `/api/v1/models`        | List available model IDs          |
| POST   | `/api/v1/chat/completions` | Chat completion (streaming or not) |

Base URL is wherever this app is deployed, e.g. `https://<your-deployment>.vercel.app`, or `http://localhost:3000` in dev.

## Authentication

Auth is controlled by the `MYAI_ACCESS_CODE` environment variable:

- **If `MYAI_ACCESS_CODE` is unset** — both endpoints are open, no `Authorization` header required.
- **If `MYAI_ACCESS_CODE` is set** — every request must send:

  ```
  Authorization: Bearer <MYAI_ACCESS_CODE>
  ```

  A missing/incorrect token returns `401` with:
  ```json
  { "error": { "message": "Invalid API key.", "type": "invalid_request_error" } }
  ```

The server also requires `NVIDIA_API_KEY` to be set (this is never exposed to the client) — if missing, requests fail with `500`.

## List models — `GET /api/v1/models`

```bash
curl https://<your-deployment>/api/v1/models \
  -H "Authorization: Bearer $MYAI_ACCESS_CODE"
```

Response (OpenAI-style list):

```json
{
  "object": "list",
  "data": [
    { "id": "nvidia/nemotron-3-super-120b-a12b", "object": "model", "created": 0, "owned_by": "nvidia" },
    { "id": "openai/gpt-oss-120b", "object": "model", "created": 0, "owned_by": "openai" }
  ]
}
```

Current model IDs (kept in sync with `src/app/myai/page.tsx`):

- `nvidia/nemotron-3-nano-30b-a3b`
- `stepfun-ai/step-3.7-flash`
- `nvidia/nemotron-3-super-120b-a12b` (default)
- `nvidia/nemotron-3.5-lightning-30b-a3b`
- `z-ai/glm-5.2`
- `minimaxai/minimax-m2.7`
- `minimaxai/minimax-m3`
- `nvidia/llama-3.3-nemotron-super-49b-v1.5`
- `nvidia/nemotron-mini-4b-instruct`
- `openai/gpt-oss-120b`
- `openai/gpt-oss-20b`
- `meta/llama-3.1-70b-instruct`
- `mistralai/mistral-nemotron`
- `moonshotat/kimi-k3`

## Chat completion — `POST /api/v1/chat/completions`

Request body follows the standard OpenAI Chat Completions shape:

```bash
curl https://<your-deployment>/api/v1/chat/completions \
  -H "Authorization: Bearer $MYAI_ACCESS_CODE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nvidia/nemotron-3-super-120b-a12b",
    "messages": [
      { "role": "user", "content": "Hello, who are you?" }
    ],
    "stream": false
  }'
```

Notes:

- `messages` is required and must be a non-empty array.
- `model` is optional — defaults to `nvidia/nemotron-3-super-120b-a12b`.
- `stream` defaults to `true`. Pass `"stream": false` for a single JSON response instead of a Server-Sent Events (SSE) stream.
- Any other fields you pass through (`temperature`, `max_tokens`, `top_p`, etc.) are forwarded as-is to NVIDIA's API.
- **`top_p` override:** for a few models the upstream API rejects any `top_p` other than a fixed value, so the server silently overrides whatever `top_p` you send:
  - `nvidia/nemotron-3-nano-30b-a3b` → `0.95`
  - `nvidia/nemotron-3-super-120b-a12b` → `0.95`
  - `moonshotat/kimi-k3` → `0.95`

### Streaming response

With `stream: true` (default), the response is `text/event-stream` — identical to OpenAI's SSE chat streaming format, so any OpenAI-compatible streaming client works unmodified.

### Non-streaming response

With `stream: false`, you get the full JSON completion object back in one response, forwarded as-is from NVIDIA.

### Error responses

| Status | Cause                                         |
|--------|-----------------------------------------------|
| 400    | Invalid JSON body, or missing/empty `messages` |
| 401    | Missing/incorrect `Authorization` bearer token |
| 500    | Server missing `NVIDIA_API_KEY`                |
| upstream status (e.g. 502) | NVIDIA API returned an error       |

All errors follow: `{ "error": { "message": "...", "type": "..." } }`.

## Using it with the `openai` SDK

Since the endpoint is OpenAI-compatible, you can point the official SDK at it:

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.MYAI_ACCESS_CODE, // only needed if MYAI_ACCESS_CODE is set server-side
  baseURL: "https://<your-deployment>/api/v1",
});

const completion = await client.chat.completions.create({
  model: "nvidia/nemotron-3-super-120b-a12b",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(completion.choices[0].message);
```

The same works with Python's `openai` SDK by setting `base_url` and `api_key` the same way, or with any tool/IDE plugin that accepts a custom "OpenAI base URL + API key".

## Environment variables required

Set these in `.env.local` (dev) or your Vercel project's environment variables (prod):

```
NVIDIA_API_KEY=nvapi-xxx     # required — NVIDIA integrate.api.nvidia.com key
MYAI_ACCESS_CODE=your-secret # optional — if set, required as the Bearer token for callers
```

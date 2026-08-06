# todo-mcp-http

The same todo MCP server as [`todo-mcp`](../todo-mcp/), but served over
**Streamable HTTP** on localhost instead of stdio — demo for the talk
[MCP — Plug Your Agent Into Everything](https://kha.do/talks/2026-02-mcp/) (FIT-HCMUS).

Same capabilities: tools `add_task` · `list_tasks` · `complete_task`,
resource `todo://list`, prompt `plan_my_day` — plus a **REST API** over the
same state (see below).

## Why this variant exists — the state lesson

| | stdio (`todo-mcp`) | HTTP (this) |
| --- | --- | --- |
| Who starts the server | each host spawns its own child process | **you** start one process, hosts connect to it |
| Processes | one **per host** | **one**, shared |
| State | separate list per host, dies with the session | **one list shared by every client**, lives until you stop the server |

Two Claude Code windows connected to this server see (and edit) the **same**
todo list. With the stdio variant, each window has its own.

Sessions still exist: each client gets its own `Mcp-Session-Id` (protocol
bookkeeping), but the `tasks` array is module-level — one per process.

## Run

```bash
npm install
npm start          # → http://localhost:3001/mcp  (PORT=xxxx to change)
```

## Test with the MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

In the UI choose **Streamable HTTP** and enter `http://localhost:3001/mcp`.

## Plug into Claude Code

```bash
claude mcp add --transport http todo-http http://localhost:3001/mcp
```

Open two terminal windows running `claude`, add a task in one, list in the
other — shared state, live.

## REST API — the same state, a second door

Three endpoints mirroring the three MCP tools, on the same server &amp; state:

```bash
curl http://localhost:3001/api/tasks                          # list
curl -X POST http://localhost:3001/api/tasks \
  -H 'Content-Type: application/json' -d '{"text":"hello"}'   # add → 201
curl -X POST http://localhost:3001/api/tasks/1/complete       # complete
```

Add a task with `curl`, then ask Claude to `list_tasks` — it's there.
**REST is the door for humans and scripts; MCP is the door for models.**
Same operations underneath (`addTask` / `completeTask` helpers).

## claude.ai web?

Still no: custom connectors on claude.ai require a **publicly reachable**
URL (Claude connects from Anthropic's cloud, not your machine). To demo that,
tunnel this server (e.g. `ngrok http 3001`) or deploy it — and note that real
remote servers add OAuth, which this demo skips.

## Notes

- State is in-memory: restarting the process clears the list (persist to a
  file/SQLite as an exercise).
- `DELETE /mcp` with a session id ends that session; `GET /mcp` opens the
  server→client notification stream.

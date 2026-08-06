# todo-mcp

A minimal MCP server over **stdio** — the demo from the talk
[MCP — Plug Your Agent Into Everything](https://kha.do/talks/2026-02-mcp/) (FIT-HCMUS).

What it exposes:

| Kind     | Name                                    | What it does                     |
| -------- | --------------------------------------- | -------------------------------- |
| Tool     | `add_task`                              | Add a task to the list           |
| Tool     | `list_tasks`                            | List all tasks with status       |
| Tool     | `complete_task`                         | Mark a task as done (`isError` if the id doesn't exist) |
| Resource | `todo://list`                           | The current list as plain text   |
| Prompt   | `plan_my_day`                           | Ask the model to plan your day   |

State is **in-memory** — it resets every time the host restarts the server,
and each host gets its own process (= its own list). For the one-process,
shared-state variant over HTTP, see [`todo-mcp-http`](../todo-mcp-http/).

## Setup

```bash
npm install
```

## Test with the MCP Inspector

```bash
npm run inspect     # = npx @modelcontextprotocol/inspector node server.js
```

Opens a browser UI where you can call every tool, read the resource, and watch
the raw JSON-RPC messages — no LLM involved.

## Plug into Claude Code

```bash
claude mcp add todo -- node /absolute/path/to/server.js
claude          # then try: Add "finish MCP homework" to my todos, then show the list.
```

The prompt appears as `/todo:plan_my_day`; check the connection with `/mcp`.

## Plug into Claude Desktop

Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "todo": {
      "command": "node",
      "args": ["/absolute/path/to/server.js"]
    }
  }
}
```

Note: this is a **stdio** server, so it works in hosts that can spawn a local
process (Claude Code, Claude Desktop, the Inspector, your own agent). claude.ai
web only accepts **remote HTTP** servers via custom connectors.

## Gotcha worth remembering

On stdio, **stdout belongs to the protocol** — one stray `console.log()`
corrupts the JSON-RPC stream. Log with `console.error()` instead.
